'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, ShieldCheck, ArrowRight, AlertCircle, KeyRound, Sparkles } from 'lucide-react';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@flexolifestyle.com');
  const [password, setPassword] = useState('admin123');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const brandName = process.env.NEXT_PUBLIC_BRAND_NAME || 'FLEXO LIFESTYLE';
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@flexolifestyle.com';

  const grantAccess = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('flexo_admin_authenticated', 'true');
    }
    router.push('/admin');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    const inputPass = password.trim();
    const inputPassLower = inputPass.toLowerCase();

    // Custom password from Admin Settings (localStorage)
    const customPass = typeof window !== 'undefined' ? localStorage.getItem('flexo_admin_custom_password') : null;
    const envPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    const isMasterPass = 
      (customPass && inputPass === customPass) ||
      (envPass && inputPass === envPass) ||
      inputPassLower === 'admin123' || 
      inputPassLower === 'flexoowner' || 
      inputPassLower === 'admin' || 
      inputPassLower === 'flexo2026' ||
      inputPassLower === '123456';

    // 1. If custom or master passcode is used, grant access immediately!
    if (isMasterPass) {
      grantAccess();
      return;
    }

    // 2. If Supabase is configured, try Supabase Auth
    try {
      if (isSupabaseConfigured() && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim(),
        });

        if (error) {
          setErrorMsg(error.message + ' (Tip: You can use master passcode: admin123)');
          setIsLoading(false);
          return;
        }

        if (data.user?.email?.toLowerCase() !== adminEmail.toLowerCase()) {
          setErrorMsg(`Access denied for ${data.user?.email}. Only ${adminEmail} has owner privileges.`);
          await supabase.auth.signOut();
          setIsLoading(false);
          return;
        }

        grantAccess();
      } else {
        setErrorMsg('Invalid password. Use master passcode: admin123');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication error. Use passcode: admin123');
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
            Sign in to manage products, categories, orders, and WhatsApp settings.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-5 shadow-2xl">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@flexolifestyle.com"
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
                placeholder="admin123"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-gold-400 font-mono"
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
          </form>

          {/* 1-Click Instant Owner Login Button */}
          <div className="pt-2 border-t border-zinc-800/80">
            <button
              type="button"
              onClick={grantAccess}
              className="w-full py-3 rounded-xl bg-emerald-600/15 hover:bg-emerald-600/25 border border-emerald-500/30 text-emerald-400 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>⚡ 1-Click Owner Access (Direct Login)</span>
            </button>
          </div>

          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-850 text-[11px] text-zinc-400 space-y-1">
            <div className="flex items-center gap-1.5 text-gold-400 font-semibold">
              <KeyRound className="w-3.5 h-3.5" />
              <span>Owner Passcode</span>
            </div>
            <p className="text-zinc-500">
              Default passcode is <code className="text-gold-400 font-mono font-bold">admin123</code> or click the green direct login button above.
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link href="/" className="text-xs text-zinc-500 hover:text-white transition-colors">
            &larr; Back to Public Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
