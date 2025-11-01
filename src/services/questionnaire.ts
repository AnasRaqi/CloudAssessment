import { questionnaireAPI, uploadAPI, assessmentAPI, emailAPI } from './api';
import { Assessment } from '../types';

export const getQuestionnaire = async (): Promise<Assessment> => {
  const response = await questionnaireAPI.getQuestionnaire();
  return response.data;
};

export const saveQuestionnaire = async (section: string, fields: Record<string, any>): Promise<Assessment> => {
  const response = await questionnaireAPI.saveQuestionnaire({ [section]: { fields } });
  return response.data;
};

export const uploadFile = async (file: File, section: string, fieldName?: string): Promise<any> => {
  // Convert file to base64
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64Data = reader.result as string;
        console.log('Uploading file:', file.name, 'to section:', section);
        const response = await uploadAPI.uploadFile(base64Data, file.name, section);
        console.log('Upload API response:', response);
        resolve(response);
      } catch (err) {
        console.error('Upload API error:', err);
        reject(err);
      }
    };
    reader.onerror = (error) => {
      console.error('FileReader error:', error);
      reject(error);
    };
    reader.readAsDataURL(file);
  });
};

export const getAssessment = async (): Promise<any> => {
  const response = await assessmentAPI.getAssessment();
  return response.data;
};

export const saveAssessment = async (data: { status?: string; findings?: string }): Promise<any> => {
  const response = await assessmentAPI.updateAssessment(data);
  return response.data;
};

export const sendEmail = async (type: string, data?: any): Promise<void> => {
  await emailAPI.sendNotification(type, data);
};
