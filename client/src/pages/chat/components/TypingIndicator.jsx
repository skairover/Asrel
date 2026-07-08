import { motion } from "framer-motion";


export default function TypingIndicator({ theme }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "10px 14px" }}>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: theme.textTertiary,
            display: "inline-block",
          }}
        />
      ))}
    </div>
  );
}
