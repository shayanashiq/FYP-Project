export interface CustomerProfile {
  id?: string;
  firstName: string;
  lastName: string;
  phone?: string;
  imageUrl?: string;
  address?: string;
  city?: string;
  country?: string;
  zipCode?: string;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}