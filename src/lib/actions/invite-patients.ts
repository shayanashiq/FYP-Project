// src/api/invitePatients.ts

import axios, { AxiosResponse } from "axios";

const instance = axios.create({
  timeout: 80000,
  headers: {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json; charset=utf-8",
  },
});

interface InvitePatientsResponse {
  successCount: number; 
}

interface InvitePatientsError {
  message: string;
}

export const invitePatientsApi = async (emails: string[], token: string): 
Promise<InvitePatientsResponse> => {
  console.log("TOKEN",token)
  try {
    // Set the Authorization header for this request
    const response: AxiosResponse<InvitePatientsResponse> = await instance.post("/api/doctor/invite", {
      emails,
    }, {
      headers: {     
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    const err = error as { response?: { data: InvitePatientsError } };
    throw err.response?.data || { message: "An error occurred" };
  }
};
