import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Moon, Sun } from "lucide-react";
import MessageList from "../chat/components/MessageList";
import useChat from "../chat/hooks/useChat";
import MessageComposer from "../chat/components/MessageComposer";
import ConversationItem from "../chat/components/ConversationItem";
import ChatHeader from "../chat/components/ChatHeader";
import THEMES from "../chat/constants/themes";
import { useRouter } from "next/router";




const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');`;


export default function App() {
 const router = useRouter();
 const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const { id } = router.query;
  const [mode, setMode] = useState("light");
  const theme = THEMES[mode];
  const [search, setSearch] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [searchResults, setSearchResults] = useState([]);


  useEffect(() => {
  const timeout = setTimeout(async () => {
    if (!search.trim()) {
      setSearchResults([]);
      return;
    }

    const token = localStorage.getItem("token");

    const res = await fetch(
      `${API_URL}/api/users/search?q=${encodeURIComponent(search)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    setSearchResults(data);
  }, 300);

  return () => clearTimeout(timeout);
}, [search]);


    const onImagePicked = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPendingImage(ev.target.result);
    reader.readAsDataURL(file);
  };


  const onDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) onImagePicked(file);
  };

  const {
    draft,
    setDraft,

    mobileView,
    setMobileView,

    conversations,
    selectedConv,
    selectedId,
    messages,

    typing,
    replyingTo,
    loadingConv,
    unreadSnapshot,
    pendingImage,
    setPendingImage,

    openConversation,
    sendMessage,
    editMessage,
    deleteMessage,
    reactToMessage,
    loadOlderMessages,
    setReplyingTo,
     currentUserId,
     loadConversations,
  } = useChat();
  console.log({
  id,
  selectedId,
  selectedConv,
  conversations,
});
useEffect(() => {
  if (!id) return;
  if (conversations.length === 0) return;

  openConversation(id);
}, [id, conversations]);

const filteredConvs = useMemo(() => {
  if (!currentUserId) return conversations;

  return conversations.filter((c) => {
    const otherUser = c.participants.find(
      (p) => p._id !== currentUserId
    );

    return (otherUser?.name || "")
      .toLowerCase()
      .includes(search.toLowerCase());
  });
}, [conversations, search, currentUserId]);

async function startConversation(userId) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/api/conversations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      recipientId: userId,
    }),
  });

const conversation = await res.json();

router.push(`/chat?id=${conversation._id}`);
setSearch("");
setSearchResults([]);
}
console.log("mobileView:", mobileView);
  return (
    <div
      style={{
        fontFamily: "'Inter', system-ui, sans-serif",
        background: theme.appBg,
        color: theme.textPrimary,
        height: "100vh",
        width: "100%",
        display: "flex",
        overflow: "hidden",
        transition: "background 200ms ease, color 200ms ease",
      }}
    >
      <style>{`
        ${FONT_IMPORT}
        * { box-sizing: border-box; }
        ::selection { background: ${theme.accentSoft}; }
        .conv-item:hover { background: ${theme.surfaceAlt} !important; }
        .icon-btn-sm { width: 26px; height: 26px; display:flex; align-items:center; justify-content:center; border-radius:999px; border:none; background:none; cursor:pointer; }
        .icon-btn-sm:hover { background: ${theme.surfaceAlt}; }
        .header-icon-btn { width: 38px; height: 38px; display:flex; align-items:center; justify-content:center; border-radius: 999px; border: 1px solid ${theme.border}; background: ${theme.surface}; cursor:pointer; transition: background 150ms ease, transform 100ms ease; color: ${theme.textSecondary}; }
        .header-icon-btn:hover { background: ${theme.surfaceAlt}; }
        .header-icon-btn:active { transform: scale(0.94); }
        .header-icon-btn:focus-visible, .icon-btn-sm:focus-visible, .conv-item:focus-visible, .composer-btn:focus-visible, .send-btn:focus-visible {
          outline: 2px solid ${theme.accent}; outline-offset: 2px;
        }
        .pill-btn { border:none; border-radius: 999px; padding: 6px 14px; font-size: 12.5px; font-weight: 600; cursor: pointer; }
        .menu-item { display:flex; align-items:center; gap:8px; width:100%; padding:9px 12px; font-size:13px; background:none; border:none; cursor:pointer; text-align:left; }
        .menu-item:hover { background: ${theme.surfaceAlt}; }
        .composer-btn { width: 36px; height: 36px; border-radius: 999px; border: none; background: none; display:flex; align-items:center; justify-content:center; cursor:pointer; color: ${theme.textSecondary}; transition: background 150ms ease, color 150ms ease; }
        .composer-btn:hover { background: ${theme.surfaceAlt}; color: ${theme.textPrimary}; }
        .send-btn { border:none; border-radius: 999px; width: 40px; height:40px; display:flex; align-items:center; justify-content:center; cursor:pointer; background: ${theme.accent}; color:#fff; transition: transform 100ms ease, opacity 150ms ease; }
        .send-btn:hover { opacity: 0.9; }
        .send-btn:active { transform: scale(0.92); }
        .send-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .online-pulse { box-shadow: 0 0 0 0 rgba(49,194,115,0.5); animation: pulse 2.2s infinite; }
        @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(49,194,115,0.45);} 70% { box-shadow: 0 0 0 6px rgba(49,194,115,0);} 100% { box-shadow: 0 0 0 0 rgba(49,194,115,0);} }
        .scroll-thin::-webkit-scrollbar { width: 6px; }
        .scroll-thin::-webkit-scrollbar-thumb { background: ${theme.border}; border-radius: 999px; }
        .search-input::placeholder { color: ${theme.textTertiary}; }
        textarea:focus, input:focus { outline: none; }
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.001ms !important; transition-duration: 0.001ms !important; }
        }
        .skeleton { background: linear-gradient(90deg, ${theme.surfaceAlt} 25%, ${theme.border} 37%, ${theme.surfaceAlt} 63%); background-size: 400% 100%; animation: shimmer 1.4s ease infinite; border-radius: 12px; }
        @keyframes shimmer { 0% { background-position: 100% 0; } 100% { background-position: -100% 0; } }
      `}</style>

      {/* ---------------- SIDEBAR ---------------- */}
      <div
        className="scroll-thin"
        style={{
          width: "100%",
          maxWidth: 380,
          minWidth: 320,
          borderRight: `1px solid ${theme.border}`,
          background: theme.surface,
          display: mobileView === "chat" ? "none" : "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            padding: "20px 18px 12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Messages</h1>
          <button
            className="header-icon-btn"
            aria-label={
              mode === "light" ? "Switch to dark mode" : "Switch to light mode"
            }
            onClick={() => setMode((m) => (m === "light" ? "dark" : "light"))}
          >
            {mode === "light" ? <Moon size={16} /> : <Sun size={16} />}
          </button>
        </div>

        <div style={{ padding: "0 18px 14px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: theme.surfaceAlt,
              borderRadius: 14,
              padding: "9px 14px",
            }}
          >
            <Search
              size={16}
              style={{ color: theme.textTertiary, flexShrink: 0 }}
            />
            <input
              className="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations"
              aria-label="Search conversations"
              style={{
                border: "none",
                background: "transparent",
                width: "100%",
                fontSize: 14,
                color: theme.textPrimary,
                fontFamily: "inherit",
              }}
            />
          </div>
        </div>

        <div
          className="scroll-thin"
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "0 8px 12px",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
{search.trim() ? (
  searchResults.map((user) => (
    <button
      key={user._id}
      onClick={() => startConversation(user._id)}
    >
      {user.name}
    </button>
  ))
) : (
  filteredConvs.map((c) => (
<ConversationItem
  key={c._id}
  conv={c}
  active={c._id === selectedId}
onClick={() => {
  router.push(`/chat?id=${c._id}`);
}}
  theme={theme}
/>
  ))
)}
          {filteredConvs.length === 0 && (
            <div
              style={{
                textAlign: "center",
                color: theme.textTertiary,
                fontSize: 13.5,
                padding: "40px 20px",
              }}
            >
              No conversations match `{search}`
            </div>
          )}
        </div>
      </div>

      {/* ---------------- CHAT AREA ---------------- */}
      <div
        style={{
          flex: 1,
          display: mobileView === "list" ? "none" : "flex",
          flexDirection: "column",
          position: "relative",
          minWidth: 0,
        }}
        onDragOver={(e) => {
          e.preventDefault();
          if (selectedConv) setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={onDrop}
      >
        {selectedConv && (
          <>
            {/*header*/}
            <ChatHeader
              selectedConv={selectedConv}
              typing={typing}
              theme={theme}
              onBack={() => setMobileView("list")}
            />

            {/* messages */}
            <MessageList
              messages={messages}
              typing={typing}
              loadingConv={loadingConv}
              loadOlder={loadOlder}
              reactToMessage={reactToMessage}
              editMessage={editMessage}
              deleteMessage={deleteMessage}
              setReplyingTo={setReplyingTo}
              unreadSnapshot={unreadSnapshot}
              currentUserId={currentUserId}
              theme={theme}
            />

            {/* drag overlay */}
            <AnimatePresence>
              {dragActive && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: theme.overlay,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 20,
                  }}
                >
                  <div
                    style={{
                      background: theme.surface,
                      border: `2px dashed ${theme.accent}`,
                      borderRadius: 20,
                      padding: "28px 40px",
                      fontWeight: 600,
                      color: theme.textPrimary,
                    }}
                  >
                    Drop image to send
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* composer */}
            <MessageComposer
              draft={draft}
              setDraft={setDraft}
              sendMessage={sendMessage}              
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
              theme={theme}
              setPendingImage={setPendingImage}
              selectedConv={selectedConv}
              pendingImage={pendingImage}
              showEmoji={showEmoji}
              setShowEmoji={setShowEmoji}
              setDragActive={setDragActive}
            />
          </>
        )}
      </div>

      {/* responsive helper: show mobile back button only under 768px */}
      <style>{`
        @media (max-width: 767px) {
          [data-mobile-back] { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
