import Avatar from "./Avatar";

export default function ConversationItem({ conv, active, onClick, theme }) {

  const token = JSON.parse(atob(localStorage.getItem("token").split(".")[1]));
const myId = token.userId;

const otherUser = conv.participants.find(
  (p) => p._id !== myId
);
  return (
    <button
      onClick={onClick}
      className="conv-item"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        width: "100%",
        textAlign: "left",
        padding: "10px 14px",
        borderRadius: 16,
        border: "none",
        cursor: "pointer",
        background: active ? theme.accentSoft : "transparent",
        transition: "background 150ms ease",
      }}
    >
      <Avatar name={otherUser?.name || "Unknown"} color={otherUser?.avatar} online={otherUser?.isOnline} theme={theme} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span
            style={{
              fontWeight: 600,
              fontSize: 14.5,
              color: theme.textPrimary,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {otherUser?.name || "Unknown"}
          </span>
          <span style={{ fontSize: 12, color: theme.textTertiary, flexShrink: 0, marginLeft: 8 }}>
            {conv.lastMessage
  ? new Date(conv.lastMessage.createdAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  : ""}
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 2 }}>
          <span
            style={{
              fontSize: 13,
              color: conv.unread ? theme.textPrimary : theme.textSecondary,
              fontWeight: conv.unread ? 500 : 400,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "88%",
            }}
          >
            {conv.lastMessage?.text || "No messages yet"}
          </span>
          {conv.unread > 0 && (
            <span
              style={{
                background: theme.accent,
                color: "#fff",
                fontSize: 11,
                fontWeight: 700,
                borderRadius: 999,
                minWidth: 18,
                height: 18,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 5px",
                flexShrink: 0,
              }}
            >
              {conv.unread}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
