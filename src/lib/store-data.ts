
export type Product = {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  aiHint: string;
  category: string;
};

export const products: Product[] = [
  {
    id: '1',
    name: 'Bondly: The Original Deck',
    description: 'The classic 150-card deck that started it all. Perfect for breaking the ice and fostering deeper connections.',
    price: '$25.00',
    image: 'https://picsum.photos/seed/deck1/600/400',
    aiHint: 'card deck red',
    category: 'Decks',
  },
  {
    id: '3',
    name: 'Bondly: Self-Love Edition',
    description: '100 prompts and reminders to help you become your own best friend. The most important relationship is with yourself.',
    price: '$25.00',
    image: 'https://picsum.photos/seed/deck3/600/400',
    aiHint: 'playing cards pink',
    category: 'Decks',
  },
   {
    id: '9',
    name: 'Bondly: Date Edition',
    description: 'Turn up the romance. These cards are perfect for date nights, whether it\'s your first or your hundredth.',
    price: '$20.00',
    image: 'https://picsum.photos/seed/deck6/600/400',
    aiHint: 'playing cards romance',
    category: 'Decks',
  },
   {
    id: '5',
    name: 'Bondly: Friends Edition',
    description: '50 new cards to celebrate your ride-or-dies. Perfect for game nights with your closest friends.',
    price: '$15.00',
    image: 'https://picsum.photos/seed/deck4/600/400',
    aiHint: 'card pack green',
    category: 'Decks',
  },
  {
    id: '2',
    name: 'Bondly: Couple Edition',
    description: 'For established couples. 50 new cards to explore your relationship\'s strengths and growth areas.',
    price: '$15.00',
    image: 'https://picsum.photos/seed/deck2/600/400',
    aiHint: 'card game box',
    category: 'Decks',
  },
   {
    id: '10',
    name: 'Bondly: Motivation Edition',
    description: 'Kickstart your day or your next big project with these 100 empowering and motivational prompts.',
    price: '$20.00',
    image: 'https://picsum.photos/seed/deck7/600/400',
    aiHint: 'inspirational cards sunrise',
    category: 'Decks',
  },
   {
    id: '11',
    name: 'Bondly: Recollection Edition',
    description: 'Take a trip down memory lane. Perfect for sharing stories and reminiscing with loved ones.',
    price: '$20.00',
    image: 'https://picsum.photos/seed/deck8/600/400',
    aiHint: 'vintage photo cards',
    category: 'Decks',
  },
  {
    id: '12',
    name: 'Bondly: Corporate Edition',
    description: 'Break the ice and build stronger teams in the workplace with these professional but engaging prompts.',
    price: '$25.00',
    image: 'https://picsum.photos/seed/deck9/600/400',
    aiHint: 'office team building',
    category: 'Decks',
  },
  {
    id: '4',
    name: '"Vulnerability" Hoodie',
    description: 'A cozy, oversized hoodie with a subtle reminder. Made from 100% organic cotton.',
    price: '$65.00',
    image: 'https://picsum.photos/seed/merch1/600/400',
    aiHint: 'black hoodie',
    category: 'Merch',
  },
  {
    id: '6',
    name: '"What are you feeling?" Tote',
    description: 'A durable canvas tote bag to carry your thoughts, feelings, and groceries. A conversation starter.',
    price: '$20.00',
    image: 'https://picsum.photos/seed/merch2/600/400',
    aiHint: 'canvas tote bag',
    category: 'Merch',
  },
   {
    id: '7',
    name: 'Bondly: Breakup Edition',
    description: 'Navigate the complexities of heartbreak with 100 gentle prompts for reflection and healing.',
    price: '$25.00',
    image: 'https://picsum.photos/seed/deck5/600/400',
    aiHint: 'playing cards black',
    category: 'Decks',
  },
   {
    id: '8',
    name: 'Bondly: The Complete Bundle',
    description: 'Get The Original Deck plus the Relationship and Friendship expansion packs at a discounted price.',
    price: '$50.00',
    image: 'https://picsum.photos/seed/bundle1/600/400',
    aiHint: 'multiple card games',
    category: 'Bundles',
  },
];
