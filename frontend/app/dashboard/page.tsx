"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import { Users, Calendar, LogOut, Activity, UserPlus, CalendarPlus } from "lucide-react";
import AddPatientModal from "@/components/AddPatientModal";
import AddAppointmentModal from "@/components/AddAppointmentModal";
import { Toaster } from "react-hot-toast";

interface Patient {
  id: number;
  name: string;
  age: number;
  phone: string;
}

interface Appointment {
  id: number;
  patient_name: string;
  doctor_name: string;
  appointment_date: string;
  status: string;
}

export default function DashboardPage() {
  const router = useRouter();
  
  // Data States
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState("");
  
  // Modal States
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
  const [isAddAppointmentModalOpen, setIsAddAppointmentModalOpen] = useState(false);

  // Fetch all dashboard data
  const fetchData = async () => {
    try {
      const [patientsRes, appointmentsRes] = await Promise.all([
        api.get("/patients"),
        api.get("/appointments")
      ]);
      setPatients(patientsRes.data);
      setAppointments(appointmentsRes.data);
    } catch (error: unknown) {
      console.error("Error fetching dashboard data:", error);
      if ((error as { response?: { status?: number } }).response?.status === 401 || (error as { response?: { status?: number } }).response?.status === 403) {
        localStorage.clear();
        router.push("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Route Guard
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (!token) {
      router.push("/login");
      return;
    }

    if (userStr) {
      setUserName(JSON.parse(userStr).name);
    }

    fetchData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  // Calculate today's appointments dynamically
  const todaysAppointmentsCount = appointments.filter(app => {
    const appDate = new Date(app.appointment_date).toDateString();
    const today = new Date().toDateString();
    return appDate === today;
  }).length;

  // Format date helper
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', month: 'short', day: 'numeric', 
      hour: '2-digit', minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString('ar-EG', options);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      
      <Toaster position="top-center" reverseOrder={false} />

      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-blue-600 ml-2" />
              <span className="text-xl font-bold text-gray-900">عيادتي - الإدارة</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">مرحباً، {userName}</span>
              <button onClick={handleLogout} className="flex items-center text-red-600 hover:text-red-800 transition-colors bg-red-50 px-3 py-1.5 rounded-md">
                <LogOut className="h-4 w-4 ml-1" />
                خروج
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-100">
            <div className="p-5 flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="mr-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">إجمالي المرضى</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{patients.length}</dd>
                </dl>
              </div>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-100">
            <div className="p-5 flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div className="mr-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">مواعيد اليوم</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{todaysAppointmentsCount}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Appointments Section */}
        <div className="bg-white shadow rounded-lg border border-gray-100">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">المواعيد القادمة</h3>
            <button 
                onClick={() => setIsAddAppointmentModalOpen(true)}
                className="flex items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
            >
              <CalendarPlus className="h-4 w-4 ml-2" />
              حجز موعد
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-right">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">المريض</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">الطبيب</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">التاريخ والوقت</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                      لا يوجد مواعيد مسجلة.
                    </td>
                  </tr>
                ) : (
                  appointments.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{app.patient_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.doctor_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" dir="ltr">{formatDate(app.appointment_date)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {app.status === 'scheduled' ? 'مجدول' : app.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Patients Section */}
        <div className="bg-white shadow rounded-lg border border-gray-100">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">سجل المرضى</h3>
            <button 
                onClick={() => setIsAddPatientModalOpen(true)}
                className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              <UserPlus className="h-4 w-4 ml-2" />
              إضافة مريض
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-right">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">الرقم</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">الاسم</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">العمر</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">رقم الهاتف</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {patients.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                      لا يوجد مرضى مسجلين.
                    </td>
                  </tr>
                ) : (
                  patients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{patient.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{patient.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.age} سنة</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.phone || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* Modals */}
      <AddPatientModal 
        isOpen={isAddPatientModalOpen} 
        onClose={() => setIsAddPatientModalOpen(false)} 
        onPatientAdded={fetchData} 
      />
      <AddAppointmentModal 
        isOpen={isAddAppointmentModalOpen} 
        onClose={() => setIsAddAppointmentModalOpen(false)} 
        onAppointmentAdded={fetchData} 
      />
    </div>
  );
}