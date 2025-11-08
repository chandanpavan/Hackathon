
import React from 'react';

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'md' }) => {
    const sizeClasses = {
        sm: 'h-6 w-6',
        md: 'h-12 w-12',
        lg: 'h-24 w-24',
    };
    return (
        <div className="flex justify-center items-center p-4">
            <div className={`animate-spin rounded-full ${sizeClasses[size]} border-t-4 border-b-4 border-primary`}></div>
        </div>
    );
};

export default Spinner;
