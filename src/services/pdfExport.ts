import { supabase } from '../lib/supabase';

const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhc2F5a2x4dWl0eWN3ZXN1em1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzOTg0MjUsImV4cCI6MjA3NTk3NDQyNX0.MpQkAN28Re4EYTr_1rnxwt86z81rvzS1rVYiKpHGKfw';

export const generateAssessmentPDF = async (data: { sections: any; assessment: any; submittedAt: string }): Promise<void> => {
  try {
    // Call the backend PDF export function
    const { data: responseData, error } = await supabase.functions.invoke('pdf-export', {
      body: { 
        assessmentData: data,
        client_id: 'default'
      },
      headers: {
        Authorization: `Bearer ${ANON_KEY}`,
      },
    });

    if (error) {
      throw error;
    }

    // Open HTML in new window for saving/printing
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(responseData);
      newWindow.document.close();
    }
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

export default generateAssessmentPDF;
