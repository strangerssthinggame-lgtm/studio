

export type GalleryImage = { 
  id: number; 
  src: string; 
  hint: string; 
  path: string; 
};

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
  gallery: GalleryImage[];
  availability: string;
  profileComplete?: boolean;
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
        { id: 1, src: 'https://picsum.photos/seed/sophia-gallery1/400/400', hint: 'painting canvas', path: '' },
        { id: 2, src: 'https://picsum.photos/seed/sophia-gallery2/400/400', hint: 'beach sunset', path: '' },
        { id: 3, src: 'https://picsum.photos/seed/sophia-gallery3/400/400', hint: 'coffee shop', path: '' },
        { id: 4, src: 'https://picsum.photos/seed/sophia-gallery4/400/400', hint: 'old books', path: '' },
        { id: 5, src: 'https://picsum.photos/seed/sophia-gallery5/400/400', hint: 'city park', path: '' },
        { id: 6, src: 'https://picsum.photos/seed/sophia-gallery6/400/400', hint: 'sculpture', path: '' },
    ],
    availability: 'Evenings & Weekends',
    profileComplete: true,
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
        { id: 1, src: 'https://picsum.photos/seed/liam-gallery1/400/400', hint: 'mountain trail', path: '' },
        { id: 2, src: 'https://picsum.photos/seed/liam-gallery2/400/400', hint: 'golden retriever', path: '' },
        { id: 3, src: 'https://picsum.photos/seed/liam-gallery3/400/400', hint: 'laptop code', path: '' },
        { id: 4, src: 'https://picsum.photos/seed/liam-gallery4/400/400', hint: 'forest trees', path: '' },
        { id: 5, src: 'https://picsum.photos/seed/liam-gallery5/400/400', hint: 'headphones', path: '' },
        { id: 6, src: 'https://picsum.photos/seed/liam-gallery6/400/400', hint: 'drone', path: '' },
    ],
    availability: 'Weekends',
    profileComplete: true,
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
        { id: 1, src: 'https://picsum.photos/seed/chloe-gallery1/400/400', hint: 'guitar player', path: '' },
        { id: 2, src: 'https://picsum.photos/seed/chloe-gallery2/400/400', hint: 'concert crowd', path: '' },
        { id: 3, src: 'https://picsum.photos/seed/chloe-gallery3/400/400', hint: 'vinyl records', path: '' },
        { id: 4, src: 'https://picsum.photos/seed/chloe-gallery4/400/400', hint: 'eiffel tower', path: '' },
        { id: 5, src: 'https://picsum.photos/seed/chloe-gallery5/400/400', hint: 'notebook lyrics', path: '' },
        { id: 6, src: 'https://picsum.photos/seed/chloe-gallery6/400/400', hint: 'microphone', path: '' },
    ],
    availability: 'Afternoons',
    profileComplete: true,
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
        { id: 1, src: 'https://picsum.photos/seed/mason-gallery1/400/400', hint: 'barbell weights', path: '' },
        { id: 2, src: 'https://picsum.photos/seed/mason-gallery2/400/400', hint: 'healthy meal', path: '' },
        { id: 3, src: 'https://picsum.photos/seed/mason-gallery3/400/400', hint: 'smoothie', path: '' },
        { id: 4, src: 'https://picsum.photos/seed/mason-gallery4/400/400', hint: 'running track', path: '' },
        { id: 5, src: 'https://picsum.photos/seed/mason-gallery5/400/400', hint: 'movie tickets', path: '' },
        { id: 6, src: 'https://picsum.photos/seed/mason-gallery6/400/400', hint: 'chef kitchen', path: '' },
    ],
    availability: 'Mornings',
    profileComplete: true,
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
      { id: 1, src: 'https://picsum.photos/seed/olivia-gallery1/400/400', hint: 'bookshelf', path: '' },
      { id: 2, src: 'https://picsum.photos/seed/olivia-gallery2/400/400', hint: 'fountain pen', path: '' },
      { id: 3, src: 'https://picsum.photos/seed/olivia-gallery3/400/400', hint: 'tea cup', path: '' },
      { id: 4, src: 'https://picsum.photos/seed/olivia-gallery4/400/400', hint: 'library', path: '' },
      { id: 5, src: 'https://picsum.photos/seed/olivia-gallery5/400/400', hint: 'cat sleeping', path: '' },
      { id: 6, src: 'https://picsum.photos/seed/olivia-gallery6/400/400', hint: 'reading glasses', path: '' },
    ],
    availability: 'Anytime',
    profileComplete: true,
  },
  {
    id: '6',
    name: 'Ethan',
    age: 26,
    gender: 'male',
    username: '@ethan_codes',
    location: 'San Francisco, USA',
    bio: 'Software engineer by day, musician by night. Fuelled by coffee and code. Let\'s build something cool together.',
    avatar: 'https://picsum.photos/seed/ethan/400/400',
    banner: 'https://picsum.photos/seed/ethan-banner/800/600',
    vibes: ['Friend', 'Date'],
    interests: ['Coding', 'Guitar', 'Coffee', 'Startups', 'Rock Music'],
    gallery: [
      { id: 1, src: 'https://picsum.photos/seed/ethan-gallery1/400/400', hint: 'laptop screen', path: '' },
      { id: 2, src: 'https://picsum.photos/seed/ethan-gallery2/400/400', hint: 'electric guitar', path: '' },
      { id: 3, src: 'https://picsum.photos/seed/ethan-gallery3/400/400', hint: 'latte art', path: '' },
      { id: 4, src: 'https://picsum.photos/seed/ethan-gallery4/400/400', hint: 'whiteboard', path: '' },
      { id: 5, src: 'https://picsum.photos/seed/ethan-gallery5/400/400', hint: 'cityscape', path: '' },
      { id: 6, src: 'https://picsum.photos/seed/ethan-gallery6/400/400', hint: 'sound board', path: '' },
    ],
    availability: 'Weeknights',
    profileComplete: true,
  },
  {
    id: '7',
    name: 'Ava',
    age: 23,
    gender: 'female',
    username: '@ava_travels',
    location: 'Sydney, Australia',
    bio: 'Globetrotter with a passion for photography and adventure. I have more passport stamps than shoes. Where to next?',
    avatar: 'https://picsum.photos/seed/ava/400/400',
    banner: 'https://picsum.photos/seed/ava-banner/800/600',
    vibes: ['Friend', 'Spicy'],
    interests: ['Travel', 'Photography', 'Adventure', 'Culture', 'Foodie'],
    gallery: [
      { id: 1, src: 'https://picsum.photos/seed/ava-gallery1/400/400', hint: 'passport stamps', path: '' },
      { id: 2, src: 'https://picsum.photos/seed/ava-gallery2/400/400', hint: 'camera lens', path: '' },
      { id: 3, src: 'https://picsum.photos/seed/ava-gallery3/400/400', hint: 'world map', path: '' },
      { id: 4, src: 'https://picsum.photos/seed/ava-gallery4/400/400', hint: 'sydney opera house', path: '' },
      { id: 5, src: 'https://picsum.photos/seed/ava-gallery5/400/400', hint: 'street food', path: '' },
      { id: 6, src: 'https://picsum.photos/seed/ava-gallery6/400/400', hint: 'kayaking', path: '' },
    ],
    availability: 'Varies',
    profileComplete: true,
  },
  {
    id: '8',
    name: 'Noah',
    age: 30,
    gender: 'male',
    username: '@noah_bakes',
    location: 'Toronto, Canada',
    bio: 'Pastry chef who believes the secret ingredient is always love. I can probably be bribed with a good croissant.',
    avatar: 'https://picsum.photos/seed/noah/400/400',
    banner: 'https://picsum.photos/seed/noah-banner/800/600',
    vibes: ['Date'],
    interests: ['Baking', 'Food', 'Dogs', 'Comedy', 'Reading'],
    gallery: [
      { id: 1, src: 'https://picsum.photos/seed/noah-gallery1/400/400', hint: 'croissants', path: '' },
      { id: 2, src: 'https://picsum.photos/seed/noah-gallery2/400/400', hint: 'flour mess', path: '' },
      { id: 3, src: 'https://picsum.photos/seed/noah-gallery3/400/400', hint: 'corgi dog', path: '' },
      { id: 4, src: 'https://picsum.photos/seed/noah-gallery4/400/400', hint: 'cake decorating', path: '' },
      { id: 5, src: 'https://picsum.photos/seed/noah-gallery5/400/400', hint: 'comedy club', path: '' },
      { id: 6, src: 'https://picsum.photos/seed/noah-gallery6/400/400', hint: 'open book', path: '' },
    ],
    availability: 'Weekends',
    profileComplete: true,
  },
];
