import TextModel from "../models/text.model.js";

/**
 * ADMIN/SUPPORT LIST – paginated
 * GET /all_text_guides
 */
export const get_all_guides = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 20;
        const offset = (page - 1) * limit
        const { count, rows } = await TextModel.findAndCountAll({
            offset,
            limit,
            order: [['created_at', 'DESC']]
        })
        res.status(200).json({
            data: rows,
            pagination: {
                total_items: count,
                current_page: page,
                totalPages: Math.ceil(count / limit),
                pageSize: limit
            }
        })
    }
    catch (err) {
        console.error(err.message)
        res.status(500).json({ message: "Some error occured fetching all text guides" });
    }
};

/**
 * PUBLIC LIST – approved only
 * GET /get_all_guides (or /text_guides_public)
 */
export const get_text_guide = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 20;
        const offset = (page - 1) * limit
        const { count, rows } = await TextModel.findAndCountAll({
            where: { status: "approved" },
            offset,
            limit,
            order: [['created_at', 'DESC']]
        })
        res.status(200).json({
            data: rows,
            pagination: {
                total_items: count,
                current_page: page,
                totalPages: Math.ceil(count / limit),
                pageSize: limit
            }
        })
    }
    catch (err) {
        console.error(err.message)
        res.status(500).json({ message: "Error fetching all text guides" });
    }
};

/**
 * PUBLIC / ADMIN DETAIL
 * GET /get_text_guide/:id
 */
export const get_text_guide_by_id = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await TextModel.findByPk(id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // If you want to hide non-approved from public, you can additionally check role here
    res.status(200).json(item);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Error fetching text guide" });
  }
};

/**
 * CREATE – support or admin
 * POST /text_guide
 */
export const post_text_guide = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    const author = req.user.id;
    let status = "pending";

    const user = req.user;
    if (user.role === "admin") {
      status = "approved";
    }

    const text_guide = await TextModel.create({
      title,
      content,
      status,
      author,
      // no rejection workflow yet
      rejection_status: null,
      rejection_requested_by: null,
      rejection_justification: null,
    });

    res.status(201).json(text_guide);
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ message: "Some error occured creating the text guide" });
  }
};

/**
 * ADMIN APPROVE / REJECT
 * PUT /approve_or_reject/:id
 * body: { status: "approved" | "rejected" }
 */
export const approve_or_reject_text = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res
        .status(400)
        .json({ message: "Status must be 'approved' or 'rejected'" });
    }

    const text_guide = await TextModel.findByPk(id);
    if (!text_guide) {
      return res.status(404).json({ message: "Text guide not found" });
    }

    // Admin is making a final decision, clear any previous rejection workflow
    text_guide.status = status;
    text_guide.rejection_status = null;
    text_guide.rejection_requested_by = null;
    text_guide.rejection_justification = null;

    await text_guide.save();

    res
      .status(200)
      .json({ message: "Text Guide status updated successfully" });
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ message: "Some error occured approving the text guide" });
  }
};
/**
 * SUPPORT APPROVE / REQUEST REJECTION
 * PUT /approve_or_reject_text_guide/:id
 * body: 
 *   - { status: "approved" }
 *   - { status: "rejected", rejection_justification: "..." }
 */
export const approve_or_reject_for_support = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejection_justification } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res
        .status(400)
        .json({ message: "Status must be 'approved' or 'rejected'" });
    }

    const text_guide = await TextModel.findByPk(id);
    if (!text_guide) {
      return res.status(404).json({ message: "Text guide not found" });
    }

    let message;

    if (status === "rejected") {
      // SUPPORT → request rejection (does NOT immediately reject)
      if (!rejection_justification || !rejection_justification.trim()) {
        return res.status(400).json({
          message:
            "Rejection justification is required when requesting rejection",
        });
      }

      text_guide.rejection_requested_by = req.user.id;
      text_guide.rejection_justification = rejection_justification.trim();
      text_guide.rejection_status = "pending"; // waiting for admin decision
      // keep text_guide.status as-is (likely 'approved')
      message = "Text Guide rejection requested successfully";
    } else {
      // SUPPORT → directly approve, no rejection workflow active
      text_guide.status = "approved";
      text_guide.rejection_status = null;
      text_guide.rejection_requested_by = null;
      text_guide.rejection_justification = null;
      message = "Text Guide approved successfully";
    }

    await text_guide.save();

    res.status(200).json({ message });
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ message: "Some error occured approving the text guide" });
  }
};

/**
 * ADMIN APPROVE / DENY REJECTION REQUEST
 * PUT /approve_or_deny_rejection_request/:id
 * body: { rejection_status: "approved" | "denied" }
 */
