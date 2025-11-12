import React from 'react';
import { Toaster } from 'react-hot-toast';

const ToastProvider: React.FC = () => {
  return <Toaster position="top-center" />;
};

export default ToastProvider;