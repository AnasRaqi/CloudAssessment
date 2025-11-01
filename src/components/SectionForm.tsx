import React, { useState, useEffect } from 'react';
import { Info } from 'lucide-react';
import { FieldDefinition } from '../types';
import FileUpload from './FileUpload';

interface SectionFormProps {
  fields: FieldDefinition[];
  initialValues: Record<string, any>;
  onSave: (values: Record<string, any>) => void;
  section: string;
  existingUploads?: any[];
}

const SectionForm: React.FC<SectionFormProps> = ({ fields, initialValues, onSave, section, existingUploads = [] }) => {
  const [formData, setFormData] = useState<Record<string, any>>(initialValues || {});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData(initialValues || {});
  }, [initialValues]);

  const handleChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleMultiSelectChange = (fieldName: string, option: string) => {
    const currentValue = formData[fieldName] || [];
    const newValue = currentValue.includes(option)
      ? currentValue.filter((v: string) => v !== option)
      : [...currentValue, option];
    handleChange(fieldName, newValue);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(formData);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = (fieldName: string, file: any) => {
    handleChange(fieldName, file.path);
  };

  const renderField = (field: FieldDefinition) => {
    const value = formData[field.name] || '';

    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:ring-2 focus:ring-alphacloud-secondary focus:border-transparent"
            required={field.required}
          />
        );

      case 'numeric':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:ring-2 focus:ring-alphacloud-secondary focus:border-transparent"
            required={field.required}
          />
        );

      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            rows={4}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:ring-2 focus:ring-alphacloud-secondary focus:border-transparent"
            required={field.required}
          />
        );

      case 'dropdown':
        return (
          <select
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:ring-2 focus:ring-alphacloud-secondary focus:border-transparent"
            required={field.required}
          >
            <option value="">Select an option</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'multi-select':
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <label key={option} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={(formData[field.name] || []).includes(option)}
                  onChange={() => handleMultiSelectChange(field.name, option)}
                  className="rounded border-gray-600 text-alphacloud-secondary focus:ring-alphacloud-secondary bg-gray-700"
                />
                <span className="text-sm text-gray-300">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'upload':
        const fieldUploads = existingUploads.filter((u) => u.fieldName === field.name);
        return (
          <FileUpload
            section={section}
            fieldName={field.name}
            onUploadComplete={(file) => handleFileUpload(field.name, file)}
            existingFiles={fieldUploads}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6" data-section-form={section}>
      {fields.map((field) => (
        <div key={field.name} className="space-y-2">
          <div className="flex items-start justify-between">
            <label className="block text-sm font-medium text-gray-300">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {field.hint && (
              <div className="group relative">
                <Info size={16} className="text-gray-400 cursor-help" />
                <div className="hidden group-hover:block absolute right-0 z-10 w-64 p-2 bg-gray-900 text-white text-xs rounded shadow-lg">
                  {field.hint}
                </div>
              </div>
            )}
          </div>
          {renderField(field)}
        </div>
      ))}

      <div className="flex justify-end space-x-4 pt-4 border-t border-gray-700">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-alphacloud-secondary hover:bg-alphacloud-accent text-alphacloud-primary font-medium py-2 px-6 rounded-md transition-colors disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save Section'}
        </button>
      </div>
    </div>
  );
};

export default SectionForm;
