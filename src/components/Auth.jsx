import { useState } from 'react';
import { db } from '../lib/instantdb';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [sentEmail, setSentEmail] = useState(false);

  const handleMagicLink = async () => {
    try {
      await db.auth.sendMagicCode({ email });
      setSentEmail(true);
    } catch (error) {
      console.error('Error sending magic link:', error);
      alert('Failed to send magic link. Please try again.');
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
              onClick={handleMagicLink}
              disabled={!email}
              className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
                email
                  ? 'bg-gradient-to-r from-teal-400 to-green-500 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Send Magic Link
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
          <div className="text-center">
            <div className="text-5xl mb-4">✉️</div>
            <h2 className="text-2xl font-bold mb-3 text-gray-900">Check Your Email</h2>
            <p className="text-gray-600 mb-6">
              We sent a magic link to <strong>{email}</strong>
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Click the link in your email to sign in. The link will expire in 15 minutes.
            </p>
            <button
              onClick={() => setSentEmail(false)}
              className="text-teal-600 font-semibold hover:text-teal-700"
            >
              Use a different email
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
