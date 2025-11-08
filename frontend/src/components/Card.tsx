import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  blockchainSecured?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', blockchainSecured = false }) => {
  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${
      blockchainSecured ? 'border-l-4 border-l-green-500' : ''
    } ${className}`}>
      {children}
    </div>
  );
};

export default Card;