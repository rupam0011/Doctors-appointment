"use client";

import React from "react";
import { IAppointment, IDoctor } from "@/types";

interface AppointmentCardProps {
  appointment: IAppointment;
  onCancel?: (id: string) => void;
  isCancelling?: boolean;
  showUser?: boolean;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onCancel,
  isCancelling,
  showUser,
}) => {
  const doctor = appointment.doctorId as IDoctor;
  const user = appointment.userId as { name: string; email: string };
  const isBooked = appointment.status === "booked";

  return (
    <div className={`relative bg-white rounded-2xl border shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md ${
      isBooked ? "border-slate-200/60" : "border-slate-200/40 opacity-75"
    }`}>
      {/* Status indicator */}
      <div className={`absolute top-0 left-0 w-1 h-full ${isBooked ? "bg-emerald-500" : "bg-slate-300"}`} />

      <div className="p-5 pl-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Doctor info */}
            <h3 className="text-base font-bold text-slate-900">
              {doctor?.name || "Unknown Doctor"}
            </h3>
            <p className="text-sm text-indigo-600 font-medium mb-3">
              {doctor?.specialization || "N/A"}
            </p>

            {/* User info */}
            {showUser && user && (
              <div className="flex items-center gap-2 mb-3 text-sm text-slate-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>{user.name} ({user.email})</span>
              </div>
            )}

            {/* Date and Time */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 text-sm text-slate-600">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="font-medium">{appointment.date}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-slate-600">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">{appointment.time}</span>
              </div>
              {doctor?.fees && (
                <div className="text-sm font-semibold text-slate-700">₹{doctor.fees}</div>
              )}
            </div>
          </div>

          {/* Status & Cancel */}
          <div className="flex flex-col items-end gap-3">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                isBooked
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${isBooked ? "bg-emerald-500" : "bg-slate-400"}`} />
              {isBooked ? "Booked" : "Cancelled"}
            </span>

            {isBooked && onCancel && (
              <button
                onClick={() => onCancel(appointment._id)}
                disabled={isCancelling}
                className="px-4 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCancelling ? "Cancelling..." : "Cancel"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard;
