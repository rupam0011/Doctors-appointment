"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAppointment } from "@/services/api";
import { BookingPayload } from "@/types";
import toast from "react-hot-toast";

export const useBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BookingPayload) => createAppointment(data),
    onSuccess: () => {
      toast.success("Appointment booked successfully! 🎉");
      queryClient.invalidateQueries({ queryKey: ["my-appointments"] });
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
    },
    onError: (error: any) => {
      const status = error?.response?.status;
      const message = error?.response?.data?.message || "Failed to book appointment";

      if (status === 409) {
        toast.error("⚠️ This slot is already booked! Please choose another time.");
      } else {
        toast.error(message);
      }
    },
  });
};
