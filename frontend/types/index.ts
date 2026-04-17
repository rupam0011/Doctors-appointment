// Shared TypeScript interfaces for the frontend

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

export interface ISlot {
  date: string;
  time: string;
}

export interface IDoctor {
  _id: string;
  name: string;
  specialization: string;
  fees: number;
  availableSlots: ISlot[];
  createdAt: string;
  updatedAt: string;
}

export interface IAppointment {
  _id: string;
  userId: IUser | string;
  doctorId: IDoctor | string;
  date: string;
  time: string;
  status: "booked" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: IUser;
}

export interface RegisterResponse {
  message: string;
  verificationToken: string;
}

export interface DoctorsResponse {
  message: string;
  count: number;
  doctors: IDoctor[];
}

export interface AppointmentsResponse {
  message: string;
  count: number;
  appointments: IAppointment[];
}

export interface BookingPayload {
  doctorId: string;
  date: string;
  time: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}
