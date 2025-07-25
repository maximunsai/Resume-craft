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
  MessageSquare,
  ChevronDown,
  BotMessageSquare,
  Hammer,
  Layers,
  Gem,
  ArrowRight,
  Sparkles,
  Mic, // New Icon for Interviews
  ClipboardCheck // New Icon for Feedback
} from 'lucide-react';

// REFINED useIntersectionObserver HOOK (No changes needed here)
const useIntersectionObserver = (
  elementRef: React.RefObject<HTMLElement>,
  options: IntersectionObserverInit
): IntersectionObserverEntry | null => {
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);

  useEffect(() => {
    const node = elementRef?.current;
    const hasIOSupport = !!window.IntersectionObserver;

    if (!hasIOSupport || !node) return;

    const observer = new IntersectionObserver(([entry]) => {
      setEntry(entry);
    }, options);

    observer.observe(node);

    return () => observer.disconnect();
  }, [elementRef, options.threshold, options.root, options.rootMargin]);

  return entry;
};


export const LandingPageClient = () => {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [activeBackground, setActiveBackground] = useState('default');

  // Create refs for each section
  const heroRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLElement>(null);
  const howItWorksRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLElement>(null);
  const testimonialsRef = useRef<HTMLElement>(null);
  const pricingRef = useRef<HTMLElement>(null);
  const faqRef = useRef<HTMLElement>(null);

  // Pass refs into the hook
  const heroEntry = useIntersectionObserver(heroRef, { threshold: 0.1 });
  const statsEntry = useIntersectionObserver(statsRef, { threshold: 0.5 });
  const howItWorksEntry = useIntersectionObserver(howItWorksRef, { threshold: 0.2 });
  const featuresEntry = useIntersectionObserver(featuresRef, { threshold: 0.1 });
  const testimonialsEntry = useIntersectionObserver(testimonialsRef, { threshold: 0.1 });
  const pricingEntry = useIntersectionObserver(pricingRef, { threshold: 0.1 });
  const faqEntry = useIntersectionObserver(faqRef, { threshold: 0.1 });


  const toggleFaq = (index: number) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  const faqData = [
    { question: "How does the AI Mock Interview work?", answer: "Once your resume is crafted, our AI Interviewer uses it as a script. It asks you relevant behavioral and technical questions via voice. You respond, and the AI provides real-time, actionable feedback on your answers, clarity, and confidence." },
    { question: "Is this for me if I'm just starting out?", answer: "Absolutely. ResumeCraft is designed for everyone. For resumes, it highlights your potential. For interviews, it provides a safe space to practice and build the confidence you need to land your first major role." },
    { question: "How is ResumeCraft different from other tools?", answer: "We are a complete career launchpad. Other tools give you a document. We give you a powerful story, the practice to tell it confidently in an interview, and the feedback to perfect your delivery. It's an end-to-end solution." },
    { question: "Can I try it before I commit?", answer: "Yes. Our 'First Draft' plan is completely free. It allows you to experience the core resume AI and see the magic for yourself. The Mock Interview feature is part of our Pro plan, which comes with a 14-day satisfaction guarantee." }
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
          className="w-full h-full object-cover opacity-20"
          src="/videos/cinematic-bg.mp4" // Replace with your video path
        />
        {/* Additional visual layers for hover effects can be added here */}
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
              <a href="#features" className="text-gray-400 hover:text-yellow-400 transition-colors">Features</a>
              <a href="#pricing" className="text-gray-400 hover:text-yellow-400 transition-colors">Pricing</a>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-gray-400 hover:text-yellow-400 transition-colors hidden sm:block">Sign In</Link>
              <Link href="/login" className="bg-yellow-400 text-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-all duration-300 transform hover:scale-105">Get Started Free</Link>
            </div>
          </div>
        </header>

        {/* Hero Section - **STRATEGICALLY UPDATED** */}
        <section ref={heroRef} className="pt-20 pb-28 px-6"> {/* **FIXED:** Removed min-h-screen */}
          <div className={`container mx-auto grid lg:grid-cols-2 gap-16 items-center transition-all duration-1000 ${heroEntry?.isIntersecting ? 'opacity-100' : 'opacity-0'}`}>
            <div>
              <h1 className="font-poppins text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">From a Blank Page to a <span className="text-yellow-400">Confident Handshake.</span></h1>
              <p className="text-xl text-gray-400 mb-10 leading-relaxed">Don't just build a resume. Craft your story, then master telling it. ResumeCraft is the only AI platform that writes your resume, then trains you for the interview.</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/login" className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-500 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"><span>Start My Journey</span><ArrowRight className="w-5 h-5" /></Link>
              </div>
              <p className="text-gray-500 mt-4 text-sm">No credit card required. Your first resume is on us.</p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-400/10 rounded-full blur-3xl animate-pulse"></div>
              {/* **NEW IMAGE IDEA:** A visual showing a document transforming into a soundwave or person speaking */}
              <Image
                src="/images/hero-journey.png"
                alt="Visualization of a resume transforming into an interview"
                width={600}
                height={600}
                className="relative rounded-2xl transform hover:scale-105 transition-transform duration-500"
                priority
              />
            </div>
          </div>
        </section>

        {/* Stats Section - **STRATEGICALLY UPDATED** */}
        <section ref={statsRef} className={`py-20 px-6 bg-black/20 transition-all duration-700 ease-in-out ${statsEntry?.isIntersecting ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full'}`}>
          <div className="container mx-auto text-center">
            <h2 className="font-poppins text-4xl font-bold text-white mb-4">The Two Hurdles to Every Dream Job</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-12">First, you have to get past the resume bots. Then, you have to win over the humans. Most tools only solve half the problem.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="border border-gray-700/50 p-6 rounded-lg">
                <div className="text-5xl font-bold font-poppins mb-2 text-yellow-400">75%</div>
                <div className="text-gray-400">Of resumes are rejected by automated systems (ATS) before a human ever sees them.</div>
              </div>
              <div className="border border-gray-700/50 p-6 rounded-lg">
                <div className="text-5xl font-bold font-poppins mb-2 text-yellow-400">83%</div>
                <div className="text-gray-400">Of hiring managers say a poor interview can eliminate a candidate with a strong resume.</div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section - **STRATEGICALLY UPDATED** */}
        <section ref={howItWorksRef} className={`py-24 px-6 transition-all duration-700 ease-in-out ${howItWorksEntry?.isIntersecting ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}`}>
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-poppins text-4xl font-bold text-white mb-4">Your Career, <span className="text-yellow-400">Perfected in 3 Steps.</span></h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">We guide you from raw potential to interview-ready confidence.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 group/how-it-works">
              {[
                { icon: Gem, title: "Craft Your Story", description: "Our AI transforms your experience into a powerful resume that beats bots and captivates humans." },
                { icon: Mic, title: "Practice Your Delivery", description: "Step into our AI Mock Interview. It uses your new resume to ask you tough, relevant questions." },
                { icon: ClipboardCheck, title: "Receive Actionable Feedback", description: "Get instant, detailed feedback on your answers, clarity, and confidence to eliminate interview anxiety." }
              ].map((step, i) => (
                <div key={i} className="bg-gray-800/50 p-8 rounded-xl border border-gray-700/50 transition-all duration-300 hover:!opacity-100 hover:border-yellow-400/80 hover:bg-gray-800 group-hover/how-it-works:opacity-50">
                  <div className="w-16 h-16 bg-gray-900 text-yellow-400 rounded-lg flex items-center justify-center mb-6"><step.icon className="w-8 h-8" /></div>
                  <div className="text-yellow-400 font-bold text-sm mb-2">STEP {i + 1}</div>
                  <h3 className="font-poppins text-xl font-semibold text-white mb-4">{step.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section - **STRATEGICALLY UPDATED** */}
        <section ref={featuresRef} id="features" className={`py-24 px-6 bg-black/20 transition-all duration-700 ease-in-out ${featuresEntry?.isIntersecting ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full'}`}>
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-poppins text-4xl font-bold text-white mb-4">Your Unfair Advantage</h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">Intelligent tools designed to get you hired, not just noticed.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {[
                { icon: Hammer, title: "AI Resume Writer", description: "Turns your duties into achievements, using powerful action verbs and metrics to showcase your true impact." },
                { icon: Shield, title: "Beyond ATS-Friendly", description: "We don't just check boxes for bots. We craft a story that captivates human recruiters from the first sentence." },
                { icon: BotMessageSquare, title: "AI Mock Interviewer", description: "Practice with an AI that tailors questions to your resume and provides a realistic interview experience." },
                { icon: Zap, title: "Instant Performance Feedback", description: "Get immediate, private feedback on your interview answers, so you know exactly where to improve." }
              ].map((feature, i) => (
                <div key={i} className="bg-gray-800/50 p-8 rounded-xl border border-gray-700/50 flex items-start space-x-6 transition-all duration-300 hover:border-yellow-400/80 hover:bg-gray-800 hover:scale-105">
                  <div className="w-16 h-16 bg-gray-900 text-yellow-400 rounded-lg flex items-center justify-center flex-shrink-0"><feature.icon className="w-7 h-7" /></div>
                  <div>
                    <h3 className="font-poppins text-xl font-semibold text-white mb-3">{feature.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section - **STRATEGICALLY UPDATED** */}
        <section ref={testimonialsRef} id="testimonials" className={`py-24 px-6 transition-all duration-700 ease-in-out ${testimonialsEntry?.isIntersecting ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}`}>
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-poppins text-4xl font-bold text-white mb-4">From Anxious to Hired.</h2>
              <p className="text-xl text-gray-400">Our first users are already winning at both hurdles.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { name: "Jessica L.", role: "Transitioning to Tech", quote: "\"The resume got me in the door, but the interview practice is what got me the job. I walked in feeling like I had already aced it a dozen times.\"" },
                { name: "David C.", role: "Recent Graduate", quote: "\"The AI interviewer asked me questions I never would have anticipated. The feedback was brutal but necessary. It completely changed how I presented myself.\"" },
                { name: "Maria S.", role: "Senior Marketer", quote: "\"I'm confident in my experience, but I get nervous. Practicing with the AI removed all the anxiety. It's like having a secret coach in your corner.\"" }
              ].map((t, i) => (
                <div key={i} className="bg-gray-800/50 p-8 rounded-xl border border-gray-700/50 h-full flex flex-col">
                  <div className="flex text-yellow-400 mb-4">{[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-5 h-5 fill-current" />)}</div>
                  <p className="text-gray-300 leading-relaxed mb-6 flex-grow">"{t.quote}"</p>
                  <div>
                    <div className="font-semibold text-white">{t.name}</div>
                    <div className="text-sm text-gray-400">{t.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section - **STRATEGICALLY UPDATED** */}
        <section ref={pricingRef} id="pricing" className={`py-24 px-6 bg-black/20 transition-all duration-700 ease-in-out ${pricingEntry?.isIntersecting ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}`}>
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-poppins text-4xl font-bold text-white mb-4">Simple, Powerful Plans</h2>
              <p className="text-xl text-gray-400">Start for free. Upgrade to become interview-proof.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700/50 flex flex-col transition-transform duration-300 hover:scale-105">
                <div className="text-center mb-8"><h3 className="font-poppins text-2xl font-bold text-white mb-2">Resume Writer</h3><div className="text-4xl font-bold text-white mb-2">$0</div><div className="text-gray-400">Get Noticed</div></div>
                <ul className="space-y-4 mb-8 flex-grow">{["Full AI resume generation", "Access to all templates", "ATS analysis report", "Unlimited PDF downloads"].map((f, i) => <li key={i} className="flex items-start space-x-3"><CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" /><span className="text-gray-300">{f}</span></li>)}</ul>
                <Link href="/login" className="w-full block text-center border-2 border-gray-600 text-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-700 hover:text-white transition-colors">Start for Free</Link>
              </div>
              <div className="bg-gray-800 p-8 rounded-xl border-2 border-yellow-400 relative flex flex-col scale-105">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2"><span className="bg-yellow-400 text-gray-900 px-6 py-2 rounded-full text-sm font-semibold">Full Advantage</span></div>
                <div className="text-center mb-8"><h3 className="font-poppins text-2xl font-bold text-white mb-2">Interview Pro</h3><div className="text-4xl font-bold text-white mb-2">$29</div><div className="text-gray-400">Get Hired</div></div>
                <ul className="space-y-4 mb-8 flex-grow">{["Everything in Resume Writer", "AI Mock Interviewer", "Real-time performance feedback", "AI Cover Letter Writer", "Lifetime access & updates"].map((f, i) => <li key={i} className="flex items-start space-x-3"><CheckCircle className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" /><span className="text-gray-300">{f}</span></li>)}</ul>
                <button className="w-full bg-yellow-400 text-gray-900 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors">Become Interview-Proof</button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section ref={faqRef} id="faq" className={`py-24 px-6 transition-all duration-700 ease-in-out ${faqEntry?.isIntersecting ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full'}`}>
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-16">
              <h2 className="font-poppins text-4xl font-bold text-white mb-4">Your Questions, Answered.</h2>
            </div>
            <div className="space-y-4">
              {faqData.map((faq, index) => (
                <div key={index} className="bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-hidden">
                  <button className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-800/70 transition-colors" onClick={() => toggleFaq(index)}>
                    <span className="font-semibold text-white text-lg">{faq.question}</span>
                    <ChevronDown className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${faqOpen === index ? 'rotate-180 text-yellow-400' : ''}`} />
                  </button>
                  <div className={`transition-all duration-500 ease-in-out ${faqOpen === index ? 'max-h-96' : 'max-h-0'}`}>
                    <div className="px-6 pb-5 pt-2">
                      <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 px-6 text-center">
          <div className="container mx-auto">
            <h2 className="font-poppins text-5xl font-bold text-white mb-6">Ready to Own the Room?</h2>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">Your next chapter starts now. Let's build the story and the confidence to tell it.</p>
            <Link href="/login" className="bg-yellow-400 text-gray-900 px-12 py-5 rounded-lg font-bold text-xl hover:bg-yellow-500 transition-all duration-300 transform hover:scale-105 shadow-xl inline-block">Start My Journey Free</Link>
            <p className="text-gray-500 mt-4 text-sm">Takes 60 seconds. The results last a career.</p>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-16 px-6 bg-black/50 border-t border-gray-800/50">
          <div className="container mx-auto text-center text-gray-500">
            <p>© 2025 ResumeCraft. All Rights Reserved.</p>
            <p>The complete toolkit for your career journey.</p>
            <div className="flex justify-center space-x-6 mt-6">
              <a href="#" className="hover:text-yellow-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-yellow-400 transition-colors">Privacy Policy</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
