export interface CustomerProfile {
  id?: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  zipCode?: string | null;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}