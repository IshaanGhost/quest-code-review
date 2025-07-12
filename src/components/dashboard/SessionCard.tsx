
import React from 'react';
import { Card, CardContent, CardHeader } from '../common/Card';
import { Button } from '../common/Button';
import { Clock, Code, Trophy } from 'lucide-react';

interface SessionCardProps {
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number;
  languages: string[];
  onStart: () => void;
}

export const SessionCard: React.FC<SessionCardProps> = ({
  title,
  difficulty,
  duration,
  languages,
  onStart
}) => {
  const difficultyColors = {
    easy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    hard: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  };

  return (
    <Card hover className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[difficulty]}`}>
            {difficulty}
          </span>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <Clock size={16} />
              <span>{duration} min</span>
            </div>
            <div className="flex items-center space-x-1">
              <Code size={16} />
              <span>{languages.join(', ')}</span>
            </div>
          </div>
          
          <Button onClick={onStart} className="w-full">
            Start Interview
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
