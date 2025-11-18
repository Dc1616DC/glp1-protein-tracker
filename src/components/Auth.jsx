import { useState } from 'react';
import { db } from '../lib/instantdb';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [sentEmail, setSentEmail] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const handleSendCode = async () => {
    try {
      await db.auth.sendMagicCode({ email });
      setSentEmail(true);
    } catch (error) {
      console.error('Error sending code:', error);
      alert('Failed to send verification code. Please try again.');
    }
  };

  const handleVerifyCode = async () => {
    if (!code) return;

    setVerifying(true);
    try {
      await db.auth.signInWithMagicCode({ email, code });
      // Auth state will update automatically via useAuth hook
    } catch (error) {
      console.error('Error verifying code:', error);
      alert('Invalid code. Please check your email and try again.');
      setVerifying(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await db.auth.signInWithGoogle();
    } catch (error) {
      console.error('Error with Google sign-in:', error);
      alert('Failed to sign in with Google. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="glass-card max-w-md w-full p-8">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">💪</div>
          <h1 className="text-3xl font-bold mb-2 text-gray-900">Welcome Back</h1>
          <p className="text-gray-600">Sign in to access your protein tracking</p>
        </div>

        {!sentEmail ? (
          <div className="space-y-4">
            {/* Magic Link Sign In */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-teal-400 focus:outline-none text-lg"
              />
            </div>

            <button
              onClick={handleSendCode}
              disabled={!email}
              className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
                email
                  ? 'bg-gradient-to-r from-teal-400 to-green-500 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Send Verification Code
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Google Sign In */}
            <button
              onClick={handleGoogleSignIn}
              className="w-full py-4 rounded-xl font-semibold text-lg border-2 border-gray-300 hover:border-gray-400 transition-all bg-white text-gray-700 flex items-center justify-center gap-3"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </button>

            <p className="text-xs text-center text-gray-500 mt-4">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        ) : (
          <div>
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">✉️</div>
              <h2 className="text-2xl font-bold mb-3 text-gray-900">Enter Verification Code</h2>
              <p className="text-gray-600">
                We sent a 6-digit code to <strong>{email}</strong>
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-teal-400 focus:outline-none text-2xl text-center font-mono tracking-widest"
                  maxLength="6"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoFocus
                />
              </div>

              <button
                onClick={handleVerifyCode}
                disabled={code.length !== 6 || verifying}
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
                  code.length === 6 && !verifying
                    ? 'bg-gradient-to-r from-teal-400 to-green-500 text-white shadow-lg hover:shadow-xl'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {verifying ? 'Verifying...' : 'Sign In'}
              </button>

              <div className="flex justify-between items-center text-sm">
                <button
                  onClick={() => setSentEmail(false)}
                  className="text-teal-600 font-semibold hover:text-teal-700"
                >
                  Use different email
                </button>
                <button
                  onClick={handleSendCode}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Resend code
                </button>
              </div>

              <p className="text-xs text-center text-gray-500 mt-4">
                Code expires in 15 minutes
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
