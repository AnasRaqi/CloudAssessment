export interface Assessment {
  _id?: string;
  client_id: string;
  sections: {
    [key: string]: Section;
  };
  assessment: AssessmentData;
  timestamps: {
    created: Date;
    updated: Date;
  };
}

export interface Section {
  fields: Record<string, any>;
  uploads: FileUpload[];
}

export interface FileUpload {
  filename: string;
  originalname: string;
  path: string;
  uploadedAt: Date;
}

export interface AssessmentData {
  status: 'pending' | 'in-progress' | 'completed';
  findings: string;
  attachments: FileUpload[];
  assessmentDate: Date;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  message: string;
}

export interface FieldDefinition {
  name: string;
  label: string;
  type: 'text' | 'numeric' | 'dropdown' | 'multi-select' | 'textarea' | 'upload';
  hint?: string;
  options?: string[];
  required?: boolean;
}

export interface SectionDefinition {
  id: string;
  title: string;
  description?: string;
  fields: FieldDefinition[];
}
