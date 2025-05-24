"use client";

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AIDALogoIcon } from '@/components/layout/AIDALogoIcon';
import { v4 as uuidv4 } from 'uuid';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', { // We'll create this API route
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: uuidv4(), name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed. Please try again.");
      } else {
        // Optionally sign in the user automatically after registration
        const signInResult = await signIn('credentials', {
          redirect: false,
          email,
          password,
        });
        if (signInResult?.ok) {
          router.push('/'); // Redirect to dashboard
        } else {
          // If auto sign-in fails, redirect to login page with a success message or error
          setError(signInResult?.error || "Registration successful, but auto sign-in failed. Please log in.");
          router.push('/login?registered=true');
        }
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error(err);
    } finally {
        setIsLoading(false);
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
          <CardTitle className="font-orbitron text-2xl accent-text">Create Account</CardTitle>
          <CardDescription className="text-[var(--text-muted-color-val)]">
            Join AIDA to organize your life.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[var(--text-color-val)]">Full Name (Optional)</label>
              <Input id="name" name="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field" placeholder="Your Name"/>
            </div>
            <div>
              <label htmlFor="email-register" className="block text-sm font-medium text-[var(--text-color-val)]">Email Address</label>
              <Input id="email-register" name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" placeholder="you@example.com"/>
            </div>
            <div>
              <label htmlFor="password-register" className="block text-sm font-medium text-[var(--text-color-val)]">Password</label>
              <Input id="password-register" name="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" placeholder="••••••••"/>
            </div>
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-[var(--text-color-val)]">Confirm Password</label>
              <Input id="confirm-password" name="confirmPassword" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input-field" placeholder="••••••••"/>
            </div>
             {error && (
              <p className="text-sm text-destructive text-center bg-destructive/10 p-2 rounded-md">{error}</p>
            )}
            <div>
              <Button type="submit" className="w-full btn-primary" disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Sign Up'}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center text-center">
          <p className="text-sm text-[var(--text-muted-color-val)]">
            Already have an account?{' '}
            <Link href="/login" className="font-medium accent-text hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

