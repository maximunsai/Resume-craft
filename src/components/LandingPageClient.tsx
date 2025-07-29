'use client';

import React, { useState, useEffect } from 'react';
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
  ArrowRight
} from 'lucide-react';

export const LandingPageClient = () => {
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), 100);

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !sessionStorage.getItem('exitIntentShown')) {
        setShowExitIntent(true);
        sessionStorage.setItem('exitIntentShown', 'true');
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(timeout);
    };
  }, []);

  const toggleFaq = (index: number) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  const faqData = [
    { question: "What makes your resumes ATS-friendly?", answer: "Our AI analyzes thousands of successful resumes and current ATS algorithms to ensure optimal formatting, keyword placement, and structure that gets past automated screening systems with 98% success rate." },
    { question: "How does the AI forge process work?", answer: "Our master AI forge takes your raw career materials and transforms them through advanced algorithms, optimizing every word, phrase, and section for maximum impact with both ATS systems and human recruiters." },
    { question: "Is there really a free forge plan?", answer: "Yes! Our free forge plan includes multiple master templates, our standard AI engine, basic ATS optimization, and PDF download. No credit card required, no hidden fees - start forging immediately." },
    { question: "Can I customize the master templates?", answer: "Absolutely! All master templates are fully customizable. You can change sections and layout to match your personal brand and industry requirements while maintaining ATS compatibility." },
    { question: "Do you offer a money-back guarantee?", answer: "We offer a 30-day money-back guarantee on all paid forge plans. If you're not satisfied with your forged resume, we'll refund your purchase in full." }
  ];

  const landingPageTemplates = [
    { name: 'Executive', path: '/thumbnails/executive.png' },
    { name: 'Creative', path: '/thumbnails/creative.png' },
    { name: 'Technical', path: '/thumbnails/technical.png' },
    { name: 'Academic', path: '/thumbnails/academic.png' },
    { name: 'Bold', path: '/thumbnails/bold.png' },
    { name: 'Onyx', path: '/thumbnails/onyx.png' },
  ];

  return (
    <div className="font-inter bg-[#111827] text-gray-300 overflow-x-hidden">
      <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-gray-900" />
            </div>
            <span className="font-poppins font-bold text-xl text-white">ResumeCraft</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#templates" className="text-gray-400 hover:text-yellow-400 transition-colors">Templates</a>
            <a href="#features" className="text-gray-400 hover:text-yellow-400 transition-colors">Features</a>
            <a href="#pricing" className="text-gray-400 hover:text-yellow-400 transition-colors">Pricing</a>
            <a href="#testimonials" className="text-gray-400 hover:text-yellow-400 transition-colors">Reviews</a>
          </nav>
          <div className="flex items-center space-x-4">
            <Link href="/login" className="text-gray-400 hover:text-yellow-400 transition-colors">Sign In</Link>
            <Link href="/login" className="bg-yellow-400 text-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-colors">Start Forging</Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-24 px-6">
        <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className={`transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="inline-flex items-center space-x-2 bg-gray-800 text-yellow-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <BotMessageSquare className="w-4 h-4" /><span>AI-Powered Career Forge</span>
            </div>
            <h1 className="font-poppins text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">Forge Your Future<span className="text-yellow-400"> From Invisible to Unstoppable in Hours</span></h1>
            <p className="text-xl text-gray-400 mb-8 leading-relaxed">Stop letting AI robots reject your dreams. Our military-grade AI doesn't just write resumes—it engineers career breakthroughs that make Fortune 500 companies compete for YOU.
              Choose from battle-tested templates and land your dream job 3x faster.</p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link href="/login" className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-yellow-500 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"><span>Start Forging for Free</span><ArrowRight className="w-5 h-5" /></Link>
              <button className="border-2 border-gray-600 text-gray-300 px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 hover:text-white transition-colors">Watch the Forge</button>
            </div>
          </div>

          <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="absolute inset-0 bg-yellow-400/10 rounded-full blur-3xl"></div>
            <Image
              src="/hero-resume.png"
              alt="Sample AI-crafted resume"
              width={500}
              height={707}
              className="relative rounded-2xl shadow-2xl transform rotate-3 hover:rotate-1 transition-transform duration-500 border-2 border-gray-700"
              priority
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-800"><div className="container mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center"><div><div className="text-4xl font-bold font-poppins mb-2 text-white">500K+</div><div className="text-gray-400">Careers Forged</div></div><div><div className="text-4xl font-bold font-poppins mb-2 text-white">95%</div><div className="text-gray-400">Success Rate</div></div><div><div className="text-4xl font-bold font-poppins mb-2 text-white">3 min</div><div className="text-gray-400">Forge Time</div></div><div><div className="text-4xl font-bold font-poppins mb-2 text-white">150+</div><div className="text-gray-400">Countries</div></div></div></section>

      {/* How It Works Section */}
      <section className="py-24 px-6"><div className="container mx-auto"><div className="text-center mb-16"><h2 className="font-poppins text-4xl font-bold text-white mb-4">Master the 3-Step <span className="text-yellow-400">Forge Process</span></h2><p className="text-xl text-gray-400 max-w-3xl mx-auto">Our AI forge transforms raw potential into polished masterpieces through a proven 3-step process</p></div><div className="grid md:grid-cols-3 gap-8">
        <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 hover:border-yellow-400/50 transition-colors text-center"><div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-lg flex items-center justify-center mb-6 mx-auto"><FileText className="w-8 h-8" /></div><div className="text-yellow-400 font-bold text-sm mb-2">STEP 01</div><h3 className="font-poppins text-xl font-semibold text-white mb-4">Raw Materials Input</h3><p className="text-gray-400 leading-relaxed">Provide your career raw materials - experience, skills, and achievements. Our forge guides you through each element.</p></div>
        <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 hover:border-yellow-400/50 transition-colors text-center"><div className="w-16 h-16 bg-yellow-500/20 text-yellow-400 rounded-lg flex items-center justify-center mb-6 mx-auto"><BotMessageSquare className="w-8 h-8" /></div><div className="text-yellow-400 font-bold text-sm mb-2">STEP 02</div><h3 className="font-poppins text-xl font-semibold text-white mb-4">AI Forge Process</h3><p className="text-gray-400 leading-relaxed">Our AI forge heats, shapes, and tempers your content into a masterpiece that beats ATS systems.</p></div>
        <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 hover:border-yellow-400/50 transition-colors text-center"><div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-lg flex items-center justify-center mb-6 mx-auto"><Gem className="w-8 h-8" /></div><div className="text-yellow-400 font-bold text-sm mb-2">STEP 03</div><h3 className="font-poppins text-xl font-semibold text-white mb-4">Master Creation</h3><p className="text-gray-400 leading-relaxed">Receive your forged resume masterpiece - polished, powerful, and ready to conquer your dream job.</p></div>
      </div></div></section>

      {/* Templates Section */}
      <section id="templates" className="py-24 px-6 bg-gray-800"><div className="container mx-auto"><div className="text-center mb-16"><h2 className="font-poppins text-4xl font-bold text-white mb-4">Master-Crafted Templates. <span className="text-yellow-400">Forged for Victory.</span></h2><p className="text-xl text-gray-400 max-w-3xl mx-auto">Every template is forged in our AI furnace, achieving 95%+ ATS scores while commanding respect from human recruiters</p></div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
          {landingPageTemplates.map((template) => (
            <div key={template.name} className="group">
              <div className="bg-gray-700 rounded-lg shadow-lg overflow-hidden transform group-hover:-translate-y-2 transition-transform duration-300">
                <Image
                  src={template.path}
                  alt={`${template.name} resume template`}
                  width={400}
                  height={565}
                  className="w-full h-auto"
                />
              </div>
              <p className="text-center mt-3 font-semibold text-gray-300">{template.name}</p>
            </div>
          ))}
        </div>
        <div className="text-center"><Link href="/login" className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-yellow-500 transition-colors">Browse All Master Templates</Link></div></div></section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6"><div className="container mx-auto"><div className="text-center mb-16"><h2 className="font-poppins text-4xl font-bold text-white mb-4">Forge Arsenal: <span className="text-yellow-400">Tools of Victory</span></h2><p className="text-xl text-gray-400 max-w-3xl mx-auto">Master-crafted features designed to give you the competitive edge</p></div><div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 flex items-start space-x-4"><div className="w-12 h-12 bg-yellow-500/20 text-yellow-400 rounded-lg flex items-center justify-center flex-shrink-0"><Hammer className="w-6 h-6" /></div><div><h3 className="font-poppins text-xl font-semibold text-white mb-3">AI-Powered Forging</h3><p className="text-gray-400 leading-relaxed">Our advanced AI smiths craft every word, optimizing your experience for maximum impact and ATS compatibility.</p></div></div>
        <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 flex items-start space-x-4"><div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-lg flex items-center justify-center flex-shrink-0"><Shield className="w-6 h-6" /></div><div><h3 className="font-poppins text-xl font-semibold text-white mb-3">Beat the Bots</h3><p className="text-gray-400 leading-relaxed">Forge resumes with built-in ATS armor that penetrates any applicant tracking system with 98% success rate.</p></div></div>
        <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 flex items-start space-x-4"><div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-lg flex items-center justify-center flex-shrink-0"><Layers className="w-6 h-6" /></div><div><h3 className="font-poppins text-xl font-semibold text-white mb-3">Master Templates</h3><p className="text-gray-400 leading-relaxed">Choose from 50+ professionally designed templates, each forged for specific industries and career levels.</p></div></div>
        <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 flex items-start space-x-4"><div className="w-12 h-12 bg-purple-500/20 text-purple-400 rounded-lg flex items-center justify-center flex-shrink-0"><Zap className="w-6 h-6" /></div><div><h3 className="font-poppins text-xl font-semibold text-white mb-3">Lightning Fast</h3><p className="text-gray-400 leading-relaxed">Create professional resumes in just 3 minutes. Our forge process is optimized for speed without sacrificing quality.</p></div></div>
      </div></div></section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 px-6 bg-gray-800"><div className="container mx-auto"><div className="text-center mb-16"><h2 className="font-poppins text-4xl font-bold text-white mb-4">From Raw Material to <span className="text-yellow-400">Career Victory</span></h2><p className="text-xl text-gray-400">See how professionals transformed their careers with our forge</p></div><div className="grid md:grid-cols-3 gap-8">
        <div className="bg-gray-900 p-8 rounded-xl border border-gray-700"><div className="flex items-center mb-6"><div className="w-12 h-12 rounded-full bg-yellow-400 text-gray-900 flex items-center justify-center font-bold text-lg mr-4">SJ</div><div><div className="font-semibold text-white">Sarah Johnson</div><div className="text-sm text-gray-400">Product Manager at Microsoft</div></div></div><div className="flex text-yellow-400 mb-4">{[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}</div><p className="text-gray-300 leading-relaxed mb-4">"ResumeCraft transformed my career trajectory. The AI forged a resume that landed me at Microsoft - went from 2% to 85% response rate!"</p><div className="bg-gray-700 p-3 rounded text-sm text-yellow-400">Forge Result: Dream Job at Microsoft</div></div>
        <div className="bg-gray-900 p-8 rounded-xl border border-gray-700"><div className="flex items-center mb-6"><div className="w-12 h-12 rounded-full bg-yellow-400 text-gray-900 flex items-center justify-center font-bold text-lg mr-4">MC</div><div><div className="font-semibold text-white">Michael Chen</div><div className="text-sm text-gray-400">Senior Developer at Google</div></div></div><div className="flex text-yellow-400 mb-4">{[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}</div><p className="text-gray-300 leading-relaxed mb-4">"The forge process is incredible. My resume was crafted to perfection - every section polished to shine. Got 3x more interviews!"</p><div className="bg-gray-700 p-3 rounded text-sm text-yellow-400">Forge Result: 3x More Interviews</div></div>
        <div className="bg-gray-900 p-8 rounded-xl border border-gray-700"><div className="flex items-center mb-6"><div className="w-12 h-12 rounded-full bg-yellow-400 text-gray-900 flex items-center justify-center font-bold text-lg mr-4">ER</div><div><div className="font-semibold text-white">Emily Rodriguez</div><div className="text-sm text-gray-400">Marketing Director at Shopify</div></div></div><div className="flex text-yellow-400 mb-4">{[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}</div><p className="text-gray-300 leading-relaxed mb-4">"ResumeCraft didn't just build my resume - it forged my entire career path. The results speak for themselves!"</p><div className="bg-gray-700 p-3 rounded text-sm text-yellow-400">Forge Result: 40% Salary Increase</div></div>
      </div></div></section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6"><div className="container mx-auto"><div className="text-center mb-16"><h2 className="font-poppins text-4xl font-bold text-white mb-4">Choose Your Forge Plan</h2><p className="text-xl text-gray-400">Start free, upgrade when you need more power</p></div><div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div className="bg-gray-800 p-8 rounded-xl border border-gray-700"><div className="text-center mb-8"><h3 className="font-poppins text-2xl font-bold text-white mb-2">Free Forge</h3><div className="text-4xl font-bold text-white mb-2">$0</div><div className="text-gray-400">Forever free</div></div><ul className="space-y-4 mb-8">{["3 Master templates", "Basic ATS optimization", "Download PDF"].map((f, i) => <li key={i} className="flex items-center space-x-3"><CheckCircle className="w-5 h-5 text-green-500" /><span className="text-gray-300">{f}</span></li>)}</ul><Link href="/login" className="w-full block text-center border-2 border-gray-600 text-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-700 hover:text-white transition-colors">Start Free Forge</Link></div>
        <div className="bg-gray-800 p-8 rounded-xl border-2 border-yellow-400 relative"><div className="absolute -top-4 left-1/2 transform -translate-x-1/2"><span className="bg-yellow-400 text-gray-900 px-6 py-2 rounded-full text-sm font-semibold">Master's Choice</span></div><div className="text-center mb-8"><h3 className="font-poppins text-2xl font-bold text-white mb-2">Pro Forge</h3><div className="text-4xl font-bold text-white mb-2">$29</div><div className="text-gray-400">One-time payment</div></div><ul className="space-y-4 mb-8">{["50+ Master templates", "Advanced AI forging", "ATS armor protection", "Cover letter forge", "Lifetime access"].map((f, i) => <li key={i} className="flex items-center space-x-3"><CheckCircle className="w-5 h-5 text-green-500" /><span className="text-gray-300">{f}</span></li>)}</ul><button className="w-full bg-yellow-400 text-gray-900 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors">Upgrade to Pro Forge</button></div>
        <div className="bg-gray-800 p-8 rounded-xl border border-gray-700"><div className="text-center mb-8"><h3 className="font-poppins text-2xl font-bold text-white mb-2">Master Forge</h3><div className="text-4xl font-bold text-white mb-2">$99</div><div className="text-gray-400">For teams</div></div><ul className="space-y-4 mb-8">{["Everything in Pro", "Team forge management", "Priority forge support", "Custom branding"].map((f, i) => <li key={i} className="flex items-center space-x-3"><CheckCircle className="w-5 h-5 text-green-500" /><span className="text-gray-300">{f}</span></li>)}</ul><button className="w-full border-2 border-gray-600 text-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-700 hover:text-white transition-colors">Contact Forge Masters</button></div>
      </div></div></section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-6 bg-gray-800"><div className="container mx-auto max-w-4xl"><div className="text-center mb-16"><h2 className="font-poppins text-4xl font-bold text-white mb-4">Forge Frequently Asked Questions</h2><p className="text-xl text-gray-400">Everything you need to know about our career forge</p></div><div className="space-y-4">{faqData.map((faq, index) => (<div key={index} className="bg-gray-900 rounded-lg border border-gray-700"><button className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-800 transition-colors" onClick={() => toggleFaq(index)}><span className="font-semibold text-white">{faq.question}</span><ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${faqOpen === index ? 'rotate-180' : ''}`} /></button>{faqOpen === index && (<div className="px-6 pb-4"><p className="text-gray-400 leading-relaxed">{faq.answer}</p></div>)}</div>))}</div></div></section>

      {/* Trust Badges */}
      <section className="py-16 px-6"><div className="container mx-auto"><div className="text-center mb-12"><h3 className="font-poppins text-2xl font-bold text-white mb-4">Trusted by Career Champions Worldwide</h3></div><div className="flex flex-wrap justify-center items-center gap-8 opacity-60"><div className="flex items-center space-x-2"><Shield className="w-6 h-6 text-green-500" /><span className="font-semibold text-gray-400">SSL Secured Forge</span></div><div className="flex items-center space-x-2"><CreditCard className="w-6 h-6 text-blue-500" /><span className="font-semibold text-gray-400">Secure Payments</span></div><div className="flex items-center space-x-2"><Headphones className="w-6 h-6 text-purple-500" /><span className="font-semibold text-gray-400">24/7 Forge Support</span></div><div className="flex items-center space-x-2"><Award className="w-6 h-6 text-yellow-400" /><span className="font-semibold text-gray-400">30-Day Guarantee</span></div></div></div></section>

      {/* Final CTA */}
      <section className="py-24 px-6"><div className="container mx-auto text-center"><h2 className="font-poppins text-4xl font-bold text-white mb-6">Ready to Forge Your Future?</h2><p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">Your next career breakthrough starts in our AI forge. Join 500,000+ professionals who've already transformed their careers.</p><Link href="/login" className="bg-yellow-400 text-gray-900 px-12 py-4 rounded-lg font-semibold text-xl hover:bg-yellow-500 transition-all duration-300 transform hover:scale-105 shadow-xl">Enter the Forge - Free</Link><p className="text-gray-400 mt-4 text-sm">No credit card required • 3-minute setup • Instant download</p></div></section>

      {/* Footer */}
      <footer className="py-16 px-6 bg-black text-gray-400"><div className="container mx-auto"><div className="grid md:grid-cols-4 gap-8 mb-8"><div><div className="flex items-center space-x-3 mb-4"><div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center"><FileText className="w-5 h-5 text-gray-900" /></div><span className="font-poppins font-bold text-xl text-white">ResumeCraft</span></div><p className="text-gray-500">The career forge that transforms raw talent into interview-winning masterpieces.</p></div><div><h4 className="font-semibold text-white mb-4">Forge Tools</h4><ul className="space-y-2"><li><a href="#templates" className="hover:text-yellow-400 transition-colors">Master Templates</a></li><li><a href="#features" className="hover:text-yellow-400 transition-colors">AI Forge Process</a></li><li><a href="#pricing" className="hover:text-yellow-400 transition-colors">Forge Plans</a></li></ul></div><div><h4 className="font-semibold text-white mb-4">Support</h4><ul className="space-y-2"><li><a href="#" className="hover:text-yellow-400 transition-colors">Contact Masters</a></li><li><a href="#testimonials" className="hover:text-yellow-400 transition-colors">Success Stories</a></li><li><a href="#" className="hover:text-yellow-400 transition-colors">Forge Tips</a></li></ul></div><div><h4 className="font-semibold text-white mb-4">Company</h4><ul className="space-y-2"><li><a href="#" className="hover:text-yellow-400 transition-colors">About the Forge</a></li><li><a href="#" className="hover:text-yellow-400 transition-colors">Privacy</a></li><li><a href="#" className="hover:text-yellow-400 transition-colors">Terms</a></li></ul></div></div><div className="border-t border-gray-800 pt-8 text-center"><p>© 2024 ResumeCraft. All rights reserved. Forged for career champions everywhere.</p></div></div></footer>

      {/* Exit Intent Popup */}
      {showExitIntent && (<div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 transition-opacity duration-300"><div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full relative border border-gray-700 transition-transform duration-300 transform scale-95 animate-in" style={{ animationName: 'scaleIn', animationDuration: '300ms' }}><button onClick={() => setShowExitIntent(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-300"><X className="w-6 h-6" /></button><div className="text-center"><div className="w-16 h-16 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-4"><Zap className="w-8 h-8 text-yellow-400" /></div><h3 className="font-poppins text-2xl font-bold text-white mb-4">Wait! Don't Leave the Forge</h3><p className="text-gray-400 mb-6">Get 50% off your first Pro Forge plan and transform your career faster!</p><button className="w-full bg-yellow-400 text-gray-900 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors mb-4">Claim 50% Forge Discount</button><p className="text-sm text-gray-500">Limited time offer • Code: FORGE50</p></div></div></div>)}

      {/* Live Chat Widget */}
      <div className="fixed bottom-6 right-6 z-50"><button className="bg-yellow-400 text-gray-900 p-4 rounded-full shadow-lg hover:bg-yellow-500 transition-transform duration-200 hover:scale-110"><MessageSquare className="w-6 h-6" /></button></div>
    </div>
  );
};