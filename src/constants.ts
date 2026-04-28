import { Category, type Article } from "./types";

export const AUTHORS = {
  HELENA: {
    name: "Helena Vance",
    role: "Senior Correspondent",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    bio: "Helena has been covering technical regulation and policy for over 15 years.",
    twitter: "@helenavance"
  },
  MARCUS: {
    name: "Marcus Thorne",
    role: "Senior Technology Editor",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    bio: "Marcus has been covering the intersection of technology and geopolitical strategy for Chronicle for over a decade.",
    twitter: "@marcusthorne"
  },
  ELENA: {
    name: "Elena Vance",
    role: "Research Director",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop"
  },
  SARAH: {
    name: "Sarah Jenkins",
    role: "Politics Analyst",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop"
  }
};

export const FEATURED_ARTICLE: Article = {
  id: "featured-1",
  title: "The Quantum Leap: Silicon Valley's Next Decade of Computing Defined",
  category: Category.Technology,
  author: AUTHORS.HELENA,
  date: "12 mins ago",
  image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?w=1200&h=800&fit=crop",
  snippet: "The race for quantum supremacy has moved from the laboratory to the boardroom. As major tech conglomerates announce successful error-correction milestones...",
  isBreaking: true,
  readTime: "12 min read"
};

export const TRENDING_ARTICLES: Article[] = [
  {
    id: "trending-1",
    title: "Remote Work: The Hybrid Revolution Two Years On",
    category: Category.Business,
    author: AUTHORS.SARAH,
    date: "1h ago",
    image: "",
    snippet: "",
    views: "45k"
  },
  {
    id: "trending-2",
    title: "Mars Colony: SpaceX Unveils New Habitation Modules",
    category: Category.Science,
    author: AUTHORS.MARCUS,
    date: "3h ago",
    image: "",
    snippet: "",
    views: "38k"
  },
  {
    id: "trending-3",
    title: "NFTs Rebirth? How Digital Assets are Finding Utility",
    category: Category.Technology,
    author: AUTHORS.ELENA,
    date: "5h ago",
    image: "",
    snippet: "",
    views: "32k"
  }
];

export const TECH_ARTICLES: Article[] = [
  {
    id: "tech-1",
    title: "Robotics in 2024: From Lab to Living Room",
    category: Category.Technology,
    author: AUTHORS.MARCUS,
    date: "5 hours ago",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=500&fit=crop",
    snippet: "The latest breakthroughs in consumer robotics are bringing sophisticated automation to everyday households."
  },
  {
    id: "tech-2",
    title: "The Microchip War: Geopolitics of Innovation",
    category: Category.Technology,
    author: AUTHORS.HELENA,
    date: "8 hours ago",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=500&fit=crop",
    snippet: "Supply chain shifts are forcing a radical rethink of where and how we produce essential hardware components."
  }
];

export const SAVED_ARTICLES: Article[] = [
  {
    id: "saved-1",
    title: "Quantum Computing: The Next Frontier in Security",
    category: Category.Technology,
    author: AUTHORS.ELENA,
    date: "Oct 12",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=300&fit=crop",
    snippet: "",
    readTime: "6 min read"
  },
  {
    id: "saved-2",
    title: "Global Markets React to Shifting Central Bank Policies",
    category: Category.Business,
    author: AUTHORS.SARAH,
    date: "Oct 11",
    image: "https://images.unsplash.com/photo-1611974717482-9da3df420042?w=400&h=300&fit=crop",
    snippet: "",
    readTime: "4 min read"
  },
  {
    id: "saved-3",
    title: "James Webb Telescope Discovers Atmospheric Water",
    category: Category.Science,
    author: AUTHORS.MARCUS,
    date: "Oct 10",
    image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=300&fit=crop",
    snippet: "",
    readTime: "8 min read"
  },
  {
    id: "saved-4",
    title: "The Rise of Minimalist Architecture in Urban Spaces",
    category: Category.Lifestyle,
    author: AUTHORS.HELENA,
    date: "Oct 09",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop",
    snippet: "",
    readTime: "5 min read"
  }
];
