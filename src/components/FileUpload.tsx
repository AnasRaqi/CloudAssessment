import React, { useState } from 'react';
import { Upload, X, File, CheckCircle } from 'lucide-react';
import { uploadFile } from '../services/questionnaire';

interface FileUploadProps {
  section: string;
  fieldName: string;
  onUploadComplete: (file: any) => void;
  existingFiles?: any[];
}

interface UploadedFileInfo {
  publicUrl: string;
  storagePath: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ section, fieldName, onUploadComplete, existingFiles = [] }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadedFile, setUploadedFile] = useState<UploadedFileInfo | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError('');
    setUploadedFile(null);

    try {
      console.log('Starting file upload for:', file.name, 'Section:', section);
      const response = await uploadFile(file, section, fieldName);
      console.log('Upload response:', response);
      
      // Check if the response has an error
      if (response.error) {
        throw new Error(`Edge function error: ${response.error.message || response.error.code}`);
      }
      
      // The uploadFile function should return the file info directly
      const fileInfo: UploadedFileInfo = {
        publicUrl: response.publicUrl || response.url || '',
        storagePath: response.storagePath || response.path || '',
        fileName: response.fileName || file.name,
        fileSize: response.fileSize || file.size,
        mimeType: response.mimeType || file.type
      };
      
      setUploadedFile(fileInfo);
      onUploadComplete(fileInfo);
    } catch (error: any) {
      console.error('Upload error details:', error);
      
      let errorMessage = 'Upload failed';
      
      if (error.response) {
        // Server responded with error status
        console.error('Server error response:', error.response.data);
        errorMessage = error.response.data?.error?.message || 
                      error.response.data?.message || 
                      error.response.statusText || 
                      'Server error';
      } else if (error.request) {
        // Request was made but no response received
        console.error('Network error:', error.request);
        errorMessage = 'Network error: Unable to reach server';
      } else {
        // Something else happened
        console.error('Other error:', error.message);
        errorMessage = error.message || 'Upload failed';
      }
      
      setUploadError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block">
        <div className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-600 rounded-lg hover:border-alphacloud-secondary cursor-pointer transition-colors bg-gray-700">
          <div className="text-center">
            <Upload className="mx-auto text-gray-400 mb-2" size={24} />
            <p className="text-sm text-gray-300">
              {isUploading ? 'Uploading...' : 'Click to upload file'}
            </p>
            <p className="text-xs text-gray-400 mt-1">PDF, Excel, CSV, Images (max 10MB)</p>
          </div>
          <input
            type="file"
            className="hidden"
            onChange={handleFileSelect}
            disabled={isUploading}
            accept=".pdf,.csv,.xls,.xlsx,.jpg,.jpeg,.png"
          />
        </div>
      </label>

      {uploadError && (
        <div className="text-sm text-red-400">{uploadError}</div>
      )}

      {existingFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-300">Uploaded files:</p>
          {existingFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-700 p-2 rounded">
              <div className="flex items-center space-x-2">
                <File size={16} className="text-alphacloud-secondary" />
                <span className="text-sm text-gray-300">{file.originalname}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Show newly uploaded file */}
      {uploadedFile && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-green-400 flex items-center gap-1">
            <CheckCircle size={16} />
            File uploaded successfully:
          </p>
          <div className="flex items-center justify-between bg-green-900/30 border border-green-700 p-2 rounded">
            <div className="flex items-center space-x-2">
              <File size={16} className="text-green-400" />
              <span className="text-sm text-green-300">{uploadedFile.fileName}</span>
              <span className="text-xs text-gray-400">({(uploadedFile.fileSize / 1024).toFixed(1)} KB)</span>
            </div>
            {uploadedFile.publicUrl && (
              <a 
                href={uploadedFile.publicUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-blue-400 hover:text-blue-300 underline"
              >
                View
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
