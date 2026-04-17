"use client";

import React from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppointmentCard from "@/components/AppointmentCard";
import { useMyAppointments, useCancelAppointment } from "@/hooks/useAppointments";
import { useAuth } from "@/providers/AuthProvider";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { user } = useAuth();
  const { data: appointments, isLoading, isError } = useMyAppointments();
  const cancelMutation = useCancelAppointment();

  const bookedAppointments = appointments?.filter((a) => a.status === "booked") || [];
  const cancelledAppointments = appointments?.filter((a) => a.status === "cancelled") || [];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-slate-50 to-indigo-50/30 animate-fade-in">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
            My Appointments
          </h1>
          <p className="text-lg text-slate-500">
            Welcome back, <span className="font-semibold text-slate-700">{user?.name}</span>
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5">
            <p className="text-sm text-slate-500 mb-1">Total</p>
            <p className="text-3xl font-bold text-slate-900">{appointments?.length || 0}</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5">
            <p className="text-sm text-slate-500 mb-1">Active</p>
            <p className="text-3xl font-bold text-emerald-600">{bookedAppointments.length}</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5 hidden sm:block">
            <p className="text-sm text-slate-500 mb-1">Cancelled</p>
            <p className="text-3xl font-bold text-slate-400">{cancelledAppointments.length}</p>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
              <p className="text-sm text-slate-500">Loading appointments...</p>
            </div>
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="text-center py-20">
            <p className="text-lg font-semibold text-red-600">Failed to load appointments</p>
            <p className="text-sm text-slate-500 mt-2">Please try again later</p>
          </div>
        )}

        {/* Appointments List */}
        {!isLoading && !isError && (
          <>
            {appointments && appointments.length > 0 ? (
              <div className="space-y-8">
                {/* Active Appointments */}
                {bookedAppointments.length > 0 && (
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Active Appointments
                    </h2>
                    <div className="space-y-3">
                      {bookedAppointments.map((appointment) => (
                        <AppointmentCard
                          key={appointment._id}
                          appointment={appointment}
                          onCancel={(id) => cancelMutation.mutate(id)}
                          isCancelling={cancelMutation.isPending}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Cancelled Appointments */}
                {cancelledAppointments.length > 0 && (
                  <div>
                    <h2 className="text-lg font-bold text-slate-500 mb-4">
                      Past / Cancelled
                    </h2>
                    <div className="space-y-3">
                      {cancelledAppointments.map((appointment) => (
                        <AppointmentCard
                          key={appointment._id}
                          appointment={appointment}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-slate-100 flex items-center justify-center">
                  <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No appointments yet</h3>
                <p className="text-slate-500 mb-6">Book your first appointment with a doctor</p>
                <Link
                  href="/doctors"
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 transition-all duration-300"
                >
                  Find a Doctors →
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
