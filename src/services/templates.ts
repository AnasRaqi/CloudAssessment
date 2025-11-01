import { supabase } from '../lib/supabase';

const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhc2F5a2x4dWl0eWN3ZXN1em1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzOTg0MjUsImV4cCI6MjA3NTk3NDQyNX0.MpQkAN28Re4EYTr_1rnxwt86z81rvzS1rVYiKpHGKfw';

export interface QuestionnaireTemplate {
  id: string;
  title: string;
  description: string;
  sections: any;
  created_by: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  client_id?: string;
}

export const templateAPI = {
  async getTemplates(): Promise<QuestionnaireTemplate[]> {
    const { data, error } = await supabase.functions.invoke('template-manager', {
      body: { action: 'list' },
      headers: {
        Authorization: `Bearer ${ANON_KEY}`,
      },
    });

    if (error) {
      throw error;
    }

    return data.data;
  },

  async getTemplate(id: string): Promise<QuestionnaireTemplate> {
    const { data, error } = await supabase.functions.invoke('template-manager', {
      body: { action: 'get', id },
      headers: {
        Authorization: `Bearer ${ANON_KEY}`,
      },
    });

    if (error) {
      throw error;
    }

    return data.data;
  },

  async uploadTemplate(templateData: any, title: string, description: string): Promise<QuestionnaireTemplate> {
    const { data, error } = await supabase.functions.invoke('template-manager', {
      body: { 
        action: 'upload', 
        template_data: templateData, 
        title, 
        description 
      },
      headers: {
        Authorization: `Bearer ${ANON_KEY}`,
      },
    });

    if (error) {
      throw error;
    }

    return data.data;
  },

  async parsePDF(pdfContent: string): Promise<any> {
    const { data, error } = await supabase.functions.invoke('pdf-parser', {
      body: { pdf_content: pdfContent },
      headers: {
        Authorization: `Bearer ${ANON_KEY}`,
      },
    });

    if (error) {
      throw error;
    }

    return data.data;
  },

  async deleteTemplate(id: string): Promise<void> {
    const { data, error } = await supabase.functions.invoke('template-manager', {
      body: { action: 'delete', id },
      headers: {
        Authorization: `Bearer ${ANON_KEY}`,
      },
    });

    if (error) {
      throw error;
    }
  },
};

// Default template selection service
export const templateService = {
  async getAvailableTemplates(): Promise<QuestionnaireTemplate[]> {
    return await templateAPI.getTemplates();
  },

  async createTemplateFromPDF(pdfFile: File): Promise<QuestionnaireTemplate> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          // In a real implementation, you'd convert PDF to text
          // For now, we'll use the PDF content directly as text
          const pdfText = reader.result as string;
          const parsedTemplate = await templateAPI.parsePDF(pdfText);
          resolve(parsedTemplate);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsText(pdfFile);
    });
  },

  async saveCustomTemplate(templateData: any, title: string, description: string): Promise<QuestionnaireTemplate> {
    return await templateAPI.uploadTemplate(templateData, title, description);
  },
};
