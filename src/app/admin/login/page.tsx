'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, ShieldCheck, ArrowRight, AlertCircle, KeyRound } from 'lucide-react';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const brandName = process.env.NEXT_PUBLIC_BRAND_NAME || 'FLEXO LIFESTYLE';
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@flexolifestyle.com';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      if (isSupabaseConfigured() && supabase) {
        // Authenticate with Supabase Auth
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim(),
        });

        if (error) {
          setErrorMsg(error.message);
          setIsLoading(false);
          return;
        }

        // Verify authorized email
        if (data.user?.email?.toLowerCase() !== adminEmail.toLowerCase()) {
          setErrorMsg(`Access denied. Only ${adminEmail} has merchant privileges.`);
          await supabase.auth.signOut();
          setIsLoading(false);
          return;
        }

        localStorage.setItem('flexo_admin_authenticated', 'true');
        router.push('/admin');
      } else {
        // Fallback for immediate test / demo mode before Supabase credentials are typed
        if (password.trim() === 'admin123' || password.trim() === 'flexo2026' || email.trim() === adminEmail) {
          localStorage.setItem('flexo_admin_authenticated', 'true');
          router.push('/admin');
        } else {
          setErrorMsg('Invalid password. For local testing without Supabase, use passcode: admin123');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-gold-400 mx-auto shadow-2xl">
            <Lock className="w-8 h-8" />
          </div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-gold-400 font-bold">
            Protected Merchant Gateway
          </span>
          <h1 className="font-display font-black text-3xl text-white tracking-tight">
            {brandName} ADMIN
          </h1>
          <p className="text-xs text-zinc-400">
            Sign in to manage products, categories, orders, and UPI verifications.
          </p>
        </div>

        <form onSubmit={handleLogin} className="p-8 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-5 shadow-2xl">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
              Admin Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={adminEmail}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-gold-400"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
              Password / Passcode
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password (e.g. admin123)"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-gold-400"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-gold-400 hover:bg-gold-300 text-black font-display font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xl shadow-gold-500/10 disabled:opacity-50"
          >
            {isLoading ? <span>Authenticating...</span> : (
              <>
                <span>Access Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-850 text-[11px] text-zinc-400 space-y-1">
            <div className="flex items-center gap-1.5 text-gold-400 font-semibold">
              <KeyRound className="w-3.5 h-3.5" />
              <span>Free-Tier Quick Access Notice</span>
            </div>
            <p className="text-zinc-500">
              Works directly with your Supabase Auth user. If testing locally before connecting Supabase, enter your email and pass: <code className="text-zinc-300">admin123</code>.
            </p>
          </div>
        </form>

        <div className="text-center">
          <Link href="/" className="text-xs text-zinc-500 hover:text-white transition-colors">
            &larr; Back to Public Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
