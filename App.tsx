import React, { useState } from 'react';
import { YetiCharacter } from './components/YetiCharacter';

// Icon components for the toggle button
const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
    <line x1="1" y1="1" x2="23" y2="23"></line>
  </svg>
);

const App: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isUsernameFocused, setIsUsernameFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoginFailed, setIsLoginFailed] = useState(false);
  const [isLoginSuccess, setIsLoginSuccess] = useState(false);

  // Determine which input length the character should track.
  const activeInputLength = isPasswordFocused ? password.length : username.length;
  const clampedLength = Math.min(activeInputLength, 30);

  // Yeti Logic:
  // 1. Covering: Password is focused AND Hidden.
  // 2. Peeking: Password is focused AND Visible.
  const isCovering = isPasswordFocused && !showPassword;
  const isPeeking = isPasswordFocused && showPassword;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple mock validation
    // For demo purposes, we'll say the password must be "password"
    if (password === 'password') {
      setIsLoginSuccess(true);
      setIsLoginFailed(false);
    } else {
      // Trigger failure animation
      setIsLoginFailed(true);
      setIsLoginSuccess(false);
    }
  };

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    setter(value);
    if (isLoginFailed) setIsLoginFailed(false);
    if (isLoginSuccess) setIsLoginSuccess(false);
  };

  return (
    <div className="min-h-screen w-full bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md flex flex-col items-center">
        
        {/* Character Container - Positioned to look over the form */}
        <div className="w-48 h-48 mb-[-2rem] z-10 relative">
          <YetiCharacter 
            usernameLength={clampedLength} 
            isCovering={isCovering}
            isPeeking={isPeeking}
            isLoginFailed={isLoginFailed}
            isLoginSuccess={isLoginSuccess}
            isUsernameFocused={isUsernameFocused}
          />
        </div>

        {/* Login Card */}
        <div className="w-full bg-white rounded-2xl shadow-2xl overflow-hidden pt-12 px-8 pb-8">
          <h2 className="text-2xl font-bold text-center text-slate-800 mb-8">Welcome Back</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label 
                htmlFor="username" 
                className="block text-sm font-medium text-slate-600"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => handleInputChange(setUsername, e.target.value)}
                onFocus={() => { setIsPasswordFocused(false); setIsUsernameFocused(true); }}
                onBlur={() => setIsUsernameFocused(false)}
                className="w-full px-4 py-3 bg-white rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-900 placeholder-slate-400"
                placeholder="email@domain.com"
                autoComplete="off"
              />
            </div>

            <div className="space-y-2">
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-slate-600"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => handleInputChange(setPassword, e.target.value)}
                  onFocus={() => { setIsPasswordFocused(true); setIsUsernameFocused(false); }}
                  onBlur={() => setIsPasswordFocused(false)}
                  className={`w-full px-4 py-3 bg-white rounded-lg border focus:ring-2 outline-none transition-all text-slate-900 placeholder-slate-400 pr-12 ${
                    isLoginFailed 
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500" 
                      : (isLoginSuccess ? "border-green-500 focus:ring-green-500 focus:border-green-500" : "border-slate-300 focus:ring-indigo-500 focus:border-indigo-500")
                  }`}
                  placeholder="Try 'password'"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  onMouseDown={(e) => e.preventDefault()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              {isLoginFailed && (
                 <p className="text-red-500 text-xs mt-1">Incorrect password. Try "password".</p>
              )}
              {isLoginSuccess && (
                 <p className="text-green-600 text-xs mt-1 font-medium">Login successful! Redirecting...</p>
              )}
            </div>

            <button
              type="submit"
              className={`w-full font-bold py-3 px-4 rounded-lg transition-colors duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl ${
                isLoginSuccess 
                ? "bg-green-600 hover:bg-green-700 text-white" 
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
              }`}
            >
              {isLoginSuccess ? "Success!" : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <a href="#" className="text-indigo-600 hover:text-indigo-800 font-medium">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;