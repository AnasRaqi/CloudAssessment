import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download, Calendar, FileText, Users, Mail, Building, DollarSign, Server, Database, Shield, Zap, Target, Trash2 } from 'lucide-react';
import { submittedAssessmentsAPI } from '../services/api';
import { generateAssessmentPDF } from '../services/pdfExport';

interface Attachment {
  id: string;
  filename: string;
  fileSize: number;
  mimeType: string;
  storagePath: string;
  uploadedAt: string;
  downloadUrl?: string | null;
}

interface SubmittedAssessment {
  id: string;
  client_id: string;
  submitted_at: string;
  sections: any;
  assessment: any;
  attachments: Record<string, Attachment[]>;
  created_at: string;
  updated_at: string;
}

interface SubmittedQuestionnairesProps {
  onBack: () => void;
}

const sectionIcons: Record<string, any> = {
  A: Building,
  B: DollarSign,
  C: Server,
  D: Database,
  E: Server,
  F: Database,
  G: Shield,
  H: Zap,
  I: Target,
  J: Users
};

const sectionTitles: Record<string, string> = {
  A: 'Company Information',
  B: 'Billing & Cost Management',
  C: 'Compute Resources',
  D: 'Storage Solutions',
  E: 'Networking',
  F: 'Database Services',
  G: 'Security & Compliance',
  H: 'Future Plans',
  I: 'Business Alignment',
  J: 'Additional Information'
};

