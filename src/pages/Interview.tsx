
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { CodeEditor } from '../components/interview/CodeEditor';
import { Timer } from '../components/interview/Timer';
import { Button } from '../components/common/Button';
import { Card, CardContent, CardHeader } from '../components/common/Card';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { apiService, Question } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Play, Send } from 'lucide-react';

const Interview: React.FC = () => {
  const { questionId } = useParams<{ questionId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [question, setQuestion] = useState<Question | null>(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ score: number; feedback: string } | null>(null);
  const [timerStarted, setTimerStarted] = useState(false);

  useEffect(() => {
    if (questionId) {
      loadQuestion();
    }
  }, [questionId]);

  const loadQuestion = async () => {
    try {
      const response = await apiService.getQuestion(questionId!);
      setQuestion(response.data);
      setLanguage(response.data.language[0]);
      setCode(getStarterCode(response.data.language[0]));
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load question",
      });
      // Mock data for demo
      setQuestion({
        id: questionId!,
        title: 'Two Sum Problem',
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
        difficulty: 'easy',
        language: ['python', 'javascript', 'cpp'],
        testCases: [
          { input: '[2,7,11,15], 9', expectedOutput: '[0,1]' },
          { input: '[3,2,4], 6', expectedOutput: '[1,2]' }
        ]
      });
      setCode(getStarterCode('python'));
    } finally {
      setLoading(false);
    }
  };

  const getStarterCode = (lang: string) => {
    const starters = {
      python: `def two_sum(nums, target):
    # Your code here
    pass`,
      javascript: `function twoSum(nums, target) {
    // Your code here
}`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Your code here
    }
};`
    };
    return starters[lang as keyof typeof starters] || '';
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    setCode(getStarterCode(newLanguage));
  };

  const handleStartTimer = () => {
    setTimerStarted(true);
  };

  const handleTimeUp = () => {
    toast({
      title: "Time's up!",
      description: "Your interview session has ended.",
    });
    handleSubmit();
  };

  const handleSubmit = async () => {
    if (!question || !user) return;
    
    setSubmitting(true);
    try {
      const response = await apiService.submitCode(question.id, code, language);
      setFeedback(response.data);
      toast({
        title: "Code submitted!",
        description: "Your solution has been evaluated.",
      });
    } catch (error) {
      // Mock feedback for demo
      const mockFeedback = {
        score: Math.floor(Math.random() * 40) + 60, // 60-100
        feedback: `Great job! Your solution demonstrates good understanding of the problem. Here's what went well:

• Correct algorithm implementation
• Good variable naming
• Proper edge case handling

Areas for improvement:
• Consider optimizing time complexity
• Add more comments for clarity
• Handle additional edge cases`
      };
      setFeedback(mockFeedback);
      toast({
        title: "Code submitted!",
        description: "Your solution has been evaluated.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  if (!question) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">Question not found</p>
          <Button onClick={() => navigate('/dashboard')} className="mt-4">
            Back to Dashboard
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {question.title}
            </h1>
            <div className="flex items-center space-x-4 mt-2">
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                question.difficulty === 'easy' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}>
                {question.difficulty}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {!timerStarted ? (
              <Button onClick={handleStartTimer}>
                <Play size={16} className="mr-2" />
                Start Timer
              </Button>
            ) : (
              <Timer duration={45} onTimeUp={handleTimeUp} />
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Question Panel */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Problem Description
              </h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">
                  {question.description}
                </p>
                
                {question.testCases.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Test Cases:
                    </h3>
                    <div className="space-y-2">
                      {question.testCases.map((testCase, index) => (
                        <div key={index} className="bg-gray-50 dark:bg-gray-700 p-3 rounded text-sm">
                          <div><strong>Input:</strong> {testCase.input}</div>
                          <div><strong>Output:</strong> {testCase.expectedOutput}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Code Editor Panel */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Code Editor
                </h2>
                <select
                  value={language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  {question.language.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </CardHeader>
            <CardContent>
              <CodeEditor
                value={code}
                onChange={setCode}
                language={language}
                height="400px"
              />
              <div className="mt-4 flex justify-end">
                <Button
                  onClick={handleSubmit}
                  loading={submitting}
                  disabled={!timerStarted}
                >
                  <Send size={16} className="mr-2" />
                  Submit Solution
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feedback Panel */}
        {feedback && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  AI Feedback
                </h2>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {feedback.score}/100
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert max-w-none">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
                  {feedback.feedback}
                </pre>
              </div>
              <div className="mt-6 flex space-x-4">
                <Button onClick={() => navigate('/dashboard')}>
                  Back to Dashboard
                </Button>
                <Button variant="secondary" onClick={() => navigate('/history')}>
                  View History
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Interview;
