"use client";

import { useState } from "react";
import api from "@/services/api";
import { X } from "lucide-react";
import toast from "react-hot-toast";

interface AddPatientModalProps {
  isOpen: boolean;        
  onClose: () => void;   
  onPatientAdded: () => void;  
}

export default function AddPatientModal({
  isOpen,
  onClose,
  onPatientAdded,
}: AddPatientModalProps) {
  
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setIsLoading(true);

    if (!name || !age) {
        toast.error("Name and age are required");
        setIsLoading(false);
        return;
    }

    try {
      await api.post("/patients", {
        name,
        age: parseInt(age),  
        phone,
      });

      toast.success("Patient added successfully");
      
      setName("");
      setAge("");
      setPhone("");
      
      onClose();
      onPatientAdded();
      
    } catch (error: unknown) {
      console.error("Error adding patient:", error);
      toast.error((error as { response?: { data?: { error?: string } } }).response?.data?.error || "Failed to add patient");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed id-0 top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 transition-opacity duration-300">
      
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 scale-100 p-6" dir="rtl">
        
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">Add Patient</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-right"
              placeholder="Example: محمد أحمد"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age *</label>
              <input
                type="number"
                required
                min="0"
                max="120"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-right"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number (Optional)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-left"
                placeholder="09xx..."
                dir="ltr"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8 border-t pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Save Patient"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}