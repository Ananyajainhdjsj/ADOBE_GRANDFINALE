import React from 'react';

export function Card({ children, className = "" }) {
  return (
    <div className={`bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = "" }) {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = "" }) {
  return (
    <h3 className={`text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2 ${className}`}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = "" }) {
  return (
    <p className={`text-gray-600 dark:text-gray-300 leading-relaxed ${className}`}>
      {children}
    </p>
  );
}
