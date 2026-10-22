export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewInput {
  productId: string;
  rating: number;
  title: string;
  comment: string;
}

export interface UpdateReviewInput {
  id: string;
  rating?: number;
  title?: string;
  comment?: string;
}
