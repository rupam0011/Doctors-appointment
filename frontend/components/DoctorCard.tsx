"use client";

import React from "react";
import Link from "next/link";
import { IDoctor } from "@/types";

interface DoctorCardProps {
  doctor: IDoctor;
}

const specializationIcons: Record<string, string> = {
  Cardiologist: "❤️",
  Dermatologist: "🧴",
  Pediatrician: "👶",
  Neurologist: "🧠",
  Orthopedist: "🦴",
};

const specializationColors: Record<string, string> = {
  Cardiologist: "from-rose-500 to-pink-600",
  Dermatologist: "from-amber-500 to-orange-600",
  Pediatrician: "from-emerald-500 to-teal-600",
  Neurologist: "from-violet-500 to-purple-600",
  Orthopedist: "from-blue-500 to-cyan-600",
};

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
  const icon = specializationIcons[doctor.specialization] || "🩺";
  const gradient = specializationColors[doctor.specialization] || "from-indigo-500 to-purple-600";
  const availableCount = doctor.availableSlots.length;

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:shadow-indigo-100/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      {/* Top gradient bar */}
      <div className={`h-1.5 bg-gradient-to-r ${gradient}`} />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-2xl shadow-lg`}>
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-slate-900 truncate">{doctor.name}</h3>
            <p className="text-sm font-medium text-indigo-600">{doctor.specialization}</p>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-3 mb-5">
          <div className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-xl">
            <span className="text-sm text-slate-500">Consultation Fee</span>
            <span className="text-lg font-bold text-slate-900">₹{doctor.fees}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <div className={`w-2 h-2 rounded-full ${availableCount > 0 ? "bg-emerald-500 animate-pulse" : "bg-red-400"}`} />
            <span className={availableCount > 0 ? "text-emerald-600 font-medium" : "text-red-500 font-medium"}>
              {availableCount > 0 ? `${availableCount} slots available` : "No slots available"}
            </span>
          </div>
        </div>

        {/* Action */}
        <Link
          href={`/book/${doctor._id}`}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
            availableCount > 0
              ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-300 hover:from-indigo-700 hover:to-purple-700"
              : "bg-slate-100 text-slate-400 cursor-not-allowed"
          }`}
          onClick={(e) => availableCount === 0 && e.preventDefault()}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Book Appointment
        </Link>
      </div>
    </div>
  );
};

export default DoctorCard;