export default function SubmittedQuestionnaires({ onBack }: SubmittedQuestionnairesProps) {
  const [assessments, setAssessments] = useState<SubmittedAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSubmittedAssessments();
  }, []);

  const loadSubmittedAssessments = async () => {
    try {
      setLoading(true);
      const response = await submittedAssessmentsAPI.getSubmittedAssessments();
      console.log('API Response:', response);
      
      // Handle different response formats
      let assessmentsData = [];
      if (response.success) {
        assessmentsData = Array.isArray(response.data) ? response.data : (response.data?.data || []);
      } else {
        assessmentsData = response.data || [];
      }
      
      console.log('Processed assessments:', assessmentsData);
      setAssessments(assessmentsData);
    } catch (err) {
      setError('Failed to load submitted assessments');
      console.error('Error loading assessments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async (assessment: SubmittedAssessment) => {
    try {
      const data = {
        sections: assessment.sections,
        assessment: assessment.assessment,
        submittedAt: assessment.submitted_at
      };
      
      await generateAssessmentPDF(data);
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('Failed to generate PDF');
    }
  };

  const handleDeleteAssessment = async (assessment: SubmittedAssessment) => {
    if (!confirm(`Are you sure you want to delete assessment #${assessment.id.slice(-8)}? This action cannot be undone.`)) {
      return;
    }

    try {
      await submittedAssessmentsAPI.deleteAssessment(assessment.id);
      // Remove the deleted assessment from the list
      setAssessments(prev => prev.filter(a => a.id !== assessment.id));
      alert('Assessment deleted successfully');
    } catch (err) {
      console.error('Error deleting assessment:', err);
      alert('Failed to delete assessment');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSectionCompletion = (section: any) => {
    if (!section || typeof section !== 'object') return 0;
    const keys = Object.keys(section);
    if (keys.length === 0) return 0;
    
    let completed = 0;
    keys.forEach(key => {
      const value = section[key];
      if (value !== null && value !== undefined && value !== '' && 
          (typeof value !== 'object' || Object.keys(value).length > 0)) {
        completed++;
      }
    });
    
    return Math.round((completed / keys.length) * 100);
  };

  const handleDownloadAttachment = (attachment: Attachment) => {
    if (attachment.downloadUrl) {
      const link = document.createElement('a');
      link.href = attachment.downloadUrl;
      link.download = attachment.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#2F3134] flex items-center justify-center">
        <div className="text-white text-lg">Loading submitted questionnaires...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#2F3134]">
      {/* Header */}
      <div className="bg-[#2F3134] border-b border-gray-700 px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="text-[#50D8FF] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-white">Submitted Questionnaires</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {error && (
          <div className="bg-red-900 border border-red-700 rounded-lg p-4 mb-6 text-red-100">
            {error}
          </div>
        )}

        {assessments.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No submitted questionnaires</h3>
            <p className="text-gray-500">Submitted questionnaires will appear here after completion.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {assessments.map((assessment) => (
              <div key={assessment.id} className="bg-[#3B3F42] rounded-lg border border-gray-700 p-6">
                {/* Assessment Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Assessment #{assessment.id.slice(-8)}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Submitted: {formatDate(assessment.submitted_at)}
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        Client: {assessment.client_id}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDownloadPDF(assessment)}
                      className="bg-[#50D8FF] hover:bg-[#3AB8E6] text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download PDF
                    </button>
                    <button
                      onClick={() => handleDeleteAssessment(assessment)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>

                {/* Sections Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(assessment.sections || {}).map(([sectionKey, sectionData]) => {
                    const IconComponent = sectionIcons[sectionKey] || FileText;
                    const completion = getSectionCompletion(sectionData);
                    
                    return (
                      <div key={sectionKey} className="bg-[#2F3134] rounded-lg p-4 border border-gray-700">
                        <div className="flex items-center gap-3 mb-3">
                          <IconComponent className="w-5 h-5 text-[#50D8FF]" />
                          <div>
                            <div className="text-sm font-medium text-white">
                              Section {sectionKey}: {sectionTitles[sectionKey]}
                            </div>
                          </div>
                        </div>
                        <div className="mb-2">
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Completion</span>
                            <span>{completion}%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-[#50D8FF] h-2 rounded-full transition-all duration-300"
                              style={{ width: `${completion}%` }}
                            />
                          </div>
                        </div>
                        
                        {/* Attachments */}
                        {assessment.attachments && assessment.attachments[sectionKey] && assessment.attachments[sectionKey].length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-600">
                            <div className="text-xs font-medium text-[#50D8FF] mb-2">Attachments ({assessment.attachments[sectionKey].length})</div>
                            <div className="space-y-1">
                              {assessment.attachments[sectionKey].map((attachment) => (
                                <div key={attachment.id} className="flex items-center gap-2 text-xs">
                                  <FileText className="w-3 h-3 text-gray-400" />
                                  {attachment.downloadUrl ? (
                                    <button
                                      onClick={() => handleDownloadAttachment(attachment)}
                                      className="truncate flex-1 text-left text-blue-400 hover:text-blue-300 hover:underline cursor-pointer"
                                      title={`Download ${attachment.filename}`}
                                    >
                                      {attachment.filename}
                                    </button>
                                  ) : (
                                    <span className="truncate flex-1 text-gray-300">{attachment.filename}</span>
                                  )}
                                  <span className="text-gray-500">({(attachment.fileSize / 1024).toFixed(1)} KB)</span>
                                  {attachment.downloadUrl && (
                                    <Download className="w-3 h-3 text-[#50D8FF] cursor-pointer" onClick={() => handleDownloadAttachment(attachment)} />
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* All Attachments Overview */}
                {assessment.attachments && Object.keys(assessment.attachments).length > 0 && (
                  <div className="mt-6 bg-[#2F3134] rounded-lg p-4 border border-gray-700">
                    <h4 className="text-sm font-medium text-[#50D8FF] mb-4">All Attachments</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {Object.entries(assessment.attachments).map(([sectionKey, files]) => {
                        const IconComponent = sectionIcons[sectionKey] || FileText;
                        return (
                          <div key={sectionKey} className="bg-[#3B3F42] rounded-lg p-3 border border-gray-600">
                            <div className="flex items-center gap-2 mb-2">
                              <IconComponent className="w-4 h-4 text-[#50D8FF]" />
                              <div className="text-sm font-medium text-white">Section {sectionKey}</div>
                            </div>
                            <div className="space-y-1">
                              {files.map((file) => (
                                <div key={file.id} className="flex items-center gap-2 text-xs">
                                  <FileText className="w-3 h-3 text-gray-400" />
                                  {file.downloadUrl ? (
                                    <button
                                      onClick={() => handleDownloadAttachment(file)}
                                      className="truncate flex-1 text-left text-blue-400 hover:text-blue-300 hover:underline cursor-pointer"
                                      title={`Download ${file.filename}`}
                                    >
                                      {file.filename}
                                    </button>
                                  ) : (
                                    <span className="truncate flex-1 text-gray-300">{file.filename}</span>
                                  )}
                                  <span className="text-gray-500">({(file.fileSize / 1024).toFixed(1)} KB)</span>
                                  {file.downloadUrl && (
                                    <Download className="w-3 h-3 text-[#50D8FF] cursor-pointer" onClick={() => handleDownloadAttachment(file)} />
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Assessment Findings */}
                {assessment.assessment?.findings && (
                  <div className="mt-6 bg-[#2F3134] rounded-lg p-4 border border-gray-700">
                    <h4 className="text-sm font-medium text-[#50D8FF] mb-2">Assessment Findings</h4>
                    <p className="text-gray-300 text-sm whitespace-pre-wrap">
                      {assessment.assessment.findings}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
