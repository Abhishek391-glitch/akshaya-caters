'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { UtensilsCrossed, Lock, User, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/admin';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Invalid credentials');
      }

      router.push(from);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {error && (
        <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 flex items-center gap-3 text-rose-800 text-xs">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-[#252923] mb-1">
          Admin Username
        </label>
        <div className="relative">
          <User className="w-4 h-4 text-[#747970] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="admin"
            className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm rounded-lg border border-[#E5E1D5] focus:outline-none focus:border-[#244C3A] bg-[#FAF9F4]"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#252923] mb-1">
          Password
        </label>
        <div className="relative">
          <Lock className="w-4 h-4 text-[#747970] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm rounded-lg border border-[#E5E1D5] focus:outline-none focus:border-[#244C3A] bg-[#FAF9F4]"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 bg-[#244C3A] hover:bg-[#193629] text-white font-semibold text-xs sm:text-sm uppercase tracking-wider rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
      >
        <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
        <ArrowRight className="w-4 h-4 text-[#C6A66B]" />
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F4] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-full bg-[#244C3A] flex items-center justify-center text-[#C6A66B] shadow-sm">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
        </Link>
        <h2 className="mt-4 font-serif text-3xl font-bold tracking-tight text-[#244C3A]">
          Akshaya Caterers CMS
        </h2>
        <p className="mt-1 text-xs text-[#747970] uppercase tracking-wider font-semibold">
          Private Business Administration
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-[#E5E1D5] sm:px-10">
          <Suspense fallback={<div className="text-center py-8 text-xs text-[#747970]">Loading login...</div>}>
            <LoginForm />
          </Suspense>

          {/* Quick Demo Credentials Info */}
          <div className="mt-8 pt-6 border-t border-[#F1EFE5] text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F1EFE5] rounded-full text-[11px] text-[#244C3A] font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-[#244C3A]" />
              <span>Default Credentials: admin / akshaya2026!</span>
            </div>
            <div className="mt-3">
              <Link href="/" className="text-xs text-[#747970] hover:text-[#244C3A]">
                ← Back to Customer Website
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
