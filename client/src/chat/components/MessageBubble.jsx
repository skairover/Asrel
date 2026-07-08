import { useState} from "react";
import { motion } from "framer-motion";
import formatTime from "../utils/formatTime";
import { CheckCheck, Check, Smile, Reply, MoreVertical, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import REACTIONS from "../constants/reactions";

export default function MessageBubble({
  msg, mine, grouped, theme, onReact, onReply, onEdit, onDelete, isLast,
}) {

  const [hover, setHover] = useState(false);
  const [showReactionBar, setShowReactionBar] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(msg.text);
  const [menuOpen, setMenuOpen] = useState(false);

  const saveEdit = () => {
    if (draft.trim()) onEdit(msg.id, draft.trim());
    setEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setShowReactionBar(false); setMenuOpen(false); }}
      style={{
        display: "flex",
        flexDirection: mine ? "row-reverse" : "row",
        alignItems: "flex-end",
        gap: 8,
        marginTop: grouped ? 3 : 12,
        position: "relative",
      }}
    >
      <div style={{ maxWidth: "70%", display: "flex", flexDirection: "column", alignItems: mine ? "flex-end" : "flex-start" }}>
        {msg.replyTo && (
          <div
            style={{
              fontSize: 12,
              color: theme.textSecondary,
              background: theme.surfaceAlt,
              borderLeft: `3px solid ${theme.accent}`,
              padding: "4px 10px",
              borderRadius: 8,
              marginBottom: 4,
              maxWidth: "100%",
            }}
          >
            {msg.replyTo}
          </div>
        )}

        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 6 }}>
          {/* hover action row */}
          {hover && !editing && (
            <div
              style={{
                display: "flex",
                gap: 2,
                order: mine ? 0 : 1,
                background: theme.surface,
                border: `1px solid ${theme.border}`,
                borderRadius: 999,
                padding: 3,
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              <button
                aria-label="React"
                onClick={() => setShowReactionBar((s) => !s)}
                className="icon-btn-sm"
                style={{ color: theme.textSecondary }}
              >
                <Smile size={14} />
              </button>
              <button
                aria-label="Reply"
                onClick={() => onReply(msg)}
                className="icon-btn-sm"
                style={{ color: theme.textSecondary }}
              >
                <Reply size={14} />
              </button>
              {mine && (
                <button
                  aria-label="More options"
                  onClick={() => setMenuOpen((s) => !s)}
                  className="icon-btn-sm"
                  style={{ color: theme.textSecondary }}
                >
                  <MoreVertical size={14} />
                </button>
              )}
            </div>
          )}

          {editing ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 220 }}>
              <textarea
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={2}
                style={{
                  resize: "none",
                  borderRadius: 14,
                  border: `1px solid ${theme.border}`,
                  padding: "8px 12px",
                  fontFamily: "inherit",
                  fontSize: 14.5,
                  background: theme.surface,
                  color: theme.textPrimary,
                  outline: "none",
                }}
              />
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button onClick={() => setEditing(false)} className="pill-btn" style={{ color: theme.textSecondary, background: theme.surfaceAlt }}>Cancel</button>
                <button onClick={saveEdit} className="pill-btn" style={{ color: "#fff", background: theme.accent }}>Save</button>
              </div>
            </div>
          ) : (
            <div
              style={{
                background: mine ? theme.accent : theme.bubbleReceived,
                color: mine ? "#fff" : theme.bubbleReceivedText,
                padding: msg.image ? 6 : "9px 14px",
                borderRadius: 18,
                borderBottomRightRadius: mine ? 6 : 18,
                borderBottomLeftRadius: mine ? 18 : 6,
                fontSize: 14.5,
                lineHeight: 1.45,
                wordBreak: "break-word",
                boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
              }}
            >
              {msg.image && (
                <Image
                  src={msg.image}
                  alt="Attachment"
                  width={220}
                  height={220}
                  style={{  borderRadius: 14, display: "block", marginBottom: msg.text ? 6 : 0 }}
                />
              )}
              {msg.deleted ? (
                <span style={{ fontStyle: "italic", opacity: 0.7 }}>Message removed</span>
              ) : (
                msg.text
              )}
              {msg.edited && !msg.deleted && (
                <span style={{ fontSize: 10.5, opacity: 0.65, marginLeft: 6 }}>(edited)</span>
              )}
            </div>
          )}

          {menuOpen && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 6px)",
                right: mine ? 0 : "auto",
                left: mine ? "auto" : 0,
                background: theme.surface,
                border: `1px solid ${theme.border}`,
                borderRadius: 12,
                boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
                overflow: "hidden",
                zIndex: 5,
                minWidth: 130,
              }}
            >
              <button
                onClick={() => { setEditing(true); setMenuOpen(false); }}
                className="menu-item"
                style={{ color: theme.textPrimary }}
              >
                <Pencil size={13} /> Edit
              </button>
              <button
                onClick={() => { onDelete(msg.id); setMenuOpen(false); }}
                className="menu-item"
                style={{ color: theme.danger }}
              >
                <Trash2 size={13} /> Delete
              </button>
            </div>
          )}

          {showReactionBar && (
            <div
              style={{
                position: "absolute",
                bottom: "calc(100% + 6px)",
                left: mine ? "auto" : 0,
                right: mine ? 0 : "auto",
                background: theme.surface,
                border: `1px solid ${theme.border}`,
                borderRadius: 999,
                padding: "4px 6px",
                display: "flex",
                gap: 2,
                boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
                zIndex: 5,
              }}
            >
              {REACTIONS.map((r) => (
                <button
                  key={r}
                  onClick={() => { onReact(msg.id, r); setShowReactionBar(false); }}
                  style={{ fontSize: 16, padding: "2px 4px", background: "none", border: "none", cursor: "pointer" }}
                >
                  {r}
                </button>
              ))}
            </div>
          )}
        </div>

        {msg.reactions && msg.reactions.length > 0 && (
          <div style={{ display: "flex", gap: 3, marginTop: 4 }}>
            {msg.reactions.map((r, i) => (
              <span
                key={i}
                style={{
                  fontSize: 12.5,
                  background: theme.surfaceAlt,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 999,
                  padding: "1px 6px",
                }}
              >
                {r}
              </span>
            ))}
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 3, padding: "0 4px" }}>
          <span style={{ fontSize: 11, color: theme.textTertiary }}>{formatTime(msg.time)}</span>
          {mine && isLast && (
            msg.status === "seen" ? (
              <CheckCheck size={13} style={{ color: theme.accent }} />
            ) : msg.status === "delivered" ? (
              <CheckCheck size={13} style={{ color: theme.textTertiary }} />
            ) : (
              <Check size={13} style={{ color: theme.textTertiary }} />
            )
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ---------------------------------------------------------
   EMPTY STATE
--------------------------------------------------------- */
function EmptyState({ theme }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, padding: 24 }}>
      <div
        style={{
          width: 86,
          height: 86,
          borderRadius: "50%",
          background: theme.accentSoft,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MessageCircle size={36} style={{ color: theme.accent }} strokeWidth={1.5} />
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontWeight: 600, fontSize: 16, color: theme.textPrimary }}>Your messages</div>
        <div style={{ fontSize: 13.5, color: theme.textSecondary, marginTop: 4 }}>
          Pick a conversation from the list to start chatting.
        </div>
      </div>
    </div>
  );
}