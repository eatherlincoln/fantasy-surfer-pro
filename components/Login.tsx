import React, { useState } from 'react';
import { supabase } from '../services/supabase';

type Mode = 'LOGIN' | 'SIGNUP' | 'FORGOT_PASSWORD' | 'RESET_PASSWORD';

interface LoginProps {
  onLogin: () => void;
  initialMode?: Mode;
}

const Login: React.FC<LoginProps> = ({ onLogin, initialMode = 'LOGIN' }) => {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showMsg = (type: 'success' | 'error', text: string) => setMessage({ type, text });
  const clearMsg = () => setMessage(null);

  // ── Sign Up ────────────────────────────────────────────────
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    clearMsg();
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      if (data.session) {
        onLogin();
      } else {
        showMsg('success', 'Check your email for a confirmation link to activate your account.');
        setMode('LOGIN');
      }
    } catch (err: any) {
      showMsg('error', err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Sign In ────────────────────────────────────────────────
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    clearMsg();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        // Give friendlier messages for common failures
        if (error.message.includes('Invalid login credentials')) {
          throw new Error(
            "Incorrect email or password. If you joined via an invite link, try 'Forgot Password' to set a password."
          );
        }
        if (error.message.includes('Email not confirmed')) {
          throw new Error(
            "Your email hasn't been confirmed yet. Check your inbox for a confirmation link."
          );
        }
        throw error;
      }
      if (data.session) onLogin();
    } catch (err: any) {
      showMsg('error', err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Forgot Password ────────────────────────────────────────
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    clearMsg();
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}`,
      });
      if (error) throw error;
      showMsg('success', `Reset link sent to ${email}. Check your inbox and click the link to set a new password.`);
    } catch (err: any) {
      showMsg('error', err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Reset Password (after clicking email link) ─────────────
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showMsg('error', 'Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      showMsg('error', 'Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    clearMsg();
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      showMsg('success', 'Password updated! Logging you in…');
      setTimeout(onLogin, 1200);
    } catch (err: any) {
      showMsg('error', err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Logo / shared header ───────────────────────────────────
  const Logo = () => (
    <div className="flex flex-col items-center mb-10">
      <div className="w-24 h-24 bg-sage-medium rounded-3xl flex items-center justify-center mb-6 apple-shadow">
        <svg className="w-14 h-14 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2C7.03 2 3 6.03 3 11c0 2.19.78 4.2 2.08 5.76L4 21l4.24-1.08C9.8 20.22 11.81 21 14 21c4.97 0 9-4.03 9-9 0-4.97-4.03-9-9-9z" />
          <path d="M7 11c3 0 5-2 5-2s2 2 5 2" />
        </svg>
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight">Fantasy Surfer</h1>
    </div>
  );

  const subtitles: Record<Mode, string> = {
    LOGIN: 'Welcome back. Log in to manage your team.',
    SIGNUP: 'Create an account to save your team.',
    FORGOT_PASSWORD: 'Enter your email and we\'ll send a reset link.',
    RESET_PASSWORD: 'Choose a new password for your account.',
  };

  // ── Message banner ─────────────────────────────────────────
  const MessageBanner = () => message ? (
    <div className={`w-full max-w-sm px-4 py-3 rounded-2xl text-sm font-medium text-center mb-4 ${
      message.type === 'success'
        ? 'bg-green-50 text-green-700 border border-green-200'
        : 'bg-red-50 text-red-700 border border-red-200'
    }`}>
      {message.text}
    </div>
  ) : null;

  return (
    <div className="min-h-screen bg-stone-light flex flex-col items-center justify-center p-8 text-center animate-in zoom-in duration-500">
      <Logo />

      <p className="text-gray-500 font-medium mb-8 max-w-[280px]">
        {subtitles[mode]}
      </p>

      <MessageBanner />

      {/* ── LOGIN ── */}
      {mode === 'LOGIN' && (
        <form onSubmit={handleSignIn} className="w-full max-w-sm space-y-4 animate-in fade-in slide-in-from-bottom-4">
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
            className="w-full p-4 rounded-2xl border border-stone-greige bg-white focus:outline-none focus:ring-2 focus:ring-sage-deep" required />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
            className="w-full p-4 rounded-2xl border border-stone-greige bg-white focus:outline-none focus:ring-2 focus:ring-sage-deep" required />

          <button type="submit" disabled={loading}
            className="w-full bg-black text-white py-4 rounded-2xl font-bold transform transition-transform active:scale-95 disabled:opacity-50">
            {loading ? 'Logging In…' : 'Log In'}
          </button>

          {/* Forgot password — subtle link under button */}
          <button type="button" onClick={() => { setMode('FORGOT_PASSWORD'); clearMsg(); }}
            className="w-full text-sm text-gray-400 hover:text-black transition-colors font-medium">
            Forgot your password?
          </button>

          <button type="button" onClick={() => { setMode('SIGNUP'); clearMsg(); }}
            className="w-full text-gray-500 font-bold py-2 hover:text-black transition-colors">
            Don't have an account? Sign Up
          </button>

          <Divider />

          <button type="button" onClick={onLogin}
            className="w-full bg-white border border-stone-greige text-gray-700 flex items-center justify-center gap-3 py-4 rounded-2xl font-bold transform transition-transform active:scale-95 hover:bg-gray-50">
            <span className="material-icons-round">person_outline</span>
            Continue as Guest
          </button>
        </form>
      )}

      {/* ── SIGN UP ── */}
      {mode === 'SIGNUP' && (
        <form onSubmit={handleSignUp} className="w-full max-w-sm space-y-4 animate-in fade-in slide-in-from-bottom-4">
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
            className="w-full p-4 rounded-2xl border border-stone-greige bg-white focus:outline-none focus:ring-2 focus:ring-sage-deep" required />
          <input type="password" placeholder="Password (min. 6 characters)" value={password} onChange={e => setPassword(e.target.value)}
            className="w-full p-4 rounded-2xl border border-stone-greige bg-white focus:outline-none focus:ring-2 focus:ring-sage-deep" required minLength={6} />

          <button type="submit" disabled={loading}
            className="w-full bg-black text-white py-4 rounded-2xl font-bold transform transition-transform active:scale-95 disabled:opacity-50">
            {loading ? 'Creating Account…' : 'Sign Up'}
          </button>

          <button type="button" onClick={() => { setMode('LOGIN'); clearMsg(); }}
            className="w-full text-gray-500 font-bold py-2 hover:text-black transition-colors">
            Already have an account? Log In
          </button>

          <Divider />

          <button type="button" onClick={onLogin}
            className="w-full bg-white border border-stone-greige text-gray-700 flex items-center justify-center gap-3 py-4 rounded-2xl font-bold transform transition-transform active:scale-95 hover:bg-gray-50">
            <span className="material-icons-round">person_outline</span>
            Continue as Guest
          </button>
        </form>
      )}

      {/* ── FORGOT PASSWORD ── */}
      {mode === 'FORGOT_PASSWORD' && (
        <form onSubmit={handleForgotPassword} className="w-full max-w-sm space-y-4 animate-in fade-in slide-in-from-bottom-4">
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
            className="w-full p-4 rounded-2xl border border-stone-greige bg-white focus:outline-none focus:ring-2 focus:ring-sage-deep" required />

          <button type="submit" disabled={loading}
            className="w-full bg-black text-white py-4 rounded-2xl font-bold transform transition-transform active:scale-95 disabled:opacity-50">
            {loading ? 'Sending…' : 'Send Reset Link'}
          </button>

          <button type="button" onClick={() => { setMode('LOGIN'); clearMsg(); }}
            className="w-full text-gray-500 font-bold py-2 hover:text-black transition-colors">
            ← Back to Log In
          </button>
        </form>
      )}

      {/* ── RESET PASSWORD (arrived via email link) ── */}
      {mode === 'RESET_PASSWORD' && (
        <form onSubmit={handleResetPassword} className="w-full max-w-sm space-y-4 animate-in fade-in slide-in-from-bottom-4">
          <input type="password" placeholder="New password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
            className="w-full p-4 rounded-2xl border border-stone-greige bg-white focus:outline-none focus:ring-2 focus:ring-sage-deep" required minLength={6} />
          <input type="password" placeholder="Confirm new password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
            className="w-full p-4 rounded-2xl border border-stone-greige bg-white focus:outline-none focus:ring-2 focus:ring-sage-deep" required minLength={6} />

          <button type="submit" disabled={loading}
            className="w-full bg-black text-white py-4 rounded-2xl font-bold transform transition-transform active:scale-95 disabled:opacity-50">
            {loading ? 'Saving…' : 'Set New Password'}
          </button>
        </form>
      )}

      <p className="mt-12 text-[10px] text-gray-400 font-medium px-8 leading-relaxed">
        By continuing, you agree to our <span className="underline">Terms of Service</span> and <span className="underline">Privacy Policy</span>.
      </p>
    </div>
  );
};

// ── Small helper component ─────────────────────────────────
const Divider = () => (
  <div className="flex items-center gap-4 py-2">
    <div className="flex-1 h-[1px] bg-stone-greige" />
    <span className="text-[10px] font-bold text-gray-400 uppercase">Or</span>
    <div className="flex-1 h-[1px] bg-stone-greige" />
  </div>
);

export default Login;
