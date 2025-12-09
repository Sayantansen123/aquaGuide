import sequelize from "../lib/db.js";
import Comments from "../models/community_forum_comment.model.js";
import CommunityForum from "../models/community_forum_model.js";

export const create_community_forum = async(req, res)=>{
    try{
        const creator_id = req.user.id
        const {title, content} = req.body
        const community = await CommunityForum.create({
            title,
            content,
            creator_id
        })
        res.status(201).json({
            "message":"Community Created succesfully",
            "data":community
        })
    }
    catch(err){
        console.error(err)
        res.status(500).json({
            "message":"Server error failed to create Community Forum"
        })
    }

}

export const get_community_forum = async (req, res)=>{
    try{
        const page = parseInt(req.query.page) || 1;
        const limit = 20;
        const offset = (page-1)*limit;
        const {count, rows} = await CommunityForum.findAndCountAll({
            include:[
                {
                    model: Comments,
                    attributes:[]
                }
            ],
            attributes:{
                include:[
                    [
                        sequelize.fn("COUNT", sequelize.col("Comments.id")),
                        "Total_Comments"
                    ]
                ]
            },
            group: ["Community_Forum.id"],
            offset,
            limit,
            order: [['created_at', 'DESC']]
        })
        res.status(200).json({
            data: rows,
            pagination:{
                total_items: count,
                total_pages: Math.ceil(count/limit),
                page_size: limit

            }
        })
    }
    catch(err){
        console.error(err.message)
        res.status(500).json({
            message: "Error occured fetching Community records please try again"
        })
    }
}

export const get_community_form_by_id = async (req, res)=>{
    try{
        const {id} = req.params
        const community_forum = await CommunityForum.findbyPK(id)
        if(community_forum == null){
            res.status(404).json({
                "message":"Community forum not found",
            })
        }
        const {count, rows} = await Comments.findAndCountAll({
            where: {forum_id: id}
        })
        res.status(200).json({
            "message": "Community_forum found successfully",
            "data": community_forum,
            "comments": rows,
            "total_comments": count 
        })
    }
    catch(err){
        console.error(err.message)
        res.status(500).json({
            message:"Error fetching community forum"
        })
    }
}

export const delete_Community_forum = async (req, res)=>{
    try{
        const user_id = req.user.id
        const user = req.user
        const {id} = req.params
        if(user.role != "admin" || user.role != "support")
        {
            const community_forum = await CommunityForum.destroy({
                where:{id: id, creator_id: user_id}
            })
            if(community_forum ===0){
                res.status(404).json({
                    "message":"Community Forum does not exist"
                })
            }
        }
        else{
            const community_forum = await CommunityForum.destroy({
                where:{id: id}
            })
            if(community_forum ===0){
                res.status(404).json({
                    "message":"Community Forum does not exist"
                })
            }
        }
        res.status(204).json({"message":"Deleted succesfully"})
    }
    catch(err){
        console.error(err.message)
        res.status(500).json({
            "message":"Server error deleting forum"
        })
    }
}

export const add_comment_to_forum = async (req, res)=>{
    try{
        const {forum_id} = req.params
        const forum = await CommunityForum.findbyPK(forum_id)
        if(forum == null){
            res.status(404).json({
                "message": "No forum found"
            })
        }
        const user_id = req.user.id
        const {content} = req.body
        const comment = Comments.create(
            user_id,
            forum_id,
            content
        )
        res.status(201).json({
            "data": comment,
            "message": "Successfully created"
        })
    }
    catch(err){
        console.error(err.message)
        res.status(500).json({
            message: "Error occured adding comment"
        })
    }
}

export const like_community = async (req, res)=>{
    try{
        const {forum_id} = req.params
        const user_id = req.user.id
        const community = await CommunityForum.findbyPK(forum_id)
        if(!community){
            res.status(404).json({"message":"Community Not found"})
        }
        if(community.likes.include(user_id)){
            const new_likes_list = community.likes.filter(id  => id!=user_id)
            community.likes = new_likes_list
            await community.save()
        }
        else{
            const newlikes = [...post.likes, user_id]
            await community.update({
                likes: newlikes
            })
        }
        await community.reload()
        res.status(200).json({
            "data": community,
            "message": "Liked successfully"
        })
    }
    catch(err){
        console.error(err.message)
        res.status(500).json({
            "message":"Some error occured liking the forum"
        })
    }
}

export const dislike_community = async (req, res)=>{
    try{
        const {forum_id} = req.params
        const user_id = req.user.id
        const community = await CommunityForum.findbyPK(forum_id)
        if(!community){
            res.status(404).json({"message":"Community Not found"})
        }
        if(community.dislikes.include(user_id)){
            const new_dislikes_list = community.likes.filter(id  => id!=user_id)
            community.dislikes = new_dislikes_list
            await community.save()
        }
        else{
            const newdislikes = [...post.dislikes, user_id]
            await community.update({
                dislikes: newdislikes
            })
        }
        await community.reload();
        res.status(200).json({
            "data": community,
            "message": "Disliked successfully"
        })
    }
    catch(err){
        console.error(err.message)
        res.status(500).json({
            "message":"Some error occured disliking the forum"
        })
    }
}
export const delete_comment = async(req, res)=>{
    try{
        const {comment_id} = req.params
        const delete_comment = await Comments.destroy({
            where: {id: comment_id}
        });
        if(delete_comment===0){
            return res.status(404).json({"message":"Comment not found"})
        }
        res.status(204).json({"message":"Comment deleted succesfully"})
    }
    catch(err){
        console.error(err.message)
        res.status(500).json({"message":"Some error occured deleting comment"})
    }
}

export const image_upload = async(req, res)=>{
    try{
        if(!req.image_file){
            res.status(400).json({
                "message": "File not found"
            })
        }
        const path = '/uploads/${req.image_file.filename}';

        return res.status(202).json({
            "message": "image uploaded successfully",
            path
        })
    }
    catch(err){
        console.error(err.message)
        return res.status(500).json({"message":"Image upload failed due to server error"})
    }
}