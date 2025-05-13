import React, { useState } from 'react';

// Define and export the shape of the Alert & Oriented object
export type OrientationState = {
  person: boolean;
  place: boolean;
  time: boolean;
  situation: boolean;
};

// Define and export the shape of the form data using SBAR structure
export type FormData = {
  // Situation
  nurse: string;
  date: string;
  shift: string;
  patientName: string;
  room: string;
  diagnosis: string;
  codeStatus: string; // R1, R2, R3, M1, M2, C1, C2
  allergies: string;
  isolation: string; // None, Contact, Droplet, Airborne, Other
  // Background
  history: string; // Added field for brief history
  fallRisk: boolean;
  bedAlarm: boolean;
  // Assessment
  orientation: OrientationState;
  vitals: string;
  pain: string; // Consider using a scale input later
  mobility: string;
  wounds: string;
  meds: string; // Changed from 'meds' to 'medications' for clarity in label
  io: string;
  bowelBladder: string; // Added field
  // Recommendation
  tasks: string; // Added field
  prns: string; // Added field for PRN meds
  appointmentsToday: string;
  appointmentsUpcoming: string;
  transportArranged: boolean; // Changed from 'transport' string
  notes: string;
};

// Define the props for the component
type PatientFormProps = {
  onSubmit: (data: FormData) => void;
};

// Helper function to create label from key
const formatLabel = (key: string) => key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());

