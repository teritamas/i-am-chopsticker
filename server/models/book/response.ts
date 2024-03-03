export interface PostBookResponse {
  list: MannerItem[];
}

export interface MannerItem {
  step: number;
  manner: string;
  imageUrl: string;
}
