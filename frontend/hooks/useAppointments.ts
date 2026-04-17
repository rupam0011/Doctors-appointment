"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyAppointments, cancelAppointment, getAllAppointments } from "@/services/api";
import toast from "react-hot-toast";

export const useMyAppointments = () => {
  return useQuery({
    queryKey: ["my-appointments"],
    queryFn: getMyAppointments,
    select: (data) => data.appointments,
  });
};

export const useAllAppointments = () => {
  return useQuery({
    queryKey: ["all-appointments"],
    queryFn: getAllAppointments,
    select: (data) => data.appointments,
  });
};

export const useCancelAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelAppointment,
    onSuccess: () => {
      toast.success("Appointment cancelled successfully");
      queryClient.invalidateQueries({ queryKey: ["my-appointments"] });
      queryClient.invalidateQueries({ queryKey: ["all-appointments"] });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to cancel appointment";
      toast.error(message);
    },
  });
};
