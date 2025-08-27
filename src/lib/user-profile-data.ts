

export type UserProfile = {
  id: string;
  name: string;
  age: number;
  gender: string;
  username: string;
  location: string;
  bio: string;
  avatar: string;
  banner: string;
  vibes: string[];
  interests: string[];
  gallery: { id: number; src: string; hint: string }[];
};

export const userProfiles: UserProfile[] = [
  {
    id: '1',
    name: 'Sophia',
    age: 24,
    gender: 'female',
    username: '@sophia_art',
    location: 'New York, USA',
    bio: 'Lover of art, long walks on the beach, and deep conversations. Looking for someone to explore new cafes with.',
    avatar: 'https://picsum.photos/seed/sophia/400/400',
    banner: 'https://picsum.photos/seed/sophia-banner/800/600',
    vibes: ['Date', 'Friend'],
    interests: ['Art', 'Coffee', 'Philosophy', 'Travel', 'Museums'],
    gallery: [
        { id: 1, src: 'https://picsum.photos/seed/sophia-gallery1/400/400', hint: 'painting canvas' },
        { id: 2, src: 'https://picsum.photos/seed/sophia-gallery2/400/400', hint: 'beach sunset' },
        { id: 3, src: 'https://picsum.photos/seed/sophia-gallery3/400/400', hint: 'coffee shop' },
        { id: 4, src: 'https://picsum.photos/seed/sophia-gallery4/400/400', hint: 'old books' },
        { id: 5, src: 'https://picsum.photos/seed/sophia-gallery5/400/400', hint: 'city park' },
        { id: 6, src: 'https://picsum.photos/seed/sophia-gallery6/400/400', hint: 'sculpture' },
    ],
  },
  {
    id: '2',
    name: 'Liam',
    age: 27,
    gender: 'male',
    username: '@liam_hikes',
    location: 'London, UK',
    bio: "Tech enthusiast and weekend hiker. My dog is my best friend. Let's talk about the future of AI or the best trails.",
    avatar: 'https://picsum.photos/seed/liam/400/400',
    banner: 'https://picsum.photos/seed/liam-banner/800/600',
    vibes: ['Friend'],
    interests: ['Tech', 'Hiking', 'Dogs', 'Sci-Fi', 'Podcasts'],
     gallery: [
        { id: 1, src: 'https://picsum.photos/seed/liam-gallery1/400/400', hint: 'mountain trail' },
        { id: 2, src: 'https://picsum.photos/seed/liam-gallery2/400/400', hint: 'golden retriever' },
        { id: 3, src: 'https://picsum.photos/seed/liam-gallery3/400/400', hint: 'laptop code' },
        { id: 4, src: 'https://picsum.photos/seed/liam-gallery4/400/400', hint: 'forest trees' },
        { id: 5, src: 'https://picsum.photos/seed/liam-gallery5/400/400', hint: 'headphones' },
        { id: 6, src: 'https://picsum.photos/seed/liam-gallery6/400/400', hint: 'drone' },
    ],
  },
  {
    id: '3',
    name: 'Chloe',
    age: 22,
    gender: 'female',
    username: '@chloe_sings',
    location: 'Paris, France',
    bio: "Musician and dreamer. I find beauty in small things. Let's create a playlist for our first date.",
    avatar: 'https://picsum.photos/seed/chloe/400/400',
    banner: 'https://picsum.photos/seed/chloe-banner/800/600',
    vibes: ['Spicy', 'Date'],
    interests: ['Music', 'Concerts', 'Creative', 'Vegan', 'Poetry'],
     gallery: [
        { id: 1, src: 'https://picsum.photos/seed/chloe-gallery1/400/400', hint: 'guitar player' },
        { id: 2, src: 'https://picsum.photos/seed/chloe-gallery2/400/400', hint: 'concert crowd' },
        { id: 3, src: 'https://picsum.photos/seed/chloe-gallery3/400/400_400', hint: 'vinyl records' },
        { id: 4, src: 'https://picsum.photos/seed/chloe-gallery4/400/400', hint: 'eiffel tower' },
        { id: 5, src: 'https://picsum.photos/seed/chloe-gallery5/400/400', hint: 'notebook lyrics' },
        { id: 6, src: 'https://picsum.photos/seed/chloe-gallery6/400/400', hint: 'microphone' },
    ],
  },
   {
    id: '4',
    name: 'Mason',
    age: 29,
    gender: 'male',
    username: '@mason_lifts',
    location: 'New York, USA',
    bio: "Fitness junkie with a love for cooking. I can make you a great protein shake and an even better lasagna.",
    avatar: 'https://picsum.photos/seed/mason/400/400',
    banner: 'https://picsum.photos/seed/mason-banner/800/600',
    vibes: ['Date', 'Friend'],
    interests: ['Fitness', 'Cooking', 'Health', 'Movies', 'Gym'],
     gallery: [
        { id: 1, src: 'https://picsum.photos/seed/mason-gallery1/400/400', hint: 'barbell weights' },
        { id: 2, src: 'https://picsum.photos/seed/mason-gallery2/400/400', hint: 'healthy meal' },
        { id: 3, src: 'https://picsum.photos/seed/mason-gallery3/400/400', hint: 'smoothie' },
        { id: 4, src: 'https://picsum.photos/seed/mason-gallery4/400/400', hint: 'running track' },
        { id: 5, src: 'https://picsum.photos/seed/mason-gallery5/400/400', hint: 'movie tickets' },
        { id: 6, src: 'https://picsum.photos/seed/mason-gallery6/400/400', hint: 'chef kitchen' },
    ],
  },
  {
    id: '5',
    name: 'Olivia',
    age: 31,
    gender: 'female',
    location: 'New York, USA',
    username: '@olivia_reads',
    bio: 'Bookworm and aspiring novelist. Let\'s get lost in a story.',
    avatar: 'https://picsum.photos/seed/olivia/400/400',
    banner: 'https://picsum.photos/seed/olivia-banner/800/600',
    vibes: ['Friend'],
    interests: ['Books', 'Writing', 'Tea'],
    gallery: [
      { id: 1, src: 'https://picsum.photos/seed/olivia-gallery1/400/400', hint: 'bookshelf' },
      { id: 2, src: 'https://picsum.photos/seed/olivia-gallery2/400/400', hint: 'fountain pen' },
      { id: 3, src: 'https://picsum.photos/seed/olivia-gallery3/400/400', hint: 'tea cup' },
      { id: 4, src: 'https://picsum.photos/seed/olivia-gallery4/400/400', hint: 'library' },
      { id: 5, src: 'https://picsum.photos/seed/olivia-gallery5/400/400', hint: 'cat sleeping' },
      { id: 6, src: 'https://picsum.photos/seed/olivia-gallery6/400/400', hint: 'reading glasses' },
    ],
  },
];
