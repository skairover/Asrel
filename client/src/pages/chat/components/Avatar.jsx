 export default function Avatar({ name, color, size = 44, online, theme }) {

function initials(name = "") {
  return name
    .trim()
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: color,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 600,
          fontSize: size * 0.38,
          letterSpacing: 0.3,
        }}
      >
        {initials(name)}
      </div>
      {online && (
        <span
          aria-label="Online"
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: size * 0.28,
            height: size * 0.28,
            borderRadius: "50%",
            background: theme.online,
            border: `2px solid ${theme.surface}`,
          }}
          className="online-pulse"
        />
      )}
    </div>
  );
}