import React from 'react';
import { type FormData, type OrientationState } from './PatientForm'; // Import the types

// Define the props for the component
type ReportPreviewProps = {
  data: FormData;
};

// Helper to format Orientation
function formatOrientation(orientation: OrientationState): string {
  const orientedTo = Object.entries(orientation)
    .filter(([, value]) => value)
    .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1)); // Capitalize

  if (orientedTo.length === 0) {
    return 'Not oriented';
  }
  return orientedTo.join(', ');
}

// Update formatReport to SBAR structure
function formatReport(data: FormData): string {
  return `
**SITUATION**
Nurse: ${data.nurse} | Date: ${data.date} | Shift: ${data.shift}
Patient: ${data.patientName} | Room: ${data.room}
Diagnosis: ${data.diagnosis}
Code Status: ${data.codeStatus || 'N/A'} | Allergies: ${data.allergies || 'None known'} | Isolation: ${data.isolation}

**BACKGROUND**
History: ${data.history || 'N/A'}
Fall Risk: ${data.fallRisk ? 'Yes' : 'No'} | Bed Alarm: ${data.bedAlarm ? 'On' : 'Off'}

**ASSESSMENT**
Alert & Oriented To: ${formatOrientation(data.orientation)}
Vitals: ${data.vitals || 'N/A'}
Pain: ${data.pain || 'N/A'}
Mobility: ${data.mobility || 'N/A'}
Wounds: ${data.wounds || 'N/A'}
Medications Given/Due: ${data.meds || 'N/A'}
I/O: ${data.io || 'N/A'}
Bowel/Bladder: ${data.bowelBladder || 'N/A'}

**RECOMMENDATION**
Tasks/Plan: ${data.tasks || 'N/A'}
PRNs Given/Available: ${data.prns || 'N/A'}
Appointments Today: ${data.appointmentsToday || 'None'}
Upcoming Appointments: ${data.appointmentsUpcoming || 'None'}
Transport Arranged: ${data.transportArranged ? 'Yes' : 'No'}
Notes: ${data.notes || 'None'}
  `.trim();
}

export default function ReportPreview({ data }: ReportPreviewProps) {
  const reportText = formatReport(data);

  return (
    <div className="mt-6 bg-white p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-2">Preview (SBAR Format)</h2>
      {/* Use markdown-like formatting for display */}
      <div className="prose prose-sm max-w-none whitespace-pre-wrap font-mono text-sm border p-3 rounded bg-gray-50">
        {reportText.split('\n\n').map((section, i) => (
          <div key={i}>
            {section.split('\n').map((line, j) => {
              if (line.startsWith('**') && line.endsWith('**')) {
                return <strong key={j} className="block mt-2 mb-1 text-blue-700">{line.slice(2, -2)}</strong>;
              }
              return <div key={j}>{line}</div>;
            })}
          </div>
        ))}
      </div>
      <button
        onClick={() => navigator.clipboard.writeText(reportText)} // Use cached reportText
        className="mt-4 bg-green-600 text-white font-semibold px-4 py-2 rounded hover:bg-green-700 active:bg-green-800 transition-colors w-full md:w-auto"
      >
        Copy Report to Clipboard
      </button>
    </div>
  );
} 