export enum Category {
  World = "World",
  Politics = "Politics",
  Technology = "Technology",
  Lifestyle = "Lifestyle",
  Business = "Business",
  Science = "Science",
  Economy = "Economy",
  Cybersecurity = "Cybersecurity",
  Markets = "Markets"
}

export interface Author {
  name: string;
  role: string;
  avatar: string;
  bio?: string;
  twitter?: string;
}

export interface Article {
  id: string;
  databaseId?: string;
  title: string;
  category: Category;
  author: Author;
  date: string;
  image: string;
  snippet: string;
  readTime?: string;
  views?: string;
  content?: string[];
  isBreaking?: boolean;
  saved?: boolean;
}
