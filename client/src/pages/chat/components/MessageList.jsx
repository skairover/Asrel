import { useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import formatDateLabel from "../utils/formatDate";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";

function DateSeparator({ label, theme }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        margin: "18px 0",
      }}
    >
      <div style={{ flex: 1, height: 1, background: theme.border }} />
      <span
        style={{ fontSize: 12, fontWeight: 600, color: theme.textTertiary }}
      >
        {label}
      </span>
      <div style={{ flex: 1, height: 1, background: theme.border }} />
    </div>
  );
}
function NewMessagesDivider({ theme }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        margin: "14px 0",
      }}
    >
      <div
        style={{ flex: 1, height: 1, background: theme.danger, opacity: 0.35 }}
      />
      <span
        style={{
          fontSize: 11.5,
          fontWeight: 700,
          color: theme.danger,
          letterSpacing: 0.3,
        }}
      >
        NEW MESSAGES
      </span>
      <div
        style={{ flex: 1, height: 1, background: theme.danger, opacity: 0.35 }}
      />
    </div>
  );
}


export default function MessageList({
  messages,
  typing,
  loadingConv,
  loadingOlder,
  unreadSnapshot,

  loadOlderMessages,

  setReplyingTo,
  reactToMessage,
  editMessage,
  deleteMessage,
  currentUserId,
  theme,
}) {
  const listEndRef = useRef(null);
  const scrollBoxRef = useRef(null);

useEffect(() => {
    listEndRef.current?.scrollIntoView({
        behavior: "smooth",
    });
}, [messages, typing]);

  const dividerAt = unreadSnapshot > 0 ? messages.length - unreadSnapshot : -1;
  const rendered = [];
  let lastDate = null;
  let lastSender = null;
  messages.forEach((m, idx) => {
  const dateLabel = formatDateLabel(m.createdAt);
    if (dateLabel !== lastDate) {
      rendered.push({ type: "date", key: `date-${idx}`, label: dateLabel });
      lastDate = dateLabel;
      lastSender = null;
    }
    if (idx === dividerAt) {
      rendered.push({ type: "divider", key: `divider-${idx}` });
      lastSender = null;
    }
    rendered.push({
      type: "msg",
      key: m._id,
      msg: m,
      grouped: lastSender === m.sender,
      isLast:
        idx === messages.length - 1 || messages[idx + 1]?.sender !== m.sender,
    });
    lastSender = m.sender;
  });

  const onScroll = (e) => {
    if (e.target.scrollTop < 40) loadOlderMessages();
  };

  return (
    <div
  ref={scrollBoxRef}
  onScroll={onScroll}
  className="relative flex-1 overflow-y-auto px-5 pt-[18px] pb-2 scrollbar-thin"
>
  {loadingConv ? (
    <div className="flex flex-col gap-3.5">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className={`flex ${i % 2 ? "justify-end" : "justify-start"}`}
        >
          <div
            className="skeleton h-9 rounded-xl"
            style={{ width: 160 + (i % 3) * 40 }}
          />
        </div>
      ))}
    </div>
  ) : (
    <>
      {loadingOlder && (
        <div className="flex justify-center py-2 pb-3.5">
          <div
            className="skeleton h-6 rounded-xl"
            style={{ width: 120 }}
          />
        </div>
      )}

      {rendered.map((item) => {
        if (item.type === "date") {
          return (
            <DateSeparator
              key={item.key}
              label={item.label}
              theme={theme}
            />
          );
        }

        if (item.type === "divider") {
          return (
            <NewMessagesDivider
              key={item.key}
              theme={theme}
            />
          );
        }

        return (
          <MessageBubble
            key={item.key}
            msg={item.msg}
            mine={item.msg.sender._id === currentUserId}
            grouped={item.grouped}
            isLast={item.isLast}
            theme={theme}
            onReact={reactToMessage}
            onReply={setReplyingTo}
            onEdit={editMessage}
            onDelete={deleteMessage}
          />
        );
      })}

      <AnimatePresence>
        {typing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <TypingIndicator theme={theme} />
          </motion.div>
        )}
      </AnimatePresence>

      <div ref={listEndRef} />
    </>
  )}
</div>
  );
}
