import React, { useEffect, useState } from "react";
import SupportChatWindow from "./SupportChatWindow";
import { startSupportChat, getMySupportChats } from "@/api/support";
import { SupportChat } from "@/api/support";

const getMostRecentChat = (chats: SupportChat[]) => {
  if (!chats.length) return null;

  // sort by updatedAt DESC
  const sorted = [...chats].sort(
    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );

  // prefer accepted chat
  const accepted = sorted.find(c => c.is_accepted);
  return accepted ?? sorted[0];
};


const SupportWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔑 fetch existing chat when widget opens
  useEffect(() => {
    if (!open) return;

    const loadExistingChat = async () => {
      try {
        setLoading(true);
        const resp = await getMySupportChats();

        if (resp.success && resp.chats.length > 0) {
          const sorted = [...resp.chats].sort(
            (a, b) =>
              new Date(b.updated_at).getTime() -
              new Date(a.updated_at).getTime()
          );

          const activeChats = resp.chats.filter(
            (c) => c.status === "active"
          );

          if (activeChats.length > 0) {
            const mostRecent = [...activeChats].sort(
              (a, b) =>
                new Date(b.updated_at).getTime() -
                new Date(a.updated_at).getTime()
            )[0];

            setChatId(mostRecent.id);
          } else {
            // no active chat → show "start chat" UI
            setChatId(null);
          }

        }

      } catch (err) {
        console.error("Failed to fetch chats", err);
      } finally {
        setLoading(false);
      }
    };

    loadExistingChat();
  }, [open]);

  const handleStart = async () => {
    if (!desc.trim()) {
      setError("Please describe your issue");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const resp = await startSupportChat(desc);
      if (resp?.chat?.id) {
        setChatId(resp.chat.id);
      } else {
        setError("Failed to create chat");
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to start chat");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="bg-primary text-white px-4 py-3 rounded-full shadow-lg"
        >
          Support
        </button>
      )}

      {open && chatId && (
        <SupportChatWindow
          chatId={chatId}
          onClose={() => {
            setOpen(false);
            setChatId(null);
          }}
        />
      )}

      {open && !chatId && (
        <div className="w-64 p-3 bg-white rounded-lg shadow-lg">
          <div className="font-semibold mb-2 text-black">Need help?</div>

          {error && (
            <div className="text-red-500 text-sm mb-2">{error}</div>
          )}

          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Describe your issue..."
            className="w-full p-2 border rounded mb-2"
          />

          <button
            onClick={handleStart}
            disabled={loading}
            className="w-full bg-primary text-white p-2 rounded"
          >
            {loading ? "Starting..." : "Start Chat"}
          </button>
        </div>
      )}
    </div>
  );
};

export default SupportWidget;
