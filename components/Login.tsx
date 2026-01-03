import React, { useState } from 'react';
import { supabase } from '../services/supabase';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error("Login failed:", error);
      // Fallback for demo/local if no keys
      onLogin();
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      if (data.session) {
        onLogin();
      } else {
        alert('Check your email for the confirmation link! (For local dev, check Supabase Inbucket)');
        setIsSignUpMode(false);
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      if (data.session) onLogin();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-light flex flex-col items-center justify-center p-8 text-center animate-in zoom-in duration-500">
      <div className="w-24 h-24 bg-sage-medium rounded-3xl flex items-center justify-center mb-10 apple-shadow">
        <svg className="w-14 h-14 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2C7.03 2 3 6.03 3 11c0 2.19.78 4.2 2.08 5.76L4 21l4.24-1.08C9.8 20.22 11.81 21 14 21c4.97 0 9-4.03 9-9 0-4.97-4.03-9-9-9z" />
          <path d="M7 11c3 0 5-2 5-2s2 2 5 2" />
        </svg>
      </div>

      <h1 className="text-4xl font-extrabold tracking-tight mb-4">Fantasy Surfer</h1>
      <p className="text-gray-500 font-medium mb-12 max-w-[280px]">
        {isSignUpMode ? 'Create an account to save your team.' : 'Build your dream team. Compete with friends.'}
      </p>

      {isSignUpMode ? (
        <form onSubmit={handleEmailSignUp} className="w-full max-w-sm space-y-4 animate-in fade-in slide-in-from-bottom-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 rounded-2xl border border-stone-greige bg-white focus:outline-none focus:ring-2 focus:ring-sage-deep"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 rounded-2xl border border-stone-greige bg-white focus:outline-none focus:ring-2 focus:ring-sage-deep"
            required
            minLength={6}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-2xl font-bold transform transition-transform active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>

          <button
            type="button"
            onClick={() => setIsSignUpMode(false)}
            className="w-full text-gray-500 font-bold py-2"
          >
            Back to Login
          </button>
        </form>
      ) : (
        <div className="w-full max-w-sm space-y-4">
          <button
            onClick={onLogin}
            className="w-full bg-black text-white flex items-center justify-center gap-3 py-4 rounded-2xl font-bold transform transition-transform active:scale-95"
          >
            <span className="material-icons-round">person_outline</span>
            Continue as Guest
          </button>

          <button
            onClick={handleGoogleLogin}
            className="w-full bg-white border border-stone-greige text-gray-700 flex items-center justify-center gap-3 py-4 rounded-2xl font-bold transform transition-transform active:scale-95 hover:bg-gray-50"
          >
            <img src="https://www.gstatic.com/images/branding/product/1x/googleg_48dp.png" className="w-5 h-5" alt="Google" />
            Continue with Google
          </button>

          <button
            onClick={() => alert("Facebook Sign In coming soon! Please use 'Sign up with email' below.")}
            className="w-full bg-[#1877F2] text-white flex items-center justify-center gap-3 py-4 rounded-2xl font-bold transform transition-transform active:scale-95"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Continue with Facebook
          </button>

          <div className="flex items-center gap-4 py-4">
            <div className="flex-1 h-[1px] bg-stone-greige"></div>
            <span className="text-[10px] font-bold text-gray-400 uppercase">Or</span>
            <div className="flex-1 h-[1px] bg-stone-greige"></div>
          </div>

          <button
            onClick={() => setIsSignUpMode(true)}
            className="text-sage-deep font-bold hover:underline"
          >
            Sign up with email
          </button>
        </div>
      )}

      <p className="mt-12 text-[10px] text-gray-400 font-medium px-8 leading-relaxed">
        By continuing, you agree to our <span className="underline">Terms of Service</span> and <span className="underline">Privacy Policy</span>.
      </p>
    </div>
  );
};

export default Login;
