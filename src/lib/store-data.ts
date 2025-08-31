
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
    description: 'The classic 150-card deck that started it all. Perfect for breaking the ice with friends or new dates.',
    price: '$24.99',
    image: 'https://picsum.photos/seed/deck1/600/400',
    aiHint: 'card deck',
    category: 'Decks',
  },
  {
    id: '2',
    name: 'Bondly: Spicy Edition',
    description: 'Turn up the heat with 100 daring and flirty cards. Recommended for ages 18+.',
    price: '$19.99',
    image: 'https://picsum.photos/seed/deck2/600/400',
    aiHint: 'card game box',
    category: 'Decks',
  },
  {
    id: '3',
    name: 'Bondly: Friends Edition',
    description: 'Strengthen bonds and create hilarious memories with 120 questions designed for your squad.',
    price: '$22.99',
    image: 'https://picsum.photos/seed/deck3/600/400',
    aiHint: 'playing cards',
    category: 'Decks',
  },
  {
    id: '4',
    name: 'Bondly T-Shirt',
    description: 'A comfortable and stylish tee to show your love for connecting. Made from 100% organic cotton.',
    price: '$29.99',
    image: 'https://picsum.photos/seed/merch1/600/400',
    aiHint: 't-shirt apparel',
    category: 'Merch',
  },
];
