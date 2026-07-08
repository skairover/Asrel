 import {  ArrowLeft, Phone, Video, MoreVertical} from "lucide-react"
 import Avatar from "./Avatar"
 
 
 export default function ChatHeader({theme,
  selectedConv,
  typing,
  setMobileView,}){
 
 return(
  
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 20px",
                borderBottom: `1px solid ${theme.border}`,
                background: theme.surface,
                flexShrink: 0,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button
                  className="header-icon-btn md-hide"
                  aria-label="Back to conversations"
                  onClick={() => setMobileView("list")}
                  style={{ display: "none" }}
                  data-mobile-back
                >
                  <ArrowLeft size={16} />
                </button>
                <Avatar
                  name={selectedConv.name}
                  color={selectedConv.color}
                  online={selectedConv.online}
                  theme={theme}
                  size={40}
                />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>
                    {selectedConv.name}
                  </div>
                  <div style={{ fontSize: 12.5, color: theme.textSecondary }}>
                    {typing
                      ? "typing…"
                      : selectedConv.online
                        ? "Online"
                        : "Offline"}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="header-icon-btn" aria-label="Voice call">
                  <Phone size={16} />
                </button>
                <button className="header-icon-btn" aria-label="Video call">
                  <Video size={16} />
                </button>
                <button className="header-icon-btn" aria-label="More options">
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>
          
)}