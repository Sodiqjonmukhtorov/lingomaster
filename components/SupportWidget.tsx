
import React from 'react';

const SupportWidget: React.FC = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-4 animate-bounceIn">
      {/* Support Person Link */}
      <a 
        href="https://t.me/thesodiqjon" 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-16 h-16 bg-white rounded-full shadow-[0_0_20px_rgba(59,130,246,0.3)] border-2 border-blue-50 flex items-center justify-center overflow-hidden hover:scale-110 transition-transform duration-300 group relative"
        title="Support"
      >
        <img 
          src="https://cdn-icons-png.flaticon.com/512/4140/4140037.png" 
          alt="Support" 
          className="w-full h-full object-cover p-1"
        />
        <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </a>

      {/* Telegram Channel/Owner Link */}
      <a 
        href="https://t.me/sodiqjon_mukhtorov" 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-14 h-14 bg-[#0088cc] rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform duration-300 group"
        title="Telegram"
      >
        <svg 
          viewBox="0 0 24 24" 
          className="w-7 h-7 fill-white"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.79 5.42-1.12 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.11.02-1.93 1.23-5.46 3.62-.51.35-.98.52-1.4.51-.46-.01-1.35-.26-2.01-.48-.81-.27-1.45-.42-1.39-.88.03-.24.36-.48.99-.74 3.88-1.69 6.46-2.8 7.74-3.33 3.68-1.52 4.44-1.78 4.94-1.79.11 0 .36.03.52.16.13.1.17.24.19.34.02.07.02.21.01.27z" />
        </svg>
      </a>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.3) translateY(20px); }
          50% { opacity: 1; transform: scale(1.05) translateY(-5px); }
          70% { transform: scale(0.9) translateY(2px); }
          100% { transform: scale(1) translateY(0); }
        }
        .animate-bounceIn { animation: bounceIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards; }
      `}} />
    </div>
  );
};

export default SupportWidget;
