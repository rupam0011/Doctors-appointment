"use client";

import { useQuery } from "@tanstack/react-query";
import { getDoctors, getDoctorById } from "@/services/api";

export const useDoctors = (specialization?: string) => {
  return useQuery({
    queryKey: ["doctors", specialization],
    queryFn: () => getDoctors(specialization),
    select: (data) => data.doctors,
  });
};

export const useDoctor = (id: string) => {
  return useQuery({
    queryKey: ["doctor", id],
    queryFn: () => getDoctorById(id),
    select: (data) => data.doctor,
    enabled: !!id,
  });
};
