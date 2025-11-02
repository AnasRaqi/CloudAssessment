import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, CheckCircle, Clock, ArrowRight, Archive, Plus } from 'lucide-react';
import Navbar from '../components/Navbar';
import ProgressBar from '../components/ProgressBar';
import StatusBadge from '../components/StatusBadge';
import TemplateSelector from '../components/TemplateSelector';
import { getQuestionnaire } from '../services/questionnaire';
import { submittedAssessmentsAPI } from '../services/api';
import { Assessment } from '../types';
import { QuestionnaireTemplate } from '../services/templates';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [completedSections, setCompletedSections] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<QuestionnaireTemplate | null>(null);

  useEffect(() => {
    loadData();
    
    // Load selected template from localStorage
    const savedTemplate = localStorage.getItem('selectedTemplate');
    if (savedTemplate) {
      try {
        setSelectedTemplate(JSON.parse(savedTemplate));
      } catch (error) {
        console.error('Failed to parse saved template:', error);
      }
    }
  }, []);

  const loadData = async () => {
    try {
      const data = await getQuestionnaire();
      setAssessment(data);
      
      // Calculate completed sections based on actual data (fields or uploads)
      const completed = Object.values(data.sections).filter((section) => {
        const hasFields = section.fields && Object.keys(section.fields).length > 0;
        const hasUploads = section.uploads && section.uploads.length > 0;
        return hasFields || hasUploads;
      }).length;
      setCompletedSections(completed);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNewAssessment = async () => {
    try {
      const response = await submittedAssessmentsAPI.createNewAssessment();
      if (response.success) {
        alert('New assessment created successfully! You can start filling the questionnaire again.');
        // Reload data to get the new assessment
        loadData();
      }
    } catch (error) {
      console.error('Failed to create new assessment:', error);
      alert('Failed to create new assessment. Please try again.');
    }
  };

  const handleTemplateSelect = (template: QuestionnaireTemplate) => {
    setSelectedTemplate(template);
    // Store selected template in localStorage for persistence
    localStorage.setItem('selectedTemplate', JSON.stringify(template));
  };

  const handleContinueQuestionnaire = () => {
    // Pass template information to questionnaire page
    const params = selectedTemplate ? `?template=${encodeURIComponent(JSON.stringify(selectedTemplate))}` : '';
    navigate(`/questionnaire${params}`);
  };

  const handleViewSubmitted = () => {
    navigate('/submitted');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#2F3134]">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-400">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#2F3134]">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Assessment Dashboard</h2>
          <p className="text-gray-400">Questionnaire Management and Assessment</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {/* Questionnaire Card */}
          <div className="bg-[#3B3F42] rounded-lg shadow-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <FileText className="text-[#50D8FF]" size={24} />
                <h3 className="text-lg font-semibold text-white">Questionnaire</h3>
              </div>
              <StatusBadge status={completedSections === 10 ? 'completed' : 'in-progress'} />
            </div>
            <div className="mb-4">
              <ProgressBar current={completedSections} total={10} />
            </div>
            <button
              onClick={handleContinueQuestionnaire}
              className="w-full bg-[#50D8FF] hover:bg-[#3AB8E6] text-white font-medium py-2 px-4 rounded-md flex items-center justify-center space-x-2 transition-colors"
            >
              <span>{completedSections === 10 ? 'Review' : 'Continue'} Questionnaire</span>
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Assessment Card */}
          <div className="bg-[#3B3F42] rounded-lg shadow-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="text-green-500" size={24} />
                <h3 className="text-lg font-semibold text-white">Assessment</h3>
              </div>
              <StatusBadge status={assessment?.assessment?.status || 'pending'} />
            </div>
            <p className="text-gray-400 mb-4">
              {assessment?.assessment?.status === 'completed'
                ? 'Assessment completed and available for review'
                : 'Waiting for assessment review'}
            </p>
            <button
              onClick={() => navigate('/assessment')}
              className="w-full bg-green-600 hover:bg-green-500 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center space-x-2 transition-colors"
            >
              <span>View Assessment</span>
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Timeline Card */}
          <div className="bg-[#3B3F42] rounded-lg shadow-lg p-6 border border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <Clock className="text-gray-400" size={24} />
              <h3 className="text-lg font-semibold text-white">Timeline</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-[#50D8FF] rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-white">Created</p>
                  <p className="text-xs text-gray-400">
                    {assessment?.timestamps?.created
                      ? new Date(assessment.timestamps.created).toLocaleDateString()
                      : 'N/A'}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-white">Last Updated</p>
                  <p className="text-xs text-gray-400">
                    {assessment?.timestamps?.updated
                      ? new Date(assessment.timestamps.updated).toLocaleDateString()
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Submitted Questionnaires Card */}
          <div className="bg-[#3B3F42] rounded-lg shadow-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Archive className="text-blue-500" size={24} />
                <h3 className="text-lg font-semibold text-white">Submitted</h3>
              </div>
              <StatusBadge status="completed" />
            </div>
            <p className="text-gray-400 mb-4">
              View and download previously submitted questionnaires
            </p>
            <button
              onClick={handleViewSubmitted}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center space-x-2 transition-colors"
            >
              <span>View Submitted</span>
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Create New Assessment Card */}
          <div className="bg-[#3B3F42] rounded-lg shadow-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Plus className="text-purple-500" size={24} />
                <h3 className="text-lg font-semibold text-white">New Assessment</h3>
              </div>
            </div>
            <p className="text-gray-400 mb-4">
              Create a fresh assessment to start over with a clean slate
            </p>
            <button
              onClick={handleCreateNewAssessment}
              className="w-full bg-purple-600 hover:bg-purple-500 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center space-x-2 transition-colors"
            >
              <span>Create New</span>
              <Plus size={18} />
            </button>
          </div>
        </div>

        {/* Template Selection */}
        <div className="mb-8">
          <TemplateSelector 
            onTemplateSelect={handleTemplateSelect}
            selectedTemplate={selectedTemplate}
          />
        </div>

        {/* Sections Overview */}
        <div className="bg-[#3B3F42] rounded-lg shadow-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Sections Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].map((section) => {
              const sectionData = assessment?.sections[section];
              const hasFields = sectionData?.fields && Object.keys(sectionData.fields).length > 0;
              const hasUploads = sectionData?.uploads && sectionData.uploads.length > 0;
              const hasData = hasFields || hasUploads;
              return (
                <div
                  key={section}
                  className={`p-4 rounded-lg border-2 ${
                    hasData
                      ? 'bg-green-900 bg-opacity-30 border-green-500'
                      : 'bg-[#2F3134] border-gray-600'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white mb-1">Section {section}</div>
                    <div className="text-xs text-gray-400">
                      {hasData ? 'Completed' : 'Pending'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <footer className="bg-[#2F3134] border-t border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-gray-400">
          Developed by Anas Raqi
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