export const approve_or_reject_rejection_request = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejection_status } = req.body;

    if (!["approved", "denied"].includes(rejection_status)) {
      return res.status(400).json({
        message: "rejection_status must be 'approved' or 'denied'",
      });
    }

    const text_guide = await TextModel.findByPk(id);
    if (!text_guide) {
      return res.status(404).json({ message: "Text guide not found" });
    }

    if (rejection_status === "approved") {
      // Admin agrees with support → guide becomes rejected
      text_guide.status = "rejected";
      text_guide.rejection_status = "approved";
      // keep justification + requested_by for audit/history
    } else {
      // Admin denies rejection request → guide remains/returns approved
      text_guide.status = "approved";
      text_guide.rejection_status = "denied";
      // optional: keep or clear justification; here we keep for trace
      // if you want to clear, uncomment:
      // text_guide.rejection_requested_by = null;
      // text_guide.rejection_justification = null;
    }

    await text_guide.save();

    res.status(200).json({
      message: "Text Guide rejection request processed successfully",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      message: "Some error occured processing the rejection request",
    });
  }
};


/**
 * UPDATE (EDIT) SINGLE GUIDE
 * PUT /text_guide/:id
 * body: { title, content }
 * - Admin can edit any
 * - Non-admin can edit only their own guide
 */
export const update_text_guide = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    const text_guide = await TextModel.findByPk(id);
    if (!text_guide) {
      return res.status(404).json({ message: "Text guide not found" });
    }

    // Authorization similar to Flask: admin OR author
    const isAdmin = req.user.role === "admin";
    const isOwner = text_guide.author === req.user.id;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        message: "You are not allowed to edit this text guide",
      });
    }

    text_guide.title = title;
    text_guide.content = content;
    text_guide.updated_at = new Date(); // or apply the same offset logic if you want
    if (req.user.role !== "admin"){
        text_guide.status = "pending";
    } else{

        text_guide.status = "approved";
    }
    await text_guide.save();

    res
      .status(200)
      .json({ message: "Text guide updated successfully", data: text_guide });
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ message: "Some error occured updating the text guide" });
  }
};

/**
 * DELETE SINGLE GUIDE
 * DELETE /text_guide/:id
 * - Admin only (route should already have adminRoute)
 */
export const delete_text_guide = async (req, res) => {
  try {
    const { id } = req.params;

    const text_guide = await TextModel.findByPk(id);
    if (!text_guide) {
      return res.status(404).json({ message: "Text guide not found" });
    }

    // Extra safety: ensure admin
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admins can delete text guides" });
    }

    await text_guide.destroy();

    res.status(200).json({ message: "Text guide deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ message: "Some error occured deleting the text guide" });
  }
};

/**
 * BULK ACTION (ADMIN)
 * POST /text_guides/bulk_action
 * body: { guide_ids: [id1, id2, ...], action: "approve" | "reject" | "delete" }
 */
export const bulk_action_text_guides = async (req, res) => {
  try {
    const { guide_ids, action } = req.body;

    if (!Array.isArray(guide_ids) || guide_ids.length === 0) {
      return res
        .status(400)
        .json({ message: "No text guides were selected" });
    }

    if (!["approve", "reject", "delete"].includes(action)) {
      return res.status(400).json({
        message: "Action must be one of: 'approve', 'reject', 'delete'",
      });
    }

    const guides = await TextModel.findAll({
      where: { id: guide_ids },
    });

    if (guides.length === 0) {
      return res.status(404).json({
        message: "No text guides found for the provided IDs",
      });
    }

    if (action === "delete") {
      await TextModel.destroy({ where: { id: guide_ids } });
      return res.status(200).json({
        message: `Successfully deleted ${guides.length} text guides.`,
      });
    }

    for (const guide of guides) {
      if (action === "approve") {
        guide.status = "approved";
        guide.rejection_status = null;
        guide.rejection_requested_by = null;
        guide.rejection_justification = null;
      } else if (action === "reject") {
        guide.status = "rejected";

        // If there was a pending rejection request, treat this as "approved" rejection.
        if (guide.rejection_status === "pending") {
          guide.rejection_status = "approved";
        } else {
          // direct bulk reject without request
          guide.rejection_status = null;
          guide.rejection_requested_by = null;
          guide.rejection_justification = null;
        }
      }

      await guide.save();
    }

    res.status(200).json({
      message: `Successfully ${action}d ${guides.length} text guides.`,
    });
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ message: "Some error occured processing bulk action" });
  }
};
