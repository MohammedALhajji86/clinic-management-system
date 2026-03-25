"use client";

import { useState, useEffect } from "react";
import api from "@/services/api";
import { X } from "lucide-react";
import toast from "react-hot-toast";

interface Patient {
  id: number;
  name: string;
}

interface Doctor {
  id: number;
  name: string;
  specialization: string;
}

interface AddAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAppointmentAdded: () => void;
}

export default function AddAppointmentModal({
  isOpen,
  onClose,
  onAppointmentAdded,
}: AddAppointmentModalProps) {
  
  // Form states
  const [patientId, setPatientId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  
  // Data states for dropdowns
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch doctors and patients when the modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        try {
          const [patientsRes, doctorsRes] = await Promise.all([
            api.get("/patients"),
            api.get("/doctors")
          ]);
          setPatients(patientsRes.data);
          setDoctors(doctorsRes.data);
        } catch (error) {
          console.error("Error fetching data for modal:", error);
          toast.error("Failed to load patients or doctors.");
        }
      };
      fetchData();
    }
  }, [isOpen]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!patientId || !doctorId || !appointmentDate) {
      toast.error("Please fill all fields!");
      setIsLoading(false);
      return;
    }

    try {
      await api.post("/appointments", {
        patient_id: parseInt(patientId),
        doctor_id: parseInt(doctorId),
        appointment_date: appointmentDate,
      });

      toast.success("Appointment booked successfully! 🎉");
      
      // Reset form
      setPatientId("");
      setDoctorId("");
      setAppointmentDate("");
      
      onClose();
      onAppointmentAdded();
      
    } catch (error: unknown) {
      console.error("Error booking appointment:", error);
      toast.error((error as { response?: { data?: { error?: string } } }).response?.data?.error || "Failed to book appointment");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 transition-opacity duration-300">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 scale-100 p-6" dir="rtl">
        
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">حجز موعد جديد</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">المريض *</label>
            <select
              required
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">-- اختر المريض --</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الطبيب المعالج *</label>
            <select
              required
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">-- اختر الطبيب --</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>{d.name} ({d.specialization})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ ووقت الموعد *</label>
            <input
              type="datetime-local"
              required
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-left"
              dir="ltr"
            />
          </div>

          <div className="flex justify-end gap-3 mt-8 border-t pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isLoading ? "جاري الحجز..." : "تأكيد الموعد"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}