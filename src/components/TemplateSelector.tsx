import React, { useState, useEffect } from 'react';
import { ChevronDown, Download, Upload, FileText, Plus, X } from 'lucide-react';
import { templateService, QuestionnaireTemplate } from '../services/templates';
import FileUpload from './FileUpload';

interface TemplateSelectorProps {
  onTemplateSelect: (template: QuestionnaireTemplate) => void;
  selectedTemplate?: QuestionnaireTemplate;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onTemplateSelect, selectedTemplate }) => {
  const [templates, setTemplates] = useState<QuestionnaireTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [templateTitle, setTemplateTitle] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [templateFile, setTemplateFile] = useState<File | null>(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const templateData = await templateService.getAvailableTemplates();
      setTemplates(templateData);
    } catch (error) {
      console.error('Failed to load templates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTemplateSelect = (template: QuestionnaireTemplate) => {
    onTemplateSelect(template);
  };

  const handleFileUpload = (file: File) => {
    setTemplateFile(file);
  };

  const handleUploadTemplate = async () => {
    if (!templateFile || !templateTitle.trim()) {
      setUploadError('Please provide a template title and file');
      return;
    }

    setUploading(true);
    setUploadError('');

    try {
      // Parse the PDF file
      const templateData = await templateService.createTemplateFromPDF(templateFile);
      
      // Save the template
      const savedTemplate = await templateService.saveCustomTemplate(
        templateData,
        templateTitle.trim(),
        templateDescription.trim()
      );

      // Add to templates list
      setTemplates(prev => [savedTemplate, ...prev]);
      
      // Close modal and reset form
      setShowUploadModal(false);
      setTemplateTitle('');
      setTemplateDescription('');
      setTemplateFile(null);
      
      alert('Template uploaded successfully!');
    } catch (error: any) {
      console.error('Upload failed:', error);
      setUploadError(error.message || 'Failed to upload template');
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    // Create a link to download the template file
    const link = document.createElement('a');
    link.href = '/AlphaCloud_Questionnaire_Template.pdf';
    link.download = 'AlphaCloud_Questionnaire_Template.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="bg-[#3B3F42] rounded-lg p-6 border border-gray-700">
        <div className="text-center text-gray-400">Loading templates...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Template Selection */}
      <div className="bg-[#3B3F42] rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Questionnaire Template</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={downloadTemplate}
              className="flex items-center space-x-2 px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-md transition-colors"
            >
              <Download size={14} />
              <span>Download Template</span>
            </button>
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center space-x-2 px-3 py-1 bg-green-600 hover:bg-green-500 text-white text-sm rounded-md transition-colors"
            >
              <Plus size={14} />
              <span>Upload Template</span>
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {templates.map((template) => (
            <div
              key={template.id}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                selectedTemplate?.id === template.id
                  ? 'border-[#50D8FF] bg-[#50D8FF] bg-opacity-10'
                  : 'border-gray-600 bg-[#2F3134] hover:border-gray-500'
              }`}
              onClick={() => handleTemplateSelect(template)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-white">{template.title}</h4>
                  <p className="text-sm text-gray-400 mt-1">{template.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {template.sections.sections?.length || 0} sections • 
                    Created {new Date(template.created_at).toLocaleDateString()}
                  </p>
                </div>
                <ChevronDown size={16} className="text-gray-400" />
              </div>
            </div>
          ))}
        </div>

        {templates.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            <FileText size={48} className="mx-auto mb-4 opacity-50" />
            <p>No templates available</p>
            <p className="text-sm">Upload a template to get started</p>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#3B3F42] rounded-lg p-6 w-full max-w-md border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Upload Template</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Template Title *
                </label>
                <input
                  type="text"
                  value={templateTitle}
                  onChange={(e) => setTemplateTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#2F3134] border border-gray-600 text-white rounded-md focus:ring-2 focus:ring-[#50D8FF] focus:border-transparent"
                  placeholder="e.g., Azure Cloud Assessment"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={templateDescription}
                  onChange={(e) => setTemplateDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-[#2F3134] border border-gray-600 text-white rounded-md focus:ring-2 focus:ring-[#50D8FF] focus:border-transparent"
                  placeholder="Brief description of the questionnaire purpose"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Template File *
                </label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-4">
                  <div className="text-center">
                    <Upload className="mx-auto text-gray-400 mb-2" size={24} />
                    <p className="text-sm text-gray-300 mb-2">
                      {templateFile ? templateFile.name : 'Click to upload template file'}
                    </p>
                    <input
                      type="file"
                      accept=".pdf,.txt,.md"
                      onChange={(e) => setTemplateFile(e.target.files?.[0] || null)}
                      className="hidden"
                      id="template-upload"
                    />
                    <label
                      htmlFor="template-upload"
                      className="cursor-pointer text-[#50D8FF] hover:text-[#3AB8E6] text-sm"
                    >
                      Choose File
                    </label>
                  </div>
                </div>
              </div>

              {uploadError && (
                <div className="text-red-400 text-sm">{uploadError}</div>
              )}

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUploadTemplate}
                  disabled={uploading || !templateFile || !templateTitle.trim()}
                  className="flex-1 px-4 py-2 bg-[#50D8FF] hover:bg-[#3AB8E6] text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? 'Uploading...' : 'Upload Template'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateSelector;
