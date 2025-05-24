"use client";

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AIDALogoIcon } from '@/components/layout/AIDALogoIcon';
// import { cn } from '@/lib/utils';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    setIsLoading(false);

    if (result?.error) {
      setError(result.error === "CredentialsSignin" ? "Invalid email or password." : result.error);
    } else if (result?.ok) {
      router.push('/'); // Redirect to dashboard or desired page
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background-color-val)] p-4">
       <Link href="/landing" className="flex items-center space-x-3 mb-8 cursor-pointer group">
        <AIDALogoIcon className="group-hover:scale-110 transition-transform duration-200" />
        <h1 className="font-orbitron text-4xl font-bold tracking-wider accent-text group-hover:brightness-110 transition-all duration-200">AIDA</h1>
      </Link>
      <Card className="w-full max-w-md bg-[var(--widget-background-val)] border-[var(--border-color-val)] shadow-2xl">
        <CardHeader className="items-center text-center">
          <CardTitle className="font-orbitron text-2xl accent-text">Welcome Back</CardTitle>
          <CardDescription className="text-[var(--text-muted-color-val)]">
            Sign in to access your dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-[var(--text-color-val)]">Email Address</label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-[var(--text-color-val)]">Password</label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
              />
            </div>
            {error && (
              <p className="text-sm text-destructive text-center bg-destructive/10 p-2 rounded-md">{error}</p>
            )}
            <div>
              <Button type="submit" className="w-full btn-primary" disabled={isLoading}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center text-center">
          <p className="text-sm text-[var(--text-muted-color-val)]">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-medium accent-text hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

