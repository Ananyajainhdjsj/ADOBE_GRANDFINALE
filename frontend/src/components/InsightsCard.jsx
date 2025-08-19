import React from 'react';
import { DEFAULT_INSIGHTS } from '../constants';

const InsightItemComponent = ({ insight }) => {
  const getTypeStyle = (type) => {
    switch (type) {
      case 'processing':
        return 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-500';
      case 'success':
        return 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-500';
      case 'warning':
        return 'bg-gradient-to-r from-red-50 to-pink-50 border-red-500';
      default:
        return 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-500';
    }
  };

  return (
    <div className={`insight-item ${getTypeStyle(insight.type)}`}>
      <div className="insight-title">{insight.title}</div>
      <div className="insight-description">{insight.description}</div>
    </div>
  );
};

const InsightsCard = ({ 
  insights = DEFAULT_INSIGHTS, 
  isVisible, 
  title = 'AI Insights',
  subtitle = 'Real-time analysis insights'
}) => {
  if (!isVisible) return null;

  return (
    <div className="insights-card">
      <div className="insights-card-header">
        <h3 className="insights-card-title">{title}</h3>
        <p className="insights-card-subtitle">{subtitle}</p>
      </div>
      <div className="insights-card-content">
        {insights.map((insight, index) => (
          <InsightItemComponent key={index} insight={insight} />
        ))}
      </div>
    </div>
  );
};

export default InsightsCard;
