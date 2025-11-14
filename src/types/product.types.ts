export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  images: string[];
  category: {
    id: number;
    name: string;
    image: string;
    slug?: string;
  };
  creationAt?: string;
  updatedAt?: string;
}

export interface ProductCreateRequest {
  title: string;
  price: number;
  description: string;
  images: string[];
  categoryId: number;
}

export interface ProductUpdateRequest {
  title?: string;
  price?: number;
  description?: string;
  images?: string[];
  categoryId?: number;
}

export interface ProductFormData {
  title: string;
  price: number;
  description: string;
  images: string[];
  categoryId: number;
}

