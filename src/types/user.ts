import { CustomerProfile } from "./customerProfile";

export interface User {
    id?: string;
    name?: string | null;
    email: string;
    image?: string | null;
    password?: string;
    role: string;
    isAdmin?: boolean;
    verified?: boolean;
    isPasswordSet?: boolean;
    isProfileComplete?: boolean;
    customerProfile?: CustomerProfile | null;
    orders?: any[]; 
    cart?: any; 
    wishlist?: any;
    reviews?: any[]; 
    products?: any[]; 
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  