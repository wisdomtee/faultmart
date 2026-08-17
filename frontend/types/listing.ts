export interface ListingImage {
  id: string;
  url: string;
  publicId?: string | null;
  position?: number;
}

export interface Seller {
  id: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  profileImage?: string | null;
  rating?: number | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface VehicleDetail {
  id?: string;
  make?: string | null;
  model?: string | null;
  year?: number | null;
  mileage?: number | null;
  fuelType?: string | null;
  transmission?: string | null;
  bodyType?: string | null;
  engineSize?: string | null;
  color?: string | null;
  registrationYear?: number | null;
  accidentHistory?: boolean;
  doors?: number | null;
  seats?: number | null;
  driveType?: string | null;
  owners?: number | null;
  plateNumber?: string | null;
  registered?: boolean;
  vin?: string | null;
}

export interface ApplianceDetail {
  id?: string;
  brand?: string | null;
  model?: string | null;
  category?: string | null;
  condition?: string | null;
  warranty?: boolean;
  age?: number | null;
  powerRating?: string | null;
}

export interface Listing {
  id: string;
  title: string;
  slug: string;

  description?: string | null;

  price: number;
  currency: string;

  condition?: string | null;
  faultSeverity?: string | null;
  status?: string | null;

  featured?: boolean;
  views?: number;

  state?: string | null;
  city?: string | null;
  location?: string | null;

  createdAt?: string;
  updatedAt?: string;

  category: Category;
  categoryId: string;

  seller: Seller;

  images: ListingImage[];

  vehicleDetail?: VehicleDetail | null;
  applianceDetail?: ApplianceDetail | null;

  _count?: {
    favorites?: number;
    offers?: number;
    views?: number;
  };
}

export interface ListingPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ListingsResponse {
  data: Listing[];
  pagination: ListingPagination;
}
