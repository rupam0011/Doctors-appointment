"use client";

import React, { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAllAppointments } from "@/hooks/useAppointments";
import { createDoctor } from "@/services/api";
import toast from "react-hot-toast";
import { IDoctor, IUser } from "@/types";

export default function AdminPage() {
  return (
    <ProtectedRoute adminOnly>
      <AdminContent />
    </ProtectedRoute>
  );
}

function AdminContent() {
  const { data: appointments, isLoading, isError } = useAllAppointments();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDoctor, setNewDoctor] = useState({ name: "", specialization: "Cardiologist", fees: "" });
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoctor.name || !newDoctor.fees) {
      toast.error("Please fill all fields");
      return;
    }
    setIsCreating(true);
    try {
      await createDoctor({ 
        name: newDoctor.name.startsWith("Dr.") ? newDoctor.name : `Dr. ${newDoctor.name}`, 
        specialization: newDoctor.specialization, 
        fees: Number(newDoctor.fees) 
      });
      toast.success("Doctor added successfully");
      setIsModalOpen(false);
      setNewDoctor({ name: "", specialization: "Cardiologist", fees: "" });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add doctor");
    } finally {
      setIsCreating(false);
    }
  };

  const totalBookings = appointments?.length || 0;
  const activeBookings = appointments?.filter((a) => a.status === "booked").length || 0;
  const cancelledBookings = appointments?.filter((a) => a.status === "cancelled").length || 0;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-slate-50 to-indigo-50/30 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold">
                ADMIN
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
              All Appointments
            </h1>
            <p className="text-lg text-slate-500">
              System-wide appointment overview
            </p>
          </div>
          
          <div className="flex items-center">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl shadow-md hover:bg-indigo-700 transition-all"
            >
              + Add Doctor
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5">
            <p className="text-sm text-slate-500 mb-1">Total</p>
            <p className="text-3xl font-bold text-slate-900">{totalBookings}</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5">
            <p className="text-sm text-slate-500 mb-1">Active</p>
            <p className="text-3xl font-bold text-emerald-600">{activeBookings}</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5">
            <p className="text-sm text-slate-500 mb-1">Cancelled</p>
            <p className="text-3xl font-bold text-red-500">{cancelledBookings}</p>
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
          </div>
        )}

        {/* Table */}
        {!isLoading && !isError && appointments && (
          <>
            {appointments.length > 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/50">
                        <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Patient
                        </th>
                        <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Doctor
                        </th>
                        <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Specialization
                        </th>
                        <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Time
                        </th>
                        <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Fee
                        </th>
                        <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {appointments.map((appointment) => {
                        const patient = appointment.userId as IUser;
                        const doctor = appointment.doctorId as IDoctor;
                        const isBooked = appointment.status === "booked";

                        return (
                          <tr
                            key={appointment._id}
                            className="hover:bg-slate-50/50 transition-colors duration-150"
                          >
                            <td className="py-4 px-6">
                              <div>
                                <p className="text-sm font-semibold text-slate-900">
                                  {patient?.name || "N/A"}
                                </p>
                                <p className="text-xs text-slate-400">
                                  {patient?.email || "N/A"}
                                </p>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <p className="text-sm font-medium text-slate-900">
                                {doctor?.name || "N/A"}
                              </p>
                            </td>
                            <td className="py-4 px-6">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                                {doctor?.specialization || "N/A"}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-sm text-slate-600 font-medium">
                              {appointment.date}
                            </td>
                            <td className="py-4 px-6 text-sm text-slate-600 font-medium">
                              {appointment.time}
                            </td>
                            <td className="py-4 px-6 text-sm font-bold text-slate-900">
                              ₹{doctor?.fees || "N/A"}
                            </td>
                            <td className="py-4 px-6">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                                  isBooked
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-red-50 text-red-600"
                                }`}
                              >
                                <div className={`w-1.5 h-1.5 rounded-full ${isBooked ? "bg-emerald-500" : "bg-red-400"}`} />
                                {isBooked ? "Booked" : "Cancelled"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-lg font-semibold text-slate-900 mb-2">No appointments yet</p>
                <p className="text-sm text-slate-500">Appointments will appear here once users start booking</p>
              </div>
            )}
          </>
        )}

        {/* Add Doctor Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-fade-in">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-bold text-slate-900">Add New Doctor</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                  <input type="text" value={newDoctor.name} onChange={(e) => setNewDoctor({...newDoctor, name: e.target.value})} placeholder="Full Name" className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Specialization</label>
                  <select value={newDoctor.specialization} onChange={(e) => setNewDoctor({...newDoctor, specialization: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
                    <option value="Cardiologist">Cardiologist</option>
                    <option value="Dermatologist">Dermatologist</option>
                    <option value="Pediatrician">Pediatrician</option>
                    <option value="Neurologist">Neurologist</option>
                    <option value="Orthopedist">Orthopedist</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Consultation Fees (₹)</label>
                  <input type="number" value={newDoctor.fees} onChange={(e) => setNewDoctor({...newDoctor, fees: e.target.value})} placeholder="1000" className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" required min="0" />
                </div>
                <button type="submit" disabled={isCreating} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50">
                  {isCreating ? "Adding..." : "Add Doctor"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
