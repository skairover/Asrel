
import  NAMES from "../constants/names";
import AVATAR_COLORS from "../constants/avatarColors";



  export function seedConversations() {
    return NAMES.map((name, i) => ({
      id: i + 1,
      name,
      color: AVATAR_COLORS[i % AVATAR_COLORS.length],
      online: i % 3 !== 1,
      unread: i === 0 ? 2 : i === 2 ? 1 : 0,
      lastMessage: [
        "Sounds good, see you then!",
        "Can you send the file?",
        "Haha that's amazing",
        "Sure, no problem.",
        "Where did you park?",
        "Let's finish this tomorrow",
        "Thank you so much 🙏",
        "Call me when you're free",
      ][i],
      timestamp: [
        "2m",
        "14m",
        "1h",
        "3h",
        "Yesterday",
        "Yesterday",
        "Mon",
        "Sun",
      ][i],
    }));
  }

  export function seedMessages(convId) {
    const base = Date.now() - 1000 * 60 * 60 * 5;
    const mk = (id, sender, text, offsetMin, extra = {}) => ({
      id: `${convId}-${id}`,
      sender,
      text,
      time: new Date(base + offsetMin * 60000),
      status: "seen",
      reactions: [],
      replyTo: null,
      edited: false,
      ...extra,
    });
    return [
      mk(1, "them", "Hey! How's the project coming along?", 0),
      mk(2, "them", "Did you get a chance to look at the wireframes?", 1),
      mk(3, "me", "Yes! They look really clean, love the layout", 5),
      mk(4, "me", "Just a few tweaks on the spacing and we're good", 5.5),
      mk(5, "them", "Perfect, no rush at all", 8),
      mk(6, "them", "Sounds good, see you then!", 9, { status: "delivered" }),
    ];
  }

