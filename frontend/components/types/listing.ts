export interface ListingImage {
  id: string;
  url: string;
}

export interface Seller {
  id: string;
  firstName: string;
  lastName: string;
  profileImage?: string | null;

  phone?: string | null;

  verificationStatus?: string;

  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface VehicleDetail {
  make?: string;
  model?: string;
  year?: number;
  mileage?: number;

  fuelType?: string;
  transmission?: string;
  bodyType?: string;

  engineSize?: string;
  color?: string;

  registrationYear?: number;
  accidentHistory?: boolean;

  vin?: string;
  driveType?: string;
  registered?: boolean;

  owners?: number;
  doors?: number;
  seats?: number;

  plateNumber?: string;
}

export interface ApplianceDetail {
  brand?: string;
  model?: string;

  category?: string;

  condition?: string;

  warranty?: boolean;

  age?: number;

  powerRating?: string;
}

export interface Listing {
  id: string;

  title: string;

  slug: string;

  description?: string;

  price: number;

  currency: string;

  condition: string;

  faultSeverity?: string;

  faultDescription?: string;

  location?: string;

  state?: string;

  city?: string;

  views: number;

  createdAt: string;

  images: ListingImage[];

  seller: Seller;

  category: Category;

  vehicleDetail?: VehicleDetail;

  applianceDetail?: ApplianceDetail;
}