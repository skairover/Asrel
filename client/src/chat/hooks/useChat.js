import { useState, useEffect, useMemo, useCallback } from "react";
import { getSocket } from "../services/socket";
import { useRouter } from "next/router";
export default function useChat() {
  const [draft, setDraft] = useState("");
  const [pendingImage, setPendingImage] = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [mobileView, setMobileView] = useState("list");
  const [conversations, setConversations] = useState([]);
const router = useRouter();
const [messagesByConv, setMessagesByConv] = useState({});
  const [loadingConv, setLoadingConv] = useState(false);
  const [typing, setTyping] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [unreadSnapshot, setUnreadSnapshot] = useState(0);
  const [selectedId, setSelectedId] = useState(null);


const [currentUserId, setCurrentUserId] = useState(null);

useEffect(() => {
  if (typeof window === "undefined") return;

  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    setCurrentUserId(payload.userId);
  } catch (err) {
    console.error(err);
  }
}, []);

  useEffect(() => {
    let socket;

    const setupSocket = async () => {
      socket = await getSocket();

      socket.on("receive-message", (message) => {
        setMessagesByConv((prev) => {
          const currentMessages = prev[message.conversation] || [];

          const alreadyExists = currentMessages.some(
            (m) => m._id === message._id,
          );

          if (alreadyExists) return prev;

          return {
            ...prev,
            [message.conversation]: [...currentMessages, message],
          };
        });
      });
      socket.on("conversation-updated", (message) => {
  setConversations((prev) =>
    prev.map((conv) =>
      conv._id === message.conversation
        ? {
            ...conv,
            lastMessage: message,
            updatedAt: new Date(),
          }
        : conv,
    ),
  );
});
    };

    setupSocket();
return () => {
  socket?.off("receive-message");
  socket?.off("conversation-updated");
};
  }, []);


  const selectedConv = useMemo(
    () => conversations.find((c) => c._id === selectedId),
    [conversations, selectedId],
  );
  const messages = useMemo(
    () => messagesByConv[selectedId] || [],
    [messagesByConv, selectedId],
  );

  useEffect(() => {
    loadConversations();
  }, []);

 async function loadConversations() {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/api/chat/conversations`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    console.log("STATUS:", res.status);
    console.log("DATA:", data);

    if (!res.ok) {
      throw new Error("Failed to load conversations");
    }

    setConversations(data);
  } catch (err) {
    console.error(err);
  }
}
  
  const openConversation = useCallback(async (id) => {
    
    setSelectedId(id);
    setMobileView("chat"); 
  setLoadingConv(true);
  setReplyingTo(null);
  setDraft("");

    try {
 
      const token = localStorage.getItem("token");

      const res = await fetch(`/api/chat/messages?conversationId=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      setMessagesByConv((prev) => ({
        ...prev,
        [id]: data,
      }));
      const socket = await getSocket();

      socket.emit("join-conversation", id);


      setLoadingConv(false);
    } catch (err) {
      console.error(err);
      setLoadingConv(false);
    }
  }, [router])

  const sendMessage = async () => {
    if (!draft.trim() && !pendingImage) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/api/chat/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          conversation: selectedId,
          text: draft,
          image: pendingImage,
          replyTo: replyingTo?._id || null,
        }),
      });

      const message = await res.json();
      await loadConversations();

      setMessagesByConv((prev) => ({
        ...prev,
        [selectedId]: [...(prev[selectedId] || []), message],
      }));

      const socket = await getSocket();
      socket.emit("send-message", message);

      setDraft("");
      setPendingImage(null);
      setReplyingTo(null);
    } catch (err) {
      console.error(err);
    }
  };

  const editMessage = (msgId, newText) => {
    setMessagesByConv((prev) => ({
      ...prev,
      [selectedId]: prev[selectedId].map((m) =>
        m.id === msgId ? { ...m, text: newText, edited: true } : m,
      ),
    }));
  };

  const deleteMessage = (msgId) => {
    setMessagesByConv((prev) => ({
      ...prev,
      [selectedId]: prev[selectedId].map((m) =>
        m.id === msgId ? { ...m, deleted: true, text: "" } : m,
      ),
    }));
  };

  const reactToMessage = (msgId, emoji) => {
    setMessagesByConv((prev) => ({
      ...prev,
      [selectedId]: prev[selectedId].map((m) =>
        m.id === msgId
          ? {
              ...m,
              reactions: m.reactions.includes(emoji)
                ? m.reactions.filter((r) => r !== emoji)
                : [...m.reactions, emoji],
            }
          : m,
      ),
    }));
  };

  const loadOlderMessages = () => {
    if (loadingOlder) return;
    setLoadingOlder(true);
    setTimeout(() => {
      setMessagesByConv((prev) => {
        const arr = prev[selectedId] || [];
        const older = [
          {
            id: `${selectedId}-old-${Date.now()}`,
            sender: "them",
            text: "Hey, are you around this week?",
            time: new Date(Date.now() - 1000 * 60 * 60 * 30),
            status: "seen",
            reactions: [],
            replyTo: null,
          },
        ];
        return { ...prev, [selectedId]: [...older, ...arr] };
      });
      setLoadingOlder(false);
    }, 900);
  };

  return {
    mobileView,
    setMobileView,
    currentUserId,

    conversations,
    selectedConv,
    selectedId,
    messages,

    draft,
    setDraft,

    pendingImage,
    setPendingImage,

    showEmoji,
    setShowEmoji,

    typing,
    replyingTo,
    loadingConv,
    loadingOlder,
    unreadSnapshot,

    openConversation,
    sendMessage,
    editMessage,
    deleteMessage,
    reactToMessage,
    loadOlderMessages,
    loadConversations,
    setReplyingTo,
  };
}
