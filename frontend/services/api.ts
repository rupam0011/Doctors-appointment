import axios from "axios";
import {
  AuthResponse,
  RegisterResponse,
  DoctorsResponse,
  AppointmentsResponse,
  BookingPayload,
  RegisterPayload,
  LoginPayload,
  IDoctor,
} from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    return Promise.reject(error);
  }
);

// ==================== Auth API ====================

export const registerUser = async (data: RegisterPayload): Promise<RegisterResponse> => {
  const response = await api.post<RegisterResponse>("/register", data);
  return response.data;
};

export const loginUser = async (data: LoginPayload): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/login", data);
  return response.data;
};

export const verifyEmail = async (token: string): Promise<{ message: string }> => {
  const response = await api.get<{ message: string }>(`/verify-email/${token}`);
  return response.data;
};

// ==================== Doctors API ====================

export const getDoctors = async (specialization?: string): Promise<DoctorsResponse> => {
  const params = specialization ? { specialization } : {};
  const response = await api.get<DoctorsResponse>("/doctors", { params });
  return response.data;
};

export const getDoctorById = async (id: string): Promise<{ doctor: IDoctor }> => {
  const response = await api.get<{ doctor: IDoctor }>(`/doctors/${id}`);
  return response.data;
};

export const seedDoctors = async (): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>("/doctors/seed");
  return response.data;
};

export const createDoctor = async (data: { name: string; specialization: string; fees: number }): Promise<{ message: string; doctor: IDoctor }> => {
  const response = await api.post<{ message: string; doctor: IDoctor }>("/doctors", data);
  return response.data;
};

// ==================== Appointments API ====================

export const createAppointment = async (data: BookingPayload): Promise<{ message: string; appointment: unknown }> => {
  const response = await api.post("/appointments", data);
  return response.data;
};

export const getMyAppointments = async (): Promise<AppointmentsResponse> => {
  const response = await api.get<AppointmentsResponse>("/my-appointments");
  return response.data;
};

export const cancelAppointment = async (id: string): Promise<{ message: string }> => {
  const response = await api.put<{ message: string }>(`/appointments/${id}/cancel`);
  return response.data;
};

export const getAllAppointments = async (): Promise<AppointmentsResponse> => {
  const response = await api.get<AppointmentsResponse>("/all-appointments");
  return response.data;
};

export default api;
