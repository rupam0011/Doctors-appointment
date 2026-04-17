"use client";

import React, { useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDoctor } from "@/hooks/useDoctors";
import { useBooking } from "@/hooks/useBooking";
import { useAuth } from "@/providers/AuthProvider";
import toast from "react-hot-toast";

interface BookPageProps {
  params: Promise<{ doctorId: string }>;
}

export default function BookPage({ params }: BookPageProps) {
  const { doctorId } = use(params);
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { data: doctor, isLoading, isError } = useDoctor(doctorId);
  const bookingMutation = useBooking();

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Get unique dates from available slots
  const availableDates = doctor
    ? [...new Set(doctor.availableSlots.map((s) => s.date))].sort()
    : [];

  // Get times for selected date
  const availableTimes = doctor && selectedDate
    ? doctor.availableSlots
        .filter((s) => s.date === selectedDate)
        .map((s) => s.time)
        .sort()
    : [];

  const handleBook = () => {
    if (!isAuthenticated) {
      toast.error("Please log in to book an appointment");
      router.push("/login");
      return;
    }

    if (!selectedDate || !selectedTime) {
      toast.error("Please select a date and time");
      return;
    }

    bookingMutation.mutate(
      { doctorId, date: selectedDate, time: selectedTime },
      {
        onSuccess: () => {
          setSelectedDate(null);
          setSelectedTime(null);
          setTimeout(() => router.push("/dashboard"), 1500);
        },
      }
    );
  };

  // Loading
  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-sm text-slate-500">Loading doctor details...</p>
        </div>
      </div>
    );
  }

  // Error
  if (isError || !doctor) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-lg font-semibold text-slate-900 mb-2">Doctor not found</p>
          <Link href="/doctors" className="text-indigo-600 hover:text-indigo-700 font-medium text-sm">
            ← Back to doctors
          </Link>
        </div>
      </div>
    );
  }

  const specializationIcons: Record<string, string> = {
    Cardiologist: "❤️", Dermatologist: "🧴", Pediatrician: "👶",
    Neurologist: "🧠", Orthopedist: "🦴",
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-slate-50 to-indigo-50/30 animate-fade-in">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back link */}
        <Link
          href="/doctors"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 mb-8 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to doctors
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Doctor Info Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-4xl shadow-lg">
                  {specializationIcons[doctor.specialization] || "🩺"}
                </div>
                <h2 className="text-xl font-bold text-slate-900">{doctor.name}</h2>
                <p className="text-sm font-medium text-indigo-600 mt-1">{doctor.specialization}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between py-3 px-4 bg-slate-50 rounded-xl">
                  <span className="text-sm text-slate-500">Consultation Fee</span>
                  <span className="text-lg font-bold text-slate-900">₹{doctor.fees}</span>
                </div>
                <div className="flex items-center justify-between py-3 px-4 bg-slate-50 rounded-xl">
                  <span className="text-sm text-slate-500">Available Slots</span>
                  <span className="text-sm font-bold text-emerald-600">{doctor.availableSlots.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Select Date */}
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-sm font-bold text-indigo-600">1</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">Select a Date</h3>
              </div>

              {availableDates.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {availableDates.map((date) => {
                    const dateObj = new Date(date + "T00:00:00");
                    const dayName = dateObj.toLocaleDateString("en-US", { weekday: "short" });
                    const dayNum = dateObj.getDate();
                    const month = dateObj.toLocaleDateString("en-US", { month: "short" });

                    return (
                      <button
                        key={date}
                        onClick={() => {
                          setSelectedDate(date);
                          setSelectedTime(null);
                        }}
                        className={`p-4 rounded-xl border-2 text-center transition-all duration-200 ${
                          selectedDate === date
                            ? "border-indigo-500 bg-indigo-50 shadow-md shadow-indigo-100"
                            : "border-slate-200 hover:border-indigo-300 hover:bg-slate-50"
                        }`}
                      >
                        <div className={`text-xs font-medium mb-1 ${selectedDate === date ? "text-indigo-600" : "text-slate-400"}`}>
                          {dayName}
                        </div>
                        <div className={`text-2xl font-bold ${selectedDate === date ? "text-indigo-600" : "text-slate-900"}`}>
                          {dayNum}
                        </div>
                        <div className={`text-xs font-medium ${selectedDate === date ? "text-indigo-500" : "text-slate-400"}`}>
                          {month}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-slate-500 text-sm">No dates available</p>
              )}
            </div>

            {/* Step 2: Select Time */}
            <div className={`bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 transition-opacity duration-300 ${!selectedDate ? "opacity-50 pointer-events-none" : ""}`}>
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedDate ? "bg-indigo-100" : "bg-slate-100"}`}>
                  <span className={`text-sm font-bold ${selectedDate ? "text-indigo-600" : "text-slate-400"}`}>2</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">Select a Time Slot</h3>
              </div>

              {availableTimes.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {availableTimes.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`p-3 rounded-xl border-2 text-center text-sm font-semibold transition-all duration-200 ${
                        selectedTime === time
                          ? "border-indigo-500 bg-indigo-50 text-indigo-600 shadow-md shadow-indigo-100"
                          : "border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-slate-50"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-sm">
                  {selectedDate ? "No time slots available for this date" : "Please select a date first"}
                </p>
              )}
            </div>

            {/* Step 3: Confirm */}
            <div className={`bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 transition-opacity duration-300 ${!selectedTime ? "opacity-50 pointer-events-none" : ""}`}>
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedTime ? "bg-indigo-100" : "bg-slate-100"}`}>
                  <span className={`text-sm font-bold ${selectedTime ? "text-indigo-600" : "text-slate-400"}`}>3</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">Confirm Booking</h3>
              </div>

              {selectedDate && selectedTime && (
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 mb-5">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Doctor</p>
                      <p className="text-sm font-bold text-slate-900">{doctor.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Date</p>
                      <p className="text-sm font-bold text-slate-900">{selectedDate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Time</p>
                      <p className="text-sm font-bold text-slate-900">{selectedTime}</p>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleBook}
                disabled={!selectedDate || !selectedTime || bookingMutation.isPending}
                className="w-full py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {bookingMutation.isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Booking...
                  </span>
                ) : (
                  `Confirm Booking — ₹${doctor.fees}`
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
