"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import { Users, Calendar, LogOut, Activity, UserPlus } from "lucide-react";
import AddPatientModal from "@/components/AddPatientModal";
import { Toaster } from "react-hot-toast";

interface Patient {
  id: number;
  name: string;
  age: number;
  phone: string;
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState("");
  
  // 👈 State للتحكم بفتح وإغلاق النافذة المنبثقة
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchPatients = useCallback(async () => {
    try {
      const response = await api.get("/patients");
      setPatients(response.data);
    } catch (error: unknown) {
      console.error("Error fetching patients:", error);
      if ((error as { response?: { status?: number } }).response?.status === 401 || (error as { response?: { status?: number } }).response?.status === 403) {
        localStorage.clear();
        router.push("/login");
      }
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (!token) {
      router.push("/login");
      return;
    }

    if (userStr) {
      setUserName(JSON.parse(userStr).name);
    }

    fetchPatients(); // fetch patients when the component mounts
  }, [router, fetchPatients]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
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

      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-blue-600 ml-2" />
              <span className="text-xl font-bold text-gray-900">My Clinic - Admin</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Hello, {userName}</span>
              <button onClick={handleLogout} className="flex items-center text-red-600 hover:text-red-800 transition-colors bg-red-50 px-3 py-1.5 rounded-md">
                <LogOut className="h-4 w-4 ml-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        
  
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-100">
            <div className="p-5 flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="mr-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Patients</dt>
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
                  <dt className="text-sm font-medium text-gray-500 truncate">Appointments Today</dt>
                  <dd className="text-2xl font-semibold text-gray-900">0</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg border border-gray-100">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Patients</h3>
            
            <button 
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              <UserPlus className="h-4 w-4 ml-2" />
              Add Patient
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-right">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {patients.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                      There are no patients yet. Click the &quot;Add Patient&quot; button to create your first patient record.
                    </td>
                  </tr>
                ) : (
                  patients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{patient.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.age} years</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.phone || 'Unavailable'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>

\      <AddPatientModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onPatientAdded={fetchPatients}  
      />
    </div>
  );
}