import {
  FuelType,
  Transmission,
  VehicleBodyType,
  DriveType,
} from "@prisma/client";

export interface CreateVehicleDto {
  make: string;

  model: string;

  year?: number;

  mileage?: number;

  fuelType?: FuelType;

  transmission?: Transmission;

  bodyType?: VehicleBodyType;

  driveType?: DriveType;

  engineSize?: string;

  color?: string;

  registrationYear?: number;

  registered?: boolean;

  accidentHistory?: boolean;

  owners?: number;

  doors?: number;

  seats?: number;

  vin?: string;

  plateNumber?: string;
}

export interface UpdateVehicleDto
  extends Partial<CreateVehicleDto> {}