
import React, { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { Card, CardContent, CardHeader } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { apiService, Session } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Modal } from '../components/common/Modal';
import { toast } from '@/hooks/use-toast';
import { Eye, Calendar, Code, Trophy } from 'lucide-react';

const History: React.FC = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      loadSessions();
    }
  }, [user]);

  const loadSessions = async () => {
    try {
      const response = await apiService.getUserSessions(user!.uid);
      setSessions(response.data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load session history",
      });
      // Mock data for demo
      setSessions([
        {
          id: '1',
          userId: user!.uid,
          questionId: '1',
          code: 'def two_sum(nums, target):\n    # Solution code here\n    return [0, 1]',
          language: 'python',
          score: 85,
          feedback: 'Great job! Your solution is correct and efficient.',
          timestamp: new Date('2024-01-15T10:30:00'),
          duration: 25
        },
        {
          id: '2',
          userId: user!.uid,
          questionId: '2',
          code: 'function binaryTreeTraversal(root) {\n    // Solution here\n}',
          language: 'javascript',
          score: 92,
          feedback: 'Excellent implementation with good edge case handling.',
          timestamp: new Date('2024-01-14T14:20:00'),
          duration: 35
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewFeedback = (session: Session) => {
    setSelectedSession(session);
    setFeedbackModalOpen(true);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
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
            Session History
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Review your past coding interviews and track your progress
          </p>
        </div>

        {sessions.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No sessions found. Start your first coding interview!
              </p>
              <Button onClick={() => window.location.href = '/dashboard'}>
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <Card key={session.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                        <Calendar size={16} />
                        <span className="text-sm">
                          {session.timestamp.toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                        <Code size={16} />
                        <span className="text-sm capitalize">{session.language}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                        <Trophy size={16} />
                        <span className={`text-sm font-semibold ${getScoreColor(session.score)}`}>
                          {session.score}/100
                        </span>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewFeedback(session)}
                    >
                      <Eye size={16} className="mr-2" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Modal
          isOpen={feedbackModalOpen}
          onClose={() => setFeedbackModalOpen(false)}
          title="Session Details"
          size="lg"
        >
          {selectedSession && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Date:</span>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">
                    {selectedSession.timestamp.toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Language:</span>
                  <span className="ml-2 text-gray-600 dark:text-gray-400 capitalize">
                    {selectedSession.language}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Duration:</span>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">
                    {selectedSession.duration} minutes
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Score:</span>
                  <span className={`ml-2 font-semibold ${getScoreColor(selectedSession.score)}`}>
                    {selectedSession.score}/100
                  </span>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Your Code:
                </h3>
                <pre className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-sm overflow-x-auto">
                  <code>{selectedSession.code}</code>
                </pre>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                  AI Feedback:
                </h3>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {selectedSession.feedback}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </Layout>
  );
};

export default History;
