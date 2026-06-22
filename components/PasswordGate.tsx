
import React from 'react';

interface PasswordGateProps {
  children: React.ReactNode;
  lang: 'uz' | 'en';
}

const PasswordGate: React.FC<PasswordGateProps> = ({ children }) => {
  return <>{children}</>;
};

export default PasswordGate;
