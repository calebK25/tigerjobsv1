
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { CustomButton } from '@/components/ui/custom-button';
import { Briefcase, ArrowRight, Mail, LogIn, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import gsap from 'gsap';
import { toast } from 'sonner';

const LoginPage = () => {
  const { user, login, loginWithEmail, loading } = useAuth();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (containerRef.current && contentRef.current) {
      const tl = gsap.timeline();
      
      tl.fromTo(
        '.logo-container',
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.7)" }
      )
      .fromTo(
        '.title',
        { y: 30, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.6, 
          ease: "power2.out",
          // Add line-height to prevent letter cutting
          lineHeight: '1.2',
          letterSpacing: '-0.02em' 
        }
      )
      .fromTo(
        '.subtitle',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
        "-=0.3"
      )
      .fromTo(
        '.form-element',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.4, ease: "power2.out" },
        "-=0.2"
      );
    }
  }, []);

  const handleLoginClick = async () => {
    setAuthError(null);
    try {
      await login();
    } catch (error) {
      console.error('Login failed:', error);
      setAuthError('Failed to connect to Google. Please try again later.');
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      await loginWithEmail(email);
      setEmailSent(true);
    } catch (error) {
      console.error('Email sign-in error:', error);
      setAuthError('Failed to send magic link. Please try again.');
    }
  };

  if (emailSent) {
    return (
      <div 
        ref={containerRef}
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black animate-gradient text-white p-4"
      >
        <div className="max-w-md w-full space-y-12 p-6 text-center animate-fade-in">
          <h2 className="text-2xl font-bold">Check Your Email</h2>
          <p className="text-gray-400">
            We've sent a magic link to {email}. Click the link to sign in.
          </p>
          <CustomButton 
            variant="outline" 
            onClick={() => setEmailSent(false)}
            animation="lift"
          >
            Try Another Email
          </CustomButton>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black animate-gradient text-white p-4 overflow-hidden relative"
    >
      <div 
        ref={contentRef}
        className="max-w-md w-full space-y-12 p-6 relative"
      >
        <div className="text-center space-y-8 relative">
          <div className="logo-container flex items-center justify-center">
            <div className="p-4 bg-primary/10 rounded-2xl backdrop-blur-sm border border-primary/20 shadow-lg hover:shadow-primary/20 transition-all duration-500 hover:scale-105">
              <Briefcase className="h-10 w-10 text-primary animate-pulse-slow" />
            </div>
          </div>
          <h1 className="title text-5xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent animate-pulse-slow leading-[1.2]">
            Tigerjobs
          </h1>
          <p className="subtitle text-lg text-gray-400 max-w-sm mx-auto leading-relaxed">
            Your intelligent companion for managing job applications and interviews
          </p>
        </div>

        <div className="space-y-8">
          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div className="form-element">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/5 border-white/10 focus:border-primary/50 transition-all duration-300"
              />
            </div>
            <div className="form-element">
              <CustomButton 
                type="submit" 
                className="w-full group"
                disabled={loading}
                animation="scale"
              >
                <Mail className="mr-2 h-4 w-4" />
                <span>Sign in with Email</span>
              </CustomButton>
            </div>
          </form>

          <div className="form-element relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-black px-2 text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="form-element">
            <CustomButton
              className="w-full group bg-white/5 hover:bg-white/10 transition-all duration-300"
              onClick={handleLoginClick}
              disabled={loading}
              animation="lift"
            >
              <LogIn className="mr-2 h-4 w-4" />
              <span>Continue with Google</span>
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </CustomButton>
          </div>

          {authError && (
            <div className="form-element p-3 bg-red-500/10 border border-red-500/20 rounded-md text-red-400 text-sm">
              {authError}
            </div>
          )}

          <p className="form-element text-center text-xs text-gray-500">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
