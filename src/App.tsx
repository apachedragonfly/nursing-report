import React, { useState } from 'react';
import PatientForm from './components/PatientForm.tsx';
import ReportPreview from './components/ReportPreview.tsx';
import { type FormData } from './components/PatientForm.tsx'; // Import the type

export default function App() {
  // Use the FormData type for the state
  const [formData, setFormData] = useState<FormData | null>(null);

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">End-of-Shift Report Generator</h1>
      <PatientForm onSubmit={setFormData} />
      {formData && <ReportPreview data={formData} />} // Pass typed data
    </div>
  );
} 