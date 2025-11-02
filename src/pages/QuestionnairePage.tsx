import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Home, Send } from 'lucide-react';
import Navbar from '../components/Navbar';
import SectionForm from '../components/SectionForm';
import { getQuestionnaire, saveQuestionnaire, sendEmail } from '../services/questionnaire';
import { questionnaireAPI } from '../services/api';
import { questionnaireSections } from '../utils/formFields';
import { Assessment } from '../types';
import { QuestionnaireTemplate } from '../services/templates';

const QuestionnairePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<QuestionnaireTemplate | null>(null);

  // Get current sections - use template if available, otherwise use default
  const currentSections = selectedTemplate?.sections || questionnaireSections;

  useEffect(() => {
    // Load template from URL parameters
    const templateParam = searchParams.get('template');
    if (templateParam) {
      try {
        const template = JSON.parse(decodeURIComponent(templateParam));
        setSelectedTemplate(template);
      } catch (error) {
        console.error('Failed to parse template from URL:', error);
      }
    }
    
    loadData();
  }, [searchParams]);

  const loadData = async () => {
    try {
      const data = await getQuestionnaire();
      setAssessment(data);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const currentSection = currentSections[currentStep];

  const handleSave = async (values: Record<string, any>) => {
    setIsSaving(true);
    try {
      const updated = await saveQuestionnaire(currentSection.id, values);
      setAssessment(updated);
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save data. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleNext = () => {
    if (currentStep < currentSections.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    if (window.confirm('Submit questionnaire? Your assessment will be processed for review.')) {
      try {
        // Send email notification first
        await sendEmail('questionnaire_submitted');
        
        // Mark assessment as submitted in database
        // Save current data with submit=true
        if (assessment?.sections) {
          await questionnaireAPI.saveQuestionnaire(assessment.sections, true);
        }
        
        alert('Questionnaire submitted successfully!');
        navigate('/dashboard');
      } catch (error) {
        console.error('Submission failed:', error);
        alert('Failed to submit questionnaire.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-alphacloud-primary">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-alphacloud-textSecondary">Loading questionnaire...</div>
        </div>
      </div>
    );
  }

  const sectionData = assessment?.sections[currentSection.id] || { fields: {}, uploads: [] };

  // Calculate completed sections based on actual data (fields or uploads)
  const hasData = (sectionId: string) => {
    const section = assessment?.sections[sectionId];
    if (!section) return false;
    const hasFields = section.fields && Object.keys(section.fields).length > 0;
    const hasUploads = section.uploads && section.uploads.length > 0;
    return hasFields || hasUploads;
  };

  const completedSections = currentSections.filter(section => hasData(section.id)).length;
  const progressPercentage = Math.round((completedSections / currentSections.length) * 100);

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
          <h2 className="text-3xl font-bold text-white mb-2">
            {selectedTemplate?.title || 'GCP Assessment Questionnaire'}
          </h2>
          <p className="text-alphacloud-textSecondary">
            {selectedTemplate?.description || 'Complete all sections to submit your assessment'}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-300">
              Section {currentStep + 1} of {currentSections.length}
            </span>
            <span className="text-sm font-medium text-alphacloud-secondary">
              {progressPercentage}% Complete ({completedSections} of {currentSections.length} sections)
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-alphacloud-secondary h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            {currentSections.map((section, index) => (
              <button
                key={section.id}
                onClick={() => setCurrentStep(index)}
                className={`w-8 h-8 rounded-full text-xs font-medium transition-colors ${
                  index === currentStep
                    ? 'bg-alphacloud-secondary text-alphacloud-primary'
                    : hasData(section.id)
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-600 text-gray-300'
                }`}
              >
                {section.id}
              </button>
            ))}
          </div>
        </div>

        {/* Section Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSection.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-800 rounded-lg shadow-md p-6 md:p-8"
          >
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">
                Section {currentSection.id}: {currentSection.title}
              </h3>
              {currentSection.description && (
                <p className="text-alphacloud-textSecondary">{currentSection.description}</p>
              )}
            </div>

            <SectionForm
              fields={currentSection.fields}
              initialValues={sectionData.fields}
              onSave={handleSave}
              section={currentSection.id}
              existingUploads={sectionData.uploads}
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center space-x-2 px-6 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={20} />
            <span>Previous</span>
          </button>

          {currentStep === currentSections.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="flex items-center space-x-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition-colors"
            >
              <Send size={20} />
              <span>Submit Questionnaire</span>
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center space-x-2 px-6 py-2 bg-alphacloud-secondary hover:bg-alphacloud-accent text-alphacloud-primary rounded-md font-medium transition-colors"
            >
              <span>Next</span>
              <ChevronRight size={20} />
            </button>
          )}
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

export default QuestionnairePage;