export default function PatientForm({ onSubmit }: PatientFormProps) {
  const [data, setData] = useState<FormData>({
    // Situation
    nurse: '',
    date: '',
    shift: '',
    patientName: '',
    room: '',
    diagnosis: '',
    codeStatus: '',
    allergies: '',
    isolation: 'None', // Default to None
    // Background
    history: '',
    fallRisk: false,
    bedAlarm: false,
    // Assessment
    orientation: { person: false, place: false, time: false, situation: false },
    vitals: '',
    pain: '',
    mobility: '',
    wounds: '',
    meds: '',
    io: '',
    bowelBladder: '',
    // Recommendation
    tasks: '',
    prns: '',
    appointmentsToday: '',
    appointmentsUpcoming: '',
    transportArranged: false,
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      // Handle nested orientation state
      if (name.startsWith('orientation.')) {
        const orientationKey = name.split('.')[1] as keyof OrientationState;
        setData(prevData => ({
          ...prevData,
          orientation: {
            ...prevData.orientation,
            [orientationKey]: checked,
          },
        }));
      } else {
        // Handle top-level boolean fields
        setData(prevData => ({
          ...prevData,
          [name]: checked,
        }));
      }
    } else {
      // Handle other input types
      setData(prevData => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const renderInput = (key: keyof FormData | `orientation.${keyof OrientationState}`, label?: string) => {
    const displayLabel = label || formatLabel(key);
    let value: string | boolean | OrientationState;
    let specificHandleChange = handleChange; // Use the general handler by default

    // Determine value based on key type (top-level or nested orientation)
    if (key.startsWith('orientation.')) {
        const orientationKey = key.split('.')[1] as keyof OrientationState;
        value = data.orientation[orientationKey];
    } else if (key === 'orientation') { // Explicitly handle the 'orientation' key itself
        value = data.orientation;
    } else {
        value = data[key as keyof FormData]; 
    }


    const commonProps = {
      name: key,
      id: key, // Add id for label association
      onChange: specificHandleChange,
      className: 'w-full p-2 border rounded mt-1', // Added mt-1
    };

    // Specific Input Types
    if (key === 'date') {
      return (
        <div key={key}>
          <label htmlFor={key} className="block font-semibold">{displayLabel}</label>
          <input type="date" {...commonProps} value={value as string} />
        </div>
      );
    }
    if (key === 'shift') {
      return (
        <div key={key}>
          <label htmlFor={key} className="block font-semibold">{displayLabel}</label>
          <select {...commonProps} value={value as string}>
            <option value="">Select Shift</option>
            <option value="Day">Day</option>
            <option value="Evening">Evening</option>
            <option value="Night">Night</option>
          </select>
        </div>
      );
    }
    if (key === 'codeStatus') {
         return (
            <div key={key}>
            <label htmlFor={key} className="block font-semibold">{displayLabel}</label>
            <select {...commonProps} value={value as string}>
                <option value="">Select Code Status</option>
                <option value="R1">R1</option>
                <option value="R2">R2</option>
                <option value="R3">R3</option>
                <option value="M1">M1</option>
                <option value="M2">M2</option>
                <option value="C1">C1</option>
                <option value="C2">C2</option>
            </select>
            </div>
        );
    }
     if (key === 'isolation') {
      return (
        <div key={key}>
          <label htmlFor={key} className="block font-semibold">{displayLabel}</label>
          <select {...commonProps} value={value as string}>
            <option value="None">None</option>
            <option value="Contact">Contact</option>
            <option value="Droplet">Droplet</option>
            <option value="Airborne">Airborne</option>
             <option value="Contact/Droplet">Contact/Droplet</option>
            <option value="Other">Other</option>
          </select>
        </div>
      );
    }
     // Checkbox Inputs
    if (typeof value === 'boolean') {
      return (
        <div key={key} className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            id={key}
            name={key}
            checked={value}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor={key} className="font-semibold">{displayLabel}</label>
        </div>
      );
    }

    // Textarea for longer fields
    if (['history', 'diagnosis', 'allergies', 'vitals', 'pain', 'mobility', 'wounds', 'meds', 'io', 'bowelBladder', 'tasks', 'prns', 'appointmentsToday', 'appointmentsUpcoming', 'notes'].includes(key)) {
       return (
        <div key={key}>
          <label htmlFor={key} className="block font-semibold">{displayLabel}</label>
          <textarea
            {...commonProps}
            value={value as string}
            rows={key === 'notes' ? 3 : 2}
          />
        </div>
      );
    }

    // Default to text input
    return (
      <div key={key}>
        <label htmlFor={key} className="block font-semibold">{displayLabel}</label>
        <input type="text" {...commonProps} value={value as string}/>
      </div>
    );
  };

   const renderOrientationCheckboxes = () => {
     const orientationKeys = Object.keys(data.orientation) as Array<keyof OrientationState>;
     return (
       <div className="mt-2">
         <label className="block font-semibold mb-1">Alert and Oriented To:</label>
         <div className="grid grid-cols-2 gap-x-4 gap-y-1">
           {orientationKeys.map((key) => (
              <div key={`orientation.${key}`} className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id={`orientation.${key}`}
                    name={`orientation.${key}`}
                    checked={data.orientation[key]}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor={`orientation.${key}`} className="capitalize">{key}</label>
             </div>
           ))}
         </div>
       </div>
     );
   };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(data);
      }}
      className="space-y-6 bg-white p-4 rounded shadow mb-6" // Use space-y for spacing sections
    >
      {/* Situation Section */}
      <section>
        <h2 className="text-xl font-bold mb-3 border-b pb-1 text-blue-700">Situation</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {renderInput('nurse')}
          {renderInput('date')}
          {renderInput('shift')}
          {renderInput('patientName', 'Patient Name')}
          {renderInput('room')}
          {renderInput('diagnosis')}
          {renderInput('codeStatus', 'Code Status')}
          {renderInput('allergies')}
          {renderInput('isolation')}
        </div>
      </section>

      {/* Background Section */}
      <section>
        <h2 className="text-xl font-bold mb-3 border-b pb-1 text-blue-700">Background</h2>
        <div className="grid gap-4 md:grid-cols-1">
          {renderInput('history', 'Brief History')}
        </div>
         <div className="grid gap-4 md:grid-cols-3 mt-2">
             {renderInput('fallRisk', 'Falls Risk')}
             {renderInput('bedAlarm', 'Bed Alarm On')}
         </div>
      </section>

      {/* Assessment Section */}
      <section>
        <h2 className="text-xl font-bold mb-3 border-b pb-1 text-blue-700">Assessment</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
           {renderOrientationCheckboxes()}
           {renderInput('vitals')}
           {renderInput('pain')}
           {renderInput('mobility')}
           {renderInput('wounds')}
           {renderInput('meds', 'Medications Given/Due')}
           {renderInput('io', 'Intake / Output')}
           {renderInput('bowelBladder', 'Bowel / Bladder')}
         </div>
      </section>

       {/* Recommendation Section */}
      <section>
        <h2 className="text-xl font-bold mb-3 border-b pb-1 text-blue-700">Recommendation</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
           {renderInput('tasks', 'Tasks/Plan')}
           {renderInput('prns', 'PRNs Given/Available')}
           {renderInput('appointmentsToday', 'Appointments Today')}
           {renderInput('appointmentsUpcoming', 'Upcoming Appointments')}
         </div>
         <div className="grid gap-4 md:grid-cols-3 mt-2">
           {renderInput('transportArranged', 'Transport Arranged')}
         </div>
         <div className="grid gap-4 md:grid-cols-1 mt-4">
           {renderInput('notes', 'Additional Notes')}
         </div>
      </section>


      <button
        type="submit"
        className="w-full bg-blue-600 text-white font-semibold px-4 py-3 rounded mt-6 hover:bg-blue-700 active:bg-blue-800 transition-colors text-lg" // Make button larger
      >
        Generate Report Preview
      </button>
    </form>
  );
} 