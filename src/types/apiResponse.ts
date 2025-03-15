// src/types/apiResponse.ts

export interface ApiResponse<T = any, E = string> {
  success: boolean;
  data?: T;
  error?: E;
}

export interface User {
  id: number;
  username: string;
  email: string;
}
