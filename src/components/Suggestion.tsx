import React, { useState } from 'react';

interface SuggestionProps {
  onClose: () => void;
}

type SuggestionType = 'fix' | 'feature' | 'invalid' | 'other';

interface SuggestionLog {
  type: SuggestionType;
  details: string;
  timestamp: string;
}

export default function Suggestion({ onClose }: SuggestionProps) {
  const [suggestionType, setSuggestionType] = useState<SuggestionType>('fix');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    // Validate form
    if (!details.trim()) {
      setError('Please provide details for your suggestion');
      setIsSubmitting(false);
      return;
    }

    // Create a log entry
    const suggestionLog: SuggestionLog = {
      type: suggestionType,
      details: details.trim(),
      timestamp: new Date().toISOString()
    };
    
    // In a real application, you would save this to a log file or database
    // For now, we'll just log it to the console
    console.log('SUGGESTION_LOG:', JSON.stringify(suggestionLog));
    
    // Store in localStorage for persistence
    try {
      const existingLogs = JSON.parse(localStorage.getItem('suggestionLogs') || '[]');
      const updatedLogs = [...existingLogs, suggestionLog];
      localStorage.setItem('suggestionLogs', JSON.stringify(updatedLogs));
      
      // Log to console for debugging
      console.log('Suggestion logs updated:', updatedLogs);
      console.log('Current localStorage:', localStorage.getItem('suggestionLogs'));
    } catch (err) {
      console.error('Failed to store suggestion log:', err);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Suggest Improvements</h2>
          
          {isSubmitted ? (
            <div className="text-center py-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <h3 className="text-xl font-medium text-gray-800 mb-2">Thank You!</h3>
              <p className="text-gray-600 mb-4">Your suggestion has been logged successfully.</p>
              <button 
                onClick={onClose}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Suggestion Type*
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    className={`py-2 px-3 rounded-md text-sm font-medium ${
                      suggestionType === 'fix' 
                        ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                        : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                    }`}
                    onClick={() => setSuggestionType('fix')}
                  >
                    Fix Issue
                  </button>
                  <button
                    type="button"
                    className={`py-2 px-3 rounded-md text-sm font-medium ${
                      suggestionType === 'feature' 
                        ? 'bg-green-100 text-green-800 border border-green-300' 
                        : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                    }`}
                    onClick={() => setSuggestionType('feature')}
                  >
                    Add Feature
                  </button>
                  <button
                    type="button"
                    className={`py-2 px-3 rounded-md text-sm font-medium ${
                      suggestionType === 'invalid' 
                        ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' 
                        : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                    }`}
                    onClick={() => setSuggestionType('invalid')}
                  >
                    Invalid Requirement
                  </button>
                  <button
                    type="button"
                    className={`py-2 px-3 rounded-md text-sm font-medium ${
                      suggestionType === 'other' 
                        ? 'bg-purple-100 text-purple-800 border border-purple-300' 
                        : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                    }`}
                    onClick={() => setSuggestionType('other')}
                  >
                    Other
                  </button>
                </div>
              </div>
              
              <div>
                <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-1">
                  Details*
                </label>
                <textarea
                  id="details"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Briefly describe your suggestion..."
                  required
                />
              </div>
              
              {error && (
                <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="mr-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Suggestion'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
