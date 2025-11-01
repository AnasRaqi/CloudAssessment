import { supabase } from '../lib/supabase';

const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhc2F5a2x4dWl0eWN3ZXN1em1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzOTg0MjUsImV4cCI6MjA3NTk3NDQyNX0.MpQkAN28Re4EYTr_1rnxwt86z81rvzS1rVYiKpHGKfw';

// Authentication functions
export const authAPI = {
  async login(username: string, password: string) {
    const { data, error } = await supabase.functions.invoke('auth-login', {
      body: { username, password },
    });

    if (error) {
      throw error;
    }

    if (data?.success) {
      localStorage.setItem('authToken', data.token);
      return data;
    } else {
      throw new Error(data?.error || 'Login failed');
    }
  },

  logout() {
    localStorage.removeItem('authToken');
    window.location.href = '/';
  },

  getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      Authorization: `Bearer ${token}`,
    };
  },
};

// Questionnaire API
export const questionnaireAPI = {
  async getQuestionnaire() {
    const { data, error } = await supabase.functions.invoke('questionnaire', {
      body: { client_id: 'naqel' },
      headers: {
        Authorization: `Bearer ${ANON_KEY}`,
      },
    });

    if (error) {
      throw error;
    }
    return data;
  },

  async saveQuestionnaire(sections: any, submit = false) {
    const { data, error } = await supabase.functions.invoke('questionnaire', {
      body: { client_id: 'naqel', sections, submit },
      headers: {
        Authorization: `Bearer ${ANON_KEY}`,
      },
    });

    if (error) {
      throw error;
    }
    return data;
  },
};

// Assessment API
export const assessmentAPI = {
  async getAssessment() {
    const { data, error } = await supabase.functions.invoke('assessment', {
      body: { client_id: 'naqel' },
      headers: {
        Authorization: `Bearer ${ANON_KEY}`,
      },
    });

    if (error) {
      throw error;
    }
    return data;
  },

  async updateAssessment(assessmentData: any) {
    const { data, error } = await supabase.functions.invoke('assessment', {
      body: { client_id: 'naqel', ...assessmentData },
      headers: {
        Authorization: `Bearer ${ANON_KEY}`,
      },
    });

    if (error) {
      throw error;
    }
    return data;
  },
};

// File upload API
export const uploadAPI = {
  async uploadFile(fileData: string, fileName: string, section: string) {
    try {
      console.log('Calling file-upload edge function with:', { client_id: 'naqel', fileName, section });
      
      const { data, error } = await supabase.functions.invoke('file-upload', {
        body: { client_id: 'naqel', fileData, fileName, section },
        headers: {
          Authorization: `Bearer ${ANON_KEY}`,
        },
      });

      console.log('Edge function response:', { data, error });

      if (error) {
        console.error('Supabase function invoke error:', error);
        throw error;
      }
      
      // Handle both possible response structures
      if (data?.success) {
        return data;
      } else if (data?.error) {
        throw new Error(`Edge function error: ${data.error.message || data.error.code}`);
      } else {
        return data;
      }
    } catch (err) {
      console.error('Upload API error:', err);
      throw err;
    }
  },
};

// Email notification API
export const emailAPI = {
  async sendNotification(type: string, assessmentData?: any) {
    const { data, error } = await supabase.functions.invoke('email-notifications', {
      body: { type, assessment_data: assessmentData },
    });

    if (error) {
      throw error;
    }
    return data;
  },
};

// Submitted Assessments API
export const submittedAssessmentsAPI = {
  async getSubmittedAssessments() {
    const { data, error } = await supabase.functions.invoke('submitted-assessments', {
      body: { client_id: 'naqel' },
      headers: {
        Authorization: `Bearer ${ANON_KEY}`,
      },
    });

    if (error) {
      throw error;
    }
    return data;
  },

  async createNewAssessment() {
    const { data, error } = await supabase.functions.invoke('submitted-assessments', {
      body: { client_id: 'naqel', action: 'create_new' },
      headers: {
        Authorization: `Bearer ${ANON_KEY}`,
      },
    });

    if (error) {
      throw error;
    }
    return data;
  },

  async deleteAssessment(assessmentId: string) {
    const { data, error } = await supabase.functions.invoke('submitted-assessments', {
      body: { client_id: 'naqel', action: 'delete', assessment_id: assessmentId },
      headers: {
        Authorization: `Bearer ${ANON_KEY}`,
      },
    });

    if (error) {
      throw error;
    }
    return data;
  },
};

// Legacy API compatibility
const api = {
  interceptors: {
    request: {
      use: (onFulfilled: any, onRejected: any) => ({ use: () => {} }),
    },
    response: {
      use: (onFulfilled: any, onRejected: any) => ({ use: () => {} }),
    },
  },
};

export default api;
