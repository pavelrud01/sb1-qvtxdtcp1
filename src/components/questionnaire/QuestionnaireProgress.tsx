import React from 'react';

interface QuestionnaireProgressProps {
  currentStep: number;
  totalSteps: number;
}

const QuestionnaireProgress: React.FC<QuestionnaireProgressProps> = ({
  currentStep,
  totalSteps,
}) => {
  const progress = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="w-full">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">
          Заполнено: {progress}%
        </span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#2D46B9] transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default QuestionnaireProgress;