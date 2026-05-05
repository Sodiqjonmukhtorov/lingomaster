
import React, { useState } from 'react';

interface PasswordGateProps {
  children: React.ReactNode;
  lang: 'uz' | 'en';
}

const PasswordGate: React.FC<PasswordGateProps> = ({ children, lang }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const CORRECT_PASSWORD = 'sodiqjon_202';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
      setPassword('');
    }
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fadeIn">
        <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 border-4 border-indigo-100 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-4xl mb-6 shadow-xl shadow-indigo-200">
            🔒
          </div>
          <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter italic mb-2">
            Lingomaster Expert
          </h1>
          <p className="text-slate-500 font-bold text-sm mb-8">
            {lang === 'uz' ? 'Xush kelibsiz! Davom etish uchun parolni kiriting.' : 'Welcome! Please enter the password to continue.'}
          </p>

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                placeholder={lang === 'uz' ? 'Parol' : 'Password'}
                className={`w-full px-6 py-4 bg-slate-50 border-2 rounded-2xl text-center font-black text-lg transition-all focus:outline-none focus:ring-4 ${
                  error 
                    ? 'border-rose-500 ring-rose-500/10 text-rose-600 animate-shake' 
                    : 'border-slate-100 focus:border-indigo-400 focus:ring-indigo-400/10 text-slate-800'
                }`}
              />
            </div>
            
            {error && (
              <p className="text-rose-500 text-xs font-black uppercase tracking-widest animate-fadeIn">
                {lang === 'uz' ? "Noto'g'ri parol!" : 'Incorrect password!'}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all"
            >
              {lang === 'uz' ? 'Kirish' : 'Enter'}
            </button>
          </form>

          <p className="mt-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">
             Created by Sodiqjon Mukhtorov
          </p>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out infinite; }
      `}} />
    </div>
  );
};

export default PasswordGate;
