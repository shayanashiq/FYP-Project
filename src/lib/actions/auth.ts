import axios, { AxiosError } from "axios";
import instance from "../api-instances";

export const patchExample = async (payload: any, token: string) => {
  return await instance.patch(`/example`, payload, {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const sendOtp = async (payload: any) => {
  return await instance.post(`/api/send-otp-register`, payload, {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
};
export const otpVerification = async (payload: any) => {
  return await instance.post(`/api/verify-otp`, payload, {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
};

export const saveDoctorProfile = async (payload: any, token: string) => {
  return await instance.post(`/api/doctor-profile`, payload, {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createTask = async (payload: any, token: string) => {
  return await instance.post(`/api/task`, payload, {
    headers: {
      "Content-Type": "application/json",
      // "Access-Control-Allow-Origin": "*",
      Authorization: `Bearer ${token}`,

    },
  });
};

export const fileUpload = async (payload: any) => {
  return await instance.post(`/api/file`, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
      "Access-Control-Allow-Origin": "*",
    },
  });
};

export const getExample = async (
  latitude: string,
  longitude: string,
  token: string | undefined
) => {
  return await instance.get(`example`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteExample = async (token: string) => {
  return await instance.delete(`/example`, {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      Authorization: `Bearer ${token}`,
    },
  });
};
export const deleteTask = async (token: string, taskId: number) => {
  return await instance.delete(`/api/task/delete?taskId=${taskId}`, {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getDoctorPatients = async (
  page: number,
  pageSize: number,
  token: string,
  search?: string,
  sortBy?: "name" | "dob",
  order?: "asc" | "desc"
) => {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });

  if (search) params.append("search", search);
  if (sortBy) params.append("sortBy", sortBy);
  if (order) params.append("order", order);

  return await instance.get(`/api/doctor/patients?${params.toString()}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};



export const getHealthLogs = async (
  token: string,
  id: number
) => {
  {
    return await instance.get(
      `/api/patient/health-log/list?patientId=${id}`,

      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
};



export const getHealthLogsList = async (
  token: string,
  id: number
) => {
  {
    return await instance.get(
      `/api/patient/health-log/list?patientId=${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
};
export const getHealthLogsCount = async (
  token: string,
) => {
  {
    return await instance.get(
      `/api/patient/health-log/health-log-count`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
};
export const getAssignedTasksCount = async (
  token: string,
) => {
  {
    return await instance.get(
      `/api/doctor/no-of-tasks`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
};

export const getTotalPatientsCount = async (token: string) => {
  try {
    const response = await instance.get(
      `/api/doctor/no-of-patients`, // The API endpoint to fetch the total number of patients
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getHealthLogDetail = async (
  token: string,
  id: number
) => {
  {
    return await instance.get(
      `/api/patient/health-log/view?logId=${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
};




export const getPatientProfile = async (
  token: string,
  id: number
) => {
  {
    return await instance.get(
      `/api/patient/getById?patientId=${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
};

export const getPatientImage = async (
  token: string,
  fileName: string
) => {
  {
    return await instance.get(
      `/api/upload-url?fileName=${fileName}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

};


export const getTasks = async (token: string, doctorId: number, patientId: number) => {
  return await instance.get(
    `/api/task/getList?patientId=${patientId}&doctorId=${doctorId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
};




export const EditDocProfile = async (token: string, payload: any) => {
  try {
    const response = await instance.post(
      `/api/doctor-profile`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Error updating profile");
  }
};
export const ReqResetPassword = async (payload: any) => {
  try {
    const response = await instance.post(
      `/api/request-reset-password-otp`,
      payload,

      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Error updating profile");
  }
};
export const ResetPass = async (payload: any) => {
  try {
    const response = await instance.post(
      `/api/reset-password-otp`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Error updating profile");
  }
};
export const ChangePass = async (payload: any) => {
  try {
    const response = await instance.post(
      `/api/change-password`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Error updating profile");
  }
};

// lib/actions/auth.ts
export async function getTourData(email: string) {
  try {
    const response = await fetch(`/api/welcome/tour?email=${encodeURIComponent(email)}`, {
      method: 'GET',
    });
    return response.json();
  } catch (error) {
    return null;
  }
}

export async function setTour({ email, hasCompTour }: { email: string, hasCompTour: string }) {
  try {
    const response = await fetch('/api/welcome/tour', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, hasCompTour }),
    });
    return response.json();
  } catch (error) {
    return null;
  }
}

export const setCompTour = async (payload: any) => {
  try {
    const response = await instance.post(
      `/api/welcome/hasSeenTour`, // Make sure this endpoint is implemented on the backend
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Error setting tour complete.");
  }
};
export const getCompTour = async (email: string) => {
  try {
    // Send email as query parameter
    const response = await instance.get(`/api/welcome/getData`, {
      params: { email }, // Send email as query parameter
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;  // Return the data from the response
  } catch (error) {
    throw new Error("Error fetching tour data.");
  }
};



export const acceptAppointment = async (appointmentId: number, token: string) => {
  try {
    const response = await instance.post(
      `/api/virtual-visits/appointments/accept/${appointmentId}`,
      {},  // Empty body since you're not sending payload data
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to accept appointment");
  }
};

export const rejectAppointment = async (appointmentId: number, token: string) => {
  try {
    const response = await instance.post(
      `/api/virtual-visits/appointments/reject/${appointmentId}`,
      {},  // Empty body since you're not sending payload data
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to reject appointment");
  }
};
export const cancelAppointment = async (appointmentId: number, token: string, userRole: string) => {
  try {
    const response = await instance.post(
      `/api/virtual-visits/appointments/cancel/${appointmentId}`,
      { userRole },  
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to reject appointment");
  }
};

export const requestAVisit = async (payload: { patientId: number }) => {
  try {
    const response = await instance.post(
      `/api/patient/request-a-visit`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message);
    }
    throw new Error('Error Requesting a visit');
  }
};


export const sendAMessageToPatient = async (data: { patientId: number, message: string }) => {
  try {
    const response = await instance.post(
      `/api/patient/send-message`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message);
    }
    throw new Error('Error Requesting a visit');
  }
}