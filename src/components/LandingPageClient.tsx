'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  CheckCircle,
  Star,
  Shield,
  Zap,
  FileText,
  Users,
  Award,
  MessageSquare,
  ChevronDown,
  X,
  CreditCard,
  Headphones,
  BotMessageSquare,
  Hammer,
  Layers,
  Gem,
  ArrowRight,
  Sparkles
} from 'lucide-react';

// --- REFINED useIntersectionObserver HOOK ---
const useIntersectionObserver = (
  elementRef: React.RefObject<HTMLElement>,
  options: IntersectionObserverInit
): IntersectionObserverEntry | null => {
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);

  useEffect(() => {
    const node = elementRef?.current; // The node to observe
    const hasIOSupport = !!window.IntersectionObserver;

    if (!hasIOSupport || !node) return;

    const observer = new IntersectionObserver(([entry]) => {
      // Update state with the entry only when it's intersecting
      // or when it's not, depending on your needs. Here we update always.
      setEntry(entry);
    }, options);

    observer.observe(node);

    return () => observer.disconnect();

    // We depend on the ref and options, but stringify options to prevent re-runs on object reference changes
  }, [elementRef, options.threshold, options.root, options.rootMargin]);

  return entry;
};


export const LandingPageClient = () => {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [activeBackground, setActiveBackground] = useState('default');

  // --- CORRECTED REF IMPLEMENTATION ---
  // 1. Create refs for each section
  const heroRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLElement>(null);
  const howItWorksRef = useRef<HTMLElement>(null);
  const templatesRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLElement>(null);
  const testimonialsRef = useRef<HTMLElement>(null);
  const pricingRef = useRef<HTMLElement>(null);
  const faqRef = useRef<HTMLElement>(null);

  // 2. Pass refs into the hook
  const heroEntry = useIntersectionObserver(heroRef, { threshold: 0.1 });
  const statsEntry = useIntersectionObserver(statsRef, { threshold: 0.5 });
  const howItWorksEntry = useIntersectionObserver(howItWorksRef, { threshold: 0.2 });
  const templatesEntry = useIntersectionObserver(templatesRef, { threshold: 0.1 });
  const featuresEntry = useIntersectionObserver(featuresRef, { threshold: 0.1 });
  const testimonialsEntry = useIntersectionObserver(testimonialsRef, { threshold: 0.1 });
  const pricingEntry = useIntersectionObserver(pricingRef, { threshold: 0.1 });
  const faqEntry = useIntersectionObserver(faqRef, { threshold: 0.1 });


  const toggleFaq = (index: number) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  const faqData = [
    { question: "Is this really for me if I'm just starting out?", answer: "Absolutely. ResumeCraft is designed for everyone, from new graduates to seasoned executives. Our AI understands your experience level and crafts language that highlights your potential and strengths, no matter where you are in your career journey." },
    { question: "How is ResumeCraft different from a standard template?", answer: "Templates give you a layout; ResumeCraft gives you a strategy. Our AI doesn't just fill in blanks—it rewrites your story, optimizes it for both AI screeners (ATS) and human eyes, and ensures every word serves a purpose: to get you noticed." },
    { question: "Can I try it before I commit?", answer: "Yes. Our 'First Draft' plan is completely free. It allows you to experience the core AI engine, generate a complete resume, and see the magic for yourself. No credit card, no strings attached." },
    { question: "What if I don't like the resume it creates?", answer: "Our platform is interactive. You can regenerate sections, offer feedback to the AI, and fine-tune the results until they perfectly match your voice and style. Plus, our Pro plan comes with a 14-day satisfaction guarantee." }
  ];

  const landingPageTemplates = [
    { name: 'The Minimalist', path: '/thumbnails/executive.png' },
    { name: 'The Storyteller', path: '/thumbnails/creative.png' },
    { name: 'The Engineer', path: '/thumbnails/technical.png' },
    { name: 'The Innovator', path: '/thumbnails/academic.png' },
    { name: 'The Leader', path: '/thumbnails/bold.png' },
    { name: 'The Futurist', path: '/thumbnails/onyx.png' },
  ];

  return (
    <div className="font-sans bg-[#111827] text-gray-300 overflow-x-hidden relative">
      {/* Cinematic Background Layer */}
      <div className="fixed top-0 left-0 w-full h-full z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className={`w-full h-full object-cover transition-opacity duration-1000 ${activeBackground === 'default' ? 'opacity-20' : 'opacity-0'}`}
          src="/videos/cinematic-bg.mp4" // Replace with your video path
        />
        <div className={`absolute inset-0 bg-gradient-to-tr from-purple-900/30 to-blue-900/30 transition-opacity duration-1000 ${activeBackground === 'features' ? 'opacity-50' : 'opacity-0'}`}></div>
        <div className={`absolute inset-0 bg-gradient-to-br from-green-900/30 to-teal-900/30 transition-opacity duration-1000 ${activeBackground === 'templates' ? 'opacity-50' : 'opacity-0'}`}></div>
      </div>

      {/* Content Layer */}
      <div className="relative z-10">
        {/* Sticky Header */}
        <header className="sticky top-0 z-50 bg-[#111827]/80 backdrop-blur-lg border-b border-gray-700/50">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  <Sparkles className="w-6 h-6 text-gray-900" />
                </div>
                <span className="font-poppins font-bold text-xl text-white">ResumeCraft</span>
              </Link>
              <nav className="hidden md:flex items-center space-x-8">
                <a href="#features" className="text-gray-400 hover:text-yellow-400 transition-colors">How It Works</a>
                <a href="#templates" className="text-gray-400 hover:text-yellow-400 transition-colors">Designs</a>
                <a href="#pricing" className="text-gray-400 hover:text-yellow-400 transition-colors">Pricing</a>
              </nav>
              <div className="flex items-center space-x-4">
                <Link href="/login" className="text-gray-400 hover:text-yellow-400 transition-colors hidden sm:block">Sign In</Link>
                <Link href="/login" className="bg-yellow-400 text-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-all duration-300 transform hover:scale-105">Start For Free</Link>
              </div>
          </div>
        </header>

        {/* Hero Section */}
        {/* 3. Assign the ref to the element */}
        <section ref={heroRef} className="pt-20 pb-28 px-6 min-h-screen flex items-center">
          <div className={`container mx-auto grid lg:grid-cols-2 gap-16 items-center transition-all duration-1000 ${heroEntry?.isIntersecting ? 'opacity-100' : 'opacity-0'}`}>
              <div className="transform-none">
                <h1 className="font-poppins text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">Stop Writing Resumes.   
<span className="text-yellow-400">Start Telling Your Story.</span></h1>
                <p className="text-xl text-gray-400 mb-10 leading-relaxed">Welcome to the new era of career building. ResumeCraft is the first AI-powered storyteller that transforms your experience into a compelling narrative recruiters can't ignore.</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/login" className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-500 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"><span>Create My Story</span><ArrowRight className="w-5 h-5" /></Link>
                </div>
                <p className="text-gray-500 mt-4 text-sm">No credit card required. Your first draft is on us.</p>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-400/10 rounded-full blur-3xl animate-pulse"></div>
                <Image
                  src="/images/hero-image-dynamic.png"
                  alt="An abstract visualization of a career story being crafted"
                  width={600}
                  height={600}
                  className="relative rounded-2xl transform hover:scale-105 transition-transform duration-500"
                  priority
                />
              </div>
          </div>
        </section>

        {/* Stats Section */}
        <section ref={statsRef} className={`py-20 px-6 bg-black/20 transition-all duration-700 ease-in-out ${statsEntry?.isIntersecting ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full'}`}>
          <div className="container mx-auto text-center">
            <h2 className="font-poppins text-4xl font-bold text-white mb-4">The Old Way is Broken.</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-12">Your career is unique. Your resume shouldn't be a generic document lost in a sea of applicants.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="border border-gray-700/50 p-6 rounded-lg">
                <div className="text-5xl font-bold font-poppins mb-2 text-yellow-400">6 Seconds</div>
                <div className="text-gray-400">The average time a recruiter spends on a resume.</div>
              </div>
              <div className="border border-gray-700/50 p-6 rounded-lg">
                <div className="text-5xl font-bold font-poppins mb-2 text-yellow-400">75%</div>
                <div className="text-gray-400">Of resumes are rejected by automated systems (ATS) before a human sees them.</div>
              </div>
              <div className="border border-gray-700/50 p-6 rounded-lg">
                <div className="text-5xl font-bold font-poppins mb-2 text-yellow-400">98%</div>
                <div className="text-gray-400">Of job seekers feel their resume doesn't truly represent their skills.</div>
              </div>
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section ref={howItWorksRef} className={`py-24 px-6 transition-all duration-700 ease-in-out ${howItWorksEntry?.isIntersecting ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}`}>
            {/* ... content remains the same */}
        </section>

        {/* Templates Section */}
        <section ref={templatesRef} id="templates" className={`py-24 px-6 bg-black/20 transition-all duration-700 ease-in-out ${templatesEntry?.isIntersecting ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full'}`} onMouseOver={() => setActiveBackground('templates')} onMouseOut={() => setActiveBackground('default')}>
            {/* ... content remains the same */}
        </section>

        {/* Features Section */}
        <section ref={featuresRef} id="features" className={`py-24 px-6 transition-all duration-700 ease-in-out ${featuresEntry?.isIntersecting ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}`} onMouseOver={() => setActiveBackground('features')} onMouseOut={() => setActiveBackground('default')}>
            {/* ... content remains the same */}
        </section>

        {/* Testimonials Section */}
        <section ref={testimonialsRef} id="testimonials" className={`py-24 px-6 bg-black/20 transition-all duration-700 ease-in-out ${testimonialsEntry?.isIntersecting ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full'}`}>
            {/* ... content remains the same */}
        </section>

        {/* Pricing Section */}
        <section ref={pricingRef} id="pricing" className={`py-24 px-6 transition-all duration-700 ease-in-out ${pricingEntry?.isIntersecting ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}`}>
            {/* ... content remains the same */}
        </section>
        
        {/* FAQ Section */}
        <section ref={faqRef} id="faq" className={`py-24 px-6 bg-black/20 transition-all duration-700 ease-in-out ${faqEntry?.isIntersecting ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full'}`}>
            {/* ... content remains the same */}
        </section>

        {/* Final CTA and Footer */}
        {/* ... content remains the same */}
      </div>
    </div>
  );
};
