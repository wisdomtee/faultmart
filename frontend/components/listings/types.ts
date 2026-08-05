export interface ListingImage {
  id?: string;
  url: string;
  publicId?: string;
}

export interface Seller {
  id: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  profileImage?: string | null;
  rating?: number | null;
}

export interface Listing {
  id: string;
  title: string;
  slug: string;
  price: number | string;
  location?: string | null;
  state?: string | null;
  city?: string | null;
  condition: string;
  faultSeverity?: string | null;
  views?: number;

  images: ListingImage[];

  seller?: Seller;
}