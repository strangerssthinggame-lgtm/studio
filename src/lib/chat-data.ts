
export type Chat = {
  id: string;
  name: string;
  message: string;
  time: string;
  unread: number;
  avatar: string;
  vibe: 'date' | 'friends' | 'spicy';
};

export const chats: Chat[] = [
  { id: '1', name: 'Sophia', message: "Hey! Loved your profile. Up for a game?", time: "5m ago", unread: 2, avatar: "https://picsum.photos/seed/sophia/100", vibe: 'date' },
  { id: '2', name: 'Liam', message: "That was a fun game! Rematch soon?", time: "1h ago", unread: 0, avatar: "https://picsum.photos/seed/liam/100", vibe: 'friends' },
  { id: '3', name: 'Chloe', message: "You have a great taste in music!", time: "3h ago", unread: 0, avatar: "https://picsum.photos/seed/chloe/100", vibe: 'spicy' },
  { id: '4', name: 'Mason', message: "Let's do this! Vibe Check, Date mode?", time: "1d ago", unread: 1, avatar: "https://picsum.photos/seed/mason/100", vibe: 'date' },
];
