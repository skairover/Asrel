import { useRef } from "react";
import { Paperclip, ImageIcon, Smile, Send, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import EMOJIS from "../constants/emojis";

export default function MessageComposer({ draft,
    setDraft,
    sendMessage,

    replyingTo,
    setReplyingTo,

    selectedConv,

    pendingImage,
    setPendingImage,

    showEmoji,
    setShowEmoji,

    setDragActive,

    theme}) {

      

  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };



  return (
    <div
      style={{
        padding: "12px 20px 18px",
        borderTop: `1px solid ${theme.border}`,
        background: theme.surface,
        flexShrink: 0,
      }}
    >
      {replyingTo && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: theme.surfaceAlt,
            borderRadius: 12,
            padding: "8px 12px",
            marginBottom: 8,
            fontSize: 12.5,
            color: theme.textSecondary,
          }}
        >
          <span
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            Replying to{" "}
            {replyingTo.sender === "me" ? "yourself" : selectedConv.name}:{" "}
            {replyingTo.text}
          </span>
          <button
            onClick={() => setReplyingTo(null)}
            className="icon-btn-sm"
            aria-label="Cancel reply"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {pendingImage && (
        <div
          style={{
            position: "relative",
            display: "inline-block",
            marginBottom: 8,
          }}
        >
          <Image
            src={pendingImage}
            alt="Selected upload preview"
              width={64}
            height={64}
            style={{
              borderRadius: 12,
              display: "block",
              objectFit: "cover",
            }}
          />
          <button
            onClick={() => setPendingImage(null)}
            aria-label="Remove image"
            style={{
              position: "absolute",
              top: -6,
              right: -6,
              background: theme.textPrimary,
              color: theme.surface,
              border: "none",
              borderRadius: "50%",
              width: 20,
              height: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <X size={12} />
          </button>
        </div>
      )}

      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 6,
          position: "relative",
        }}
      >
        <button
          className="composer-btn"
          aria-label="Add attachment"
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip size={19} />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          hidden
          onChange={(e) => onImagePicked(e.target.files?.[0])}
        />

        <button
          className="composer-btn"
          aria-label="Add image"
          onClick={() => imageInputRef.current?.click()}
        >
          <ImageIcon size={19} />
        </button>
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => onImagePicked(e.target.files?.[0])}
        />

        <div style={{ flex: 1, position: "relative" }}>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write a message…"
            aria-label="Message input"
            rows={1}
            style={{
              width: "100%",
              resize: "none",
              maxHeight: 120,
              background: theme.surfaceAlt,
              border: `1px solid transparent`,
              borderRadius: 20,
              padding: "10px 44px 10px 16px",
              fontSize: 14.5,
              fontFamily: "inherit",
              color: theme.textPrimary,
              lineHeight: 1.4,
            }}
          />
          <button
            className="composer-btn"
            aria-label="Add emoji"
            onClick={() => setShowEmoji((s) => !s)}
            style={{ position: "absolute", right: 2, bottom: 2 }}
          >
            <Smile size={18} />
          </button>

          <AnimatePresence>
            {showEmoji && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                style={{
                  position: "absolute",
                  bottom: "calc(100% + 10px)",
                  right: 0,
                  background: theme.surface,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 16,
                  padding: 10,
                  display: "grid",
                  gridTemplateColumns: "repeat(6, 1fr)",
                  gap: 4,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.14)",
                  zIndex: 10,
                }}
              >
                {EMOJIS.map((e) => (
                  <button
                    key={e}
                    onClick={() => {
                      setDraft((d) => d + e);
                      setShowEmoji(false);
                    }}
                    style={{
                      fontSize: 19,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 4,
                      borderRadius: 8,
                    }}
                  >
                    {e}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          className="send-btn"
          aria-label="Send message"
          onClick={sendMessage}
          disabled={!draft.trim() && !pendingImage}
        >
          <Send size={17} />
        </button>
      </div>
      <div
        style={{
          fontSize: 11,
          color: theme.textTertiary,
          marginTop: 6,
          paddingLeft: 4,
        }}
      >
        Enter to send • Shift + Enter for a new line
      </div>
    </div>
  );
}
