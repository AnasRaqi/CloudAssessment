import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Upload, Download } from 'lucide-react';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import FileUpload from '../components/FileUpload';
import { getAssessment, saveAssessment, sendEmail, getQuestionnaire } from '../services/questionnaire';
import { generateAssessmentPDF } from '../services/pdfExport';

const AssessmentPage: React.FC = () => {
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [findings, setFindings] = useState('');
  const [status, setStatus] = useState<'pending' | 'in-progress' | 'completed'>('pending');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await getAssessment();
      setAssessment(data);
      setFindings(data.findings || '');
      setStatus(data.status || 'pending');
    } catch (error) {
      console.error('Failed to load assessment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveAssessment({ status, findings });
      alert('Assessment saved successfully');
      
      // Send email notifications
      if (status === 'completed') {
        await sendEmail('assessment_completed');
      } else {
        await sendEmail('assessment_uploaded');
      }
      
      loadData();
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save assessment');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = (file: any) => {
    loadData();
  };

  const handleExportPDF = async () => {
    try {
      // Get complete assessment data including questionnaire
      const fullAssessment = await getQuestionnaire();
      
      // Generate and download PDF
      await generateAssessmentPDF({
        sections: fullAssessment.sections,
        assessment: fullAssessment.assessment,
        submittedAt: fullAssessment.assessment.assessmentDate 
          ? new Date(fullAssessment.assessment.assessmentDate).toISOString()
          : new Date().toISOString()
      });
      
      // Show success message
      setTimeout(() => {
        alert('PDF downloaded successfully!');
      }, 500);
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('Failed to export PDF. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-alphacloud-primary">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-alphacloud-textSecondary">Loading assessment...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-alphacloud-primary">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 text-alphacloud-secondary hover:text-alphacloud-accent mb-4"
          >
            <Home size={20} />
            <span>Back to Dashboard</span>
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Assessment Report</h2>
              <p className="text-alphacloud-textSecondary">Questionnaire Assessment Results</p>
            </div>
            <StatusBadge status={status} />
          </div>
        </div>

        {/* Assessment Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-lg shadow-md p-6 mb-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Assessment Status</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Current Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:ring-2 focus:ring-alphacloud-secondary focus:border-transparent"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {assessment?.assessmentDate && (
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Assessment Date
                </label>
                <p className="text-white mt-1">
                  {new Date(assessment.assessmentDate).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Findings Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800 rounded-lg shadow-md p-6 mb-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Findings Summary</h3>
          <textarea
            value={findings}
            onChange={(e) => setFindings(e.target.value)}
            rows={8}
            placeholder="Enter assessment findings and recommendations..."
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-md focus:ring-2 focus:ring-alphacloud-secondary focus:border-transparent"
          />
        </motion.div>

        {/* Report Upload */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800 rounded-lg shadow-md p-6 mb-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Assessment Report Upload</h3>
          <p className="text-sm text-alphacloud-textSecondary mb-4">
            Upload the complete assessment report (PDF or Excel format)
          </p>
          <FileUpload
            section="assessment"
            fieldName="assessment_report"
            onUploadComplete={handleFileUpload}
            existingFiles={assessment?.attachments || []}
          />
        </motion.div>

        {/* Attached Reports */}
        {assessment?.attachments && assessment.attachments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800 rounded-lg shadow-md p-6 mb-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Uploaded Reports</h3>
            <div className="space-y-2">
              {assessment.attachments.map((file: any, index: number) => (
                <div key={index} className="flex items-center justify-between bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Upload size={20} className="text-alphacloud-secondary" />
                    <div>
                      <p className="text-sm font-medium text-white">{file.originalname}</p>
                      <p className="text-xs text-alphacloud-textSecondary">
                        Uploaded: {new Date(file.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <a
                    href={`http://localhost:5000${file.path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-alphacloud-secondary hover:text-alphacloud-accent text-sm font-medium"
                  >
                    Download
                  </a>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <div className="flex justify-between items-center">
          <button
            onClick={handleExportPDF}
            className="flex items-center space-x-2 px-6 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700 transition-colors"
          >
            <Download size={20} />
            <span>Export Combined PDF</span>
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center space-x-2 px-6 py-2 bg-alphacloud-secondary hover:bg-alphacloud-accent text-alphacloud-primary rounded-md font-medium transition-colors disabled:opacity-50"
          >
            <span>{isSaving ? 'Saving...' : 'Save Assessment'}</span>
          </button>
        </div>
      </div>

      <footer className="bg-gray-800 border-t border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-alphacloud-textSecondary">
          Developed by Anas Raqi
        </div>
      </footer>
    </div>
  );
};

export default AssessmentPage;
