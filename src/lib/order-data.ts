
export type Order = {
    id: string;
    date: string;
    status: 'Processing' | 'Shipped' | 'Delivered';
    amount: string;
    items: {
        id: string;
        name: string;
        image: string;
        quantity: number;
        price: string;
    }[];
};

export const orders: Order[] = [
  {
    id: '#BONDLY-12345',
    date: '2023-10-26',
    status: 'Delivered',
    amount: '$55.00',
    items: [
        { id: '1', name: 'Bondly: The Original Deck', image: 'https://picsum.photos/seed/deck1/100/100', quantity: 1, price: '$25.00' },
        { id: '4', name: '"Vulnerability" Hoodie', image: 'https://picsum.photos/seed/merch1/100/100', quantity: 1, price: '$30.00' },
    ]
  },
  {
    id: '#BONDLY-12344',
    date: '2023-09-15',
    status: 'Delivered',
    amount: '$40.00',
    items: [
        { id: '2', name: 'Bondly: Relationship Expansion', image: 'https://picsum.photos/seed/deck2/100/100', quantity: 1, price: '$15.00' },
        { id: '3', name: 'Bondly: Self-Love Edition', image: 'https://picsum.photos/seed/deck3/100/100', quantity: 1, price: '$25.00' },
    ]
  },
   {
    id: '#BONDLY-12343',
    date: '2023-08-01',
    status: 'Shipped',
    amount: '$20.00',
     items: [
        { id: '6', name: '"What are you feeling?" Tote', image: 'https://picsum.photos/seed/merch2/100/100', quantity: 1, price: '$20.00' },
    ]
  },
];
