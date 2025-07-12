
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { SessionCard } from '../components/dashboard/SessionCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { apiService, Question } from '../services/api';
import { toast } from '@/hooks/use-toast';

const Dashboard: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const response = await apiService.getQuestions();
      setQuestions(response.data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load questions",
      });
      // Mock data for demo
      setQuestions([
        {
          id: '1',
          title: 'Two Sum Problem',
          description: 'Find two numbers that add up to target',
          difficulty: 'easy',
          language: ['python', 'javascript', 'cpp'],
          testCases: []
        },
        {
          id: '2',
          title: 'Binary Tree Traversal',
          description: 'Implement various tree traversal methods',
          difficulty: 'medium',
          language: ['python', 'javascript', 'cpp'],
          testCases: []
        },
        {
          id: '3',
          title: 'Dynamic Programming Challenge',
          description: 'Solve complex optimization problem',
          difficulty: 'hard',
          language: ['python', 'javascript', 'cpp'],
          testCases: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleStartInterview = (questionId: string) => {
    navigate(`/interview/${questionId}`);
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

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Available Coding Sessions
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Choose a coding challenge to start your AI-powered interview
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {questions.map((question) => (
            <SessionCard
              key={question.id}
              title={question.title}
              difficulty={question.difficulty}
              duration={45}
              languages={question.language}
              onStart={() => handleStartInterview(question.id)}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
