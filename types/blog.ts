export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  imageUrl: string;
  publishedAt: string;
  views: number;
  likes: string[];
  tags: string[];
  status: string;
  archived: boolean;
  author: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface BlogPagination {
  totalPosts: number;
  totalPages: number;
  currentPage: number;
  postsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface BlogResponse {
  posts: BlogPost[];
  pagination: BlogPagination;
}

export interface BlogSearchParams {
  search?: string;
  limit?: number;
  page?: number;
  category?: string;
}
