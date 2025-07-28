import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Star, 
  ArrowRight, 
  Sparkles, 
  Zap, 
  Brain, 
  Target, 
  Shield, 
  Trophy, 
  Users,
  CheckCircle,
  ChevronDown,
  Mic,
  FileText,
  Clock,
  Award,
  Rocket,
  Eye,
  Bolt
} from 'lucide-react';

interface PulsatingCTAProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

interface FloatingResumeProps {
  delay: number;
  position: 'left' | 'right' | 'center';
  size?: 'small' | 'medium' | 'large';
}

const ResumeCraftLanding: React.FC = () => {
  const [scrollY, setScrollY] = useState<number>(0);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const FloatingParticles: React.FC = () => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full opacity-40 animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.2}s`,
            animationDuration: `${3 + Math.random() * 2}s`
          }}
        />
      ))}
    </div>
  );

  const AnimatedBackground: React.FC = () => (
    <div className="fixed inset-0 -z-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900/30 to-cyan-900/20" />
      <div 
        className="absolute inset-0 opacity-20 transition-all duration-300"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(6, 182, 212, 0.2) 0%, transparent 50%)`
        }}
      />
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>
    </div>
  );

  const FloatingResume: React.FC<FloatingResumeProps> = ({ delay = 0, position = 'left', size = 'medium' }) => {
    const sizeClasses = {
      small: 'w-48 h-64',
      medium: 'w-64 h-80',
      large: 'w-72 h-96'
    };

    const positionClasses = {
      left: 'left-4 lg:left-10',
      right: 'right-4 lg:right-10', 
      center: 'left-1/2 transform -translate-x-1/2'
    };

    return (
      <div 
        className={`absolute ${sizeClasses[size]} ${positionClasses[position]} bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-cyan-500/30 transition-all duration-1000 hover:scale-105 hover:border-cyan-400/60 hover:shadow-cyan-500/20 hover:shadow-2xl z-10 animate-pulse`}
        style={{
          transform: `translateY(${Math.sin((scrollY + delay * 1000) * 0.001) * 20}px) rotate(${position === 'left' ? -3 : position === 'right' ? 3 : 0}deg)`,
          animationDelay: `${delay}s`
        }}
      >
        <div className="p-6 h-full flex flex-col relative overflow-hidden">
          {/* Resume Header */}
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="h-3 bg-gradient-to-r from-cyan-400/30 to-blue-400/30 rounded mb-1 animate-pulse" />
              <div className="h-2 bg-slate-600/50 rounded w-2/3 animate-pulse" />
            </div>
          </div>

          {/* Resume Content Lines */}
          <div className="space-y-2 mb-4">
            <div className="h-2 bg-gradient-to-r from-slate-600/80 to-slate-600/40 rounded animate-pulse" />
            <div className="h-2 bg-slate-600/60 rounded w-4/5 animate-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="h-2 bg-slate-600/60 rounded w-3/4 animate-pulse" style={{ animationDelay: '0.4s' }} />
          </div>

          {/* Skills/Experience Blocks */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-8 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded border border-cyan-500/30 flex items-center justify-center">
                <div className="w-4 h-1 bg-cyan-400/60 rounded animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
              </div>
            ))}
          </div>

          {/* Content Lines */}
          <div className="space-y-1 flex-grow">
            {[...Array(8)].map((_, i) => (
              <div 
                key={i} 
                className="h-1.5 bg-slate-700/40 rounded animate-pulse" 
                style={{ 
                  animationDelay: `${i * 0.1}s`,
                  width: `${60 + Math.random() * 35}%`
                }} 
              />
            ))}
          </div>

          {/* Footer */}
          <div className="mt-4 flex justify-between items-center pt-2 border-t border-slate-700/30">
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
              ))}
            </div>
            <div className="text-xs text-cyan-400 font-bold bg-cyan-500/10 px-2 py-1 rounded border border-cyan-500/20">
              ATS OPTIMIZED
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-2 right-2 w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center opacity-80">
            <CheckCircle className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    );
  };

  const PulsatingCTA: React.FC<PulsatingCTAProps> = ({ children, onClick, className = "" }) => (
    <button
      onClick={onClick}
      className={`relative overflow-hidden group transition-all duration-300 ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 animate-pulse" />
      <div className="relative z-10 flex items-center justify-center space-x-2 text-white font-bold">
        {children}
      </div>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-white overflow-x-hidden relative">
      <AnimatedBackground />
      <FloatingParticles />
      
      {/* Floating Resume Backgrounds */}
      <FloatingResume delay={0} position="left" size="medium" />
      <FloatingResume delay={2} position="right" size="large" />
      <FloatingResume delay={4} position="left" size="small" />
      <FloatingResume delay={6} position="right" size="medium" />
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-900/90 backdrop-blur-xl border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="w-11 h-11 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg shadow-cyan-500/25">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                ResumeCraft
              </span>
            </div>
            
            <div className="hidden lg:flex items-center space-x-8">
              {['Features', 'Process', 'Pricing', 'Success Stories'].map((item) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase().replace(' ', '-')}`}
                  className="text-slate-300 hover:text-cyan-400 transition-all duration-300 relative group font-medium"
                >
                  {item}
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 group-hover:w-full transition-all duration-300" />
                </a>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <button className="text-slate-300 hover:text-cyan-400 transition-colors hidden lg:block font-medium">
                Sign In
              </button>
              <PulsatingCTA className="px-6 py-2.5 rounded-lg font-bold">
                Start Free Trial
              </PulsatingCTA>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-6">
        <div className="max-w-6xl mx-auto text-center relative z-20">
          <div className="mb-8 inline-block">
            <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 rounded-full px-8 py-3 text-sm font-bold text-cyan-300 backdrop-blur-sm shadow-lg shadow-cyan-500/10">
              🚀 AI-Powered Career Transformation Engine
            </div>
          </div>
          
          <h1 className="text-6xl lg:text-8xl font-black mb-8 leading-tight">
            From
            <span className="bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent animate-pulse">
              {" "}Invisible{" "}
            </span>
            to
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              {" "}Unstoppable{" "}
            </span>
            in Hours
          </h1>
          
          <p className="text-xl lg:text-2xl text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed font-medium">
            Stop letting AI robots reject your dreams. Our military-grade AI doesn't just write resumes—it engineers career breakthroughs that make Fortune 500 companies compete for YOU.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
            <PulsatingCTA className="px-14 py-5 rounded-xl text-xl font-black shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-300">
              <Rocket className="w-6 h-6" />
              <span>Revolutionize My Career</span>
            </PulsatingCTA>
            
            <button className="flex items-center space-x-3 text-cyan-400 hover:text-cyan-300 transition-colors group">
              <div className="w-14 h-14 border-2 border-cyan-400 rounded-full flex items-center justify-center group-hover:border-cyan-300 group-hover:bg-cyan-400/10 transition-all duration-300">
                <Play className="w-6 h-6 ml-1" />
              </div>
              <span className="font-bold text-lg">Watch Success Stories</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto text-sm">
            {[
              { icon: CheckCircle, text: "No credit card required", color: "text-green-400" },
              { icon: Bolt, text: "Results in 24 hours", color: "text-yellow-400" },
              { icon: Shield, text: "Fortune 500 approved", color: "text-cyan-400" }
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-center space-x-2 text-slate-400 hover:text-white transition-colors">
                <item.icon className={`w-5 h-5 ${item.color}`} />
                <span className="font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-6 bg-slate-900/60 backdrop-blur-xl border-y border-cyan-500/10 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl lg:text-6xl font-black mb-8">
              The Brutal Reality of
              <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent"> Modern Hiring</span>
            </h2>
            <p className="text-2xl text-slate-400 max-w-4xl mx-auto font-medium">
              While you're playing fair, the game has changed. Here's why 97% of job seekers fail.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                number: "6 sec", 
                label: "Average time HR spends per resume", 
                icon: Eye, 
                color: "from-red-500 to-pink-500",
                subtext: "Your entire career judged in seconds"
              },
              { 
                number: "97%", 
                label: "Of resumes killed by AI before human review", 
                icon: Target, 
                color: "from-orange-500 to-yellow-500",
                subtext: "Robots deciding your future"
              },
              { 
                number: "400+", 
                label: "Average applications per open position", 
                icon: Users, 
                color: "from-cyan-500 to-blue-500",
                subtext: "You're invisible in the crowd"
              }
            ].map((stat, i) => (
              <div key={i} className="relative group">
                <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl blur-xl`} />
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 text-center group-hover:border-cyan-500/40 transition-all duration-500 group-hover:scale-105 shadow-xl">
                  <div className={`w-20 h-20 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <stat.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-6xl font-black mb-4 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <p className="text-slate-300 text-xl font-bold mb-2">{stat.label}</p>
                  <p className="text-slate-500 text-sm font-medium">{stat.subtext}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl lg:text-6xl font-black mb-8">
              Your
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"> Arsenal of Dominance</span>
            </h2>
            <p className="text-2xl text-slate-400 max-w-4xl mx-auto font-medium">
              Weapons-grade AI technology that transforms career casualties into industry champions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[
              {
                icon: Brain,
                title: "Neural Resume Engineering",
                description: "Our AI analyzed 50M+ winning resumes to decode the exact patterns that trigger hiring decisions. Your resume becomes a psychological weapon.",
                gradient: "from-cyan-500 to-blue-600",
                features: ["99.7% ATS Pass Rate", "Psychological Trigger Words", "Industry-Specific Neural Training", "Real-Time Optimization"]
              },
              {
                icon: Zap,
                title: "AI Interview Domination",
                description: "Face an AI interviewer trained on 1M+ real interviews. It knows your resume better than you do and transforms nervous energy into commanding confidence.",
                gradient: "from-blue-500 to-indigo-600",
                features: ["Voice-Based Mock Interviews", "Confidence Scoring", "Body Language Analysis", "Weakness Elimination"]
              },
              {
                icon: Shield,
                title: "Complete Application Armor",
                description: "Cover letters, LinkedIn profiles, thank-you notes—every piece of your professional presence weaponized for maximum impact and recall.",
                gradient: "from-indigo-500 to-purple-600",
                features: ["Smart Cover Letter AI", "LinkedIn Optimization", "Personal Brand Strategy", "Follow-up Sequences"]
              },
              {
                icon: Trophy,
                title: "Success Prediction Matrix",
                description: "Know your exact chances before you apply. Our AI calculates job-match probability and reveals the hidden requirements that guarantee offers.",
                gradient: "from-yellow-500 to-orange-500",
                features: ["Job Match Scoring", "Hidden Requirements Decoder", "Application Timing AI", "Salary Negotiation Prep"]
              }
            ].map((feature, i) => (
              <div key={i} className="group relative">
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl blur-xl`} />
                <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 group-hover:border-cyan-500/40 transition-all duration-500 group-hover:scale-105 shadow-xl">
                  <div className={`w-24 h-24 bg-gradient-to-r ${feature.gradient} rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-cyan-500/20`}>
                    <feature.icon className="w-12 h-12 text-white" />
                  </div>
                  
                  <h3 className="text-3xl font-black mb-6 text-white group-hover:text-cyan-300 transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-slate-400 text-lg mb-8 leading-relaxed font-medium">
                    {feature.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {feature.features.map((item, j) => (
                      <div key={j} className="flex items-center space-x-3 bg-slate-700/30 rounded-lg p-3 border border-slate-600/30">
                        <div className={`w-2 h-2 bg-gradient-to-r ${feature.gradient} rounded-full`} />
                        <span className="text-slate-300 text-sm font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-slate-900/60 backdrop-blur-xl relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl lg:text-6xl font-black mb-8">
              Transformation Stories That
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent"> Shatter Records</span>
            </h2>
            <p className="text-2xl text-slate-400 font-medium">Real people. Explosive results. Undeniable proof.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Chen",
                role: "Software Engineer",
                company: "Meta",
                image: "👩‍💻",
                quote: "From 300+ rejections to 8 offers in 3 weeks. ResumeCraft didn't just rewrite my resume—it rewrote my destiny.",
                metrics: { before: "0 interviews in 6 months", after: "8 job offers", timeframe: "3 weeks" }
              },
              {
                name: "Marcus Rodriguez", 
                role: "Marketing Director",
                company: "Netflix",
                image: "👨‍💼",
                quote: "The AI interview prep was like having a Fortune 500 CEO as my personal coach. I dominated every single interview.",
                metrics: { before: "2 years unemployed", after: "$220K salary", timeframe: "1 month" }
              },
              {
                name: "Emily Foster",
                role: "Data Scientist", 
                company: "Tesla",
                image: "👩‍🔬",
                quote: "At 47, I thought my tech career was over. ResumeCraft proved that experience + the right story = unstoppable.",
                metrics: { before: "Career stagnant", after: "Senior Data Scientist", timeframe: "4 weeks" }
              }
            ].map((testimonial, i) => (
              <div key={i} className="group relative">
                <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 group-hover:border-cyan-500/30 transition-all duration-500 group-hover:scale-105 shadow-xl">
                  <div className="flex items-center mb-6">
                    <div className="text-4xl mr-4">{testimonial.image}</div>
                    <div>
                      <h4 className="font-bold text-lg text-white">{testimonial.name}</h4>
                      <p className="text-cyan-400 font-medium">{testimonial.role}</p>
                      <p className="text-sm text-slate-500">{testimonial.company}</p>
                    </div>
                  </div>
                  
                  <div className="flex text-yellow-400 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  
                  <p className="text-slate-300 text-lg mb-6 leading-relaxed italic font-medium">
                    "{testimonial.quote}"
                  </p>
                  
                  <div className="grid grid-cols-1 gap-4 pt-4 border-t border-slate-700/30">
                    <div className="text-center">
                      <div className="text-red-400 font-bold text-sm">{testimonial.metrics.before}</div>
                      <div className="text-xs text-slate-500 mb-2">Before</div>
                      <ArrowRight className="w-4 h-4 text-slate-500 mx-auto mb-2" />
                      <div className="text-green-400 font-bold text-sm">{testimonial.metrics.after}</div>
                      <div className="text-xs text-slate-500">After ({testimonial.metrics.timeframe})</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl lg:text-6xl font-black mb-8">
              Choose Your
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent"> Victory Plan</span>
            </h2>
            <p className="text-2xl text-slate-400 font-medium">Investment in your future starts at the price of a coffee.</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Starter",
                price: "Free",
                description: "Perfect for testing the waters",
                features: ["AI Resume Builder", "Basic Templates", "ATS Optimization", "PDF Export"],
                cta: "Start Free",
                popular: false
              },
              {
                name: "Professional", 
                price: "$29",
                period: "/month",
                description: "For serious job seekers", 
                features: ["Everything in Starter", "AI Interview Prep", "Advanced Analytics", "Cover Letters", "LinkedIn Optimization", "Priority Support"],
                cta: "Get Hired Faster",
                popular: true
              },
              {
                name: "Executive",
                price: "$99", 
                period: "/month",
                description: "For C-level ambitions",
                features: ["Everything in Professional", "Personal Brand Strategy", "Executive Coach Access", "Salary Negotiation Prep", "1-on-1 Consultations"],
                cta: "Dominate Interviews",
                popular: false
              }
            ].map((plan, i) => (
              <div key={i} className={`relative group ${plan.popular ? 'scale-105 z-10' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-2 rounded-full shadow-lg">
                    <span className="text-white font-bold text-sm">MOST POPULAR</span>
                  </div>
                )}
                
                <div className={`bg-slate-800/50 backdrop-blur-xl border rounded-3xl p-8 transition-all duration-500 group-hover:scale-105 shadow-xl ${
                  plan.popular ? 'border-cyan-500/50 bg-gradient-to-br from-cyan-900/20 to-blue-900/20' : 'border-slate-700/50 group-hover:border-cyan-500/30'
                }`}>
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-black text-white mb-2">{plan.name}</h3>
                    <div className="mb-2">
                      <span className="text-5xl font-black text-white">{plan.price}</span>
                      {plan.period && <span className="text-slate-400">{plan.period}</span>}
                    </div>
                    <p className="text-slate-400">{plan.description}</p>
                  </div>
                  
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                        <span className="text-slate-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <PulsatingCTA className={`w-full py-4 rounded-xl text-lg font-bold ${
                    plan.popular ? 'bg-gradient-to-r from-cyan-500 to-blue-500' : ''
                  }`}>
                    {plan.cta}
                  </PulsatingCTA>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-slate-400 mb-4">🔒 30-day money-back guarantee • 🚀 Instant access • 💳 No setup fees</p>
            <div className="flex items-center justify-center space-x-6 text-sm text-slate-500">
              <span>✓ Cancel anytime</span>
              <span>✓ Secure payment</span>
              <span>✓ 24/7 support</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-6 bg-slate-900/60 backdrop-blur-xl relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black mb-8">
              Questions That
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"> Keep You Up</span>
            </h2>
            <p className="text-xl text-slate-400">We've got answers that put you to sleep (peacefully).</p>
          </div>
          
          <div className="space-y-4">
            {[
              {
                question: "How is this different from ChatGPT or other AI tools?", 
                answer: "While ChatGPT gives generic advice, our AI is trained specifically on millions of successful resumes and hiring patterns. It knows what actually gets people hired in your industry, not just what sounds good."
              },
              {
                question: "Will this work for someone changing careers?",
                answer: "Absolutely. Our AI specializes in translating transferable skills and highlighting relevant experience. Career changers see some of our best results because we help them tell their story in a way that makes sense to new industries."
              },
              {
                question: "How realistic is the AI interview practice?",
                answer: "Scary realistic. Our AI interviewer is trained on thousands of real interview scenarios and adapts its questions based on your resume and target role. Users often say it's harder than their actual interviews."
              },
              {
                question: "What if I'm not tech-savvy?",
                answer: "You don't need to be. Our interface is designed for humans, not engineers. If you can send an email, you can master ResumeCraft. Plus, our support team is obsessed with helping you succeed."
              },
              {
                question: "How quickly will I see results?",
                answer: "Most users see immediate improvements in their application response rates. The average user gets their first interview within 2 weeks of using their new resume. Some see results in days."
              }
            ].map((faq, i) => (
              <div key={i} className="bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden hover:border-cyan-500/30 transition-all duration-300">
                <button
                  className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-slate-800/50 transition-colors"
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                >
                  <span className="text-lg font-semibold text-white">{faq.question}</span>
                  <ChevronDown className={`w-6 h-6 text-cyan-400 transition-transform duration-300 ${
                    faqOpen === i ? 'rotate-180' : ''
                  }`} />
                </button>
                <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
                  faqOpen === i ? 'max-h-96' : 'max-h-0'
                }`}>
                  <div className="px-8 pb-6">
                    <p className="text-slate-400 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/20 via-blue-900/20 to-indigo-900/20 backdrop-blur-3xl" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h2 className="text-6xl lg:text-7xl font-black mb-8 leading-tight">
            Stop Hoping.
            <br />
            <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
              Start Dominating.
            </span>
          </h2>
          
          <p className="text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
            Every day you wait is another day your dream job goes to someone else. 
            Your competition is already using AI. It's time to level the playing field.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-y-0 sm:space-x-8 mb-12">
            <PulsatingCTA className="px-16 py-6 rounded-2xl text-2xl font-black shadow-2xl shadow-cyan-500/40 hover:shadow-cyan-500/60 transition-all duration-300">
              <Rocket className="w-6 h-6" />
              <span>Transform My Career Now</span>
            </PulsatingCTA>
            
            <div className="text-center">
              <div className="text-sm text-slate-500 mb-2">Join 50,000+ success stories</div>
              <div className="flex items-center justify-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
                <span className="ml-2 text-sm text-slate-400">4.9/5 rating</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: Clock, text: "Results in 2 weeks or money back" },
              { icon: Shield, text: "Enterprise-grade security & privacy" }, 
              { icon: Award, text: "Trusted by Fortune 500 employees" }
            ].map((guarantee, i) => (
              <div key={i} className="flex items-center justify-center space-x-3 text-slate-400">
                <guarantee.icon className="w-5 h-5 text-cyan-400" />
                <span className="font-medium">{guarantee.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 bg-slate-900/90 backdrop-blur-xl border-t border-slate-800/50 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  ResumeCraft
                </span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                The AI-powered career platform that transforms job seekers into job winners.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-cyan-400 transition-colors">AI Resume Builder</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Interview Practice</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Cover Letters</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">LinkedIn Optimizer</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-cyan-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Success Stories</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Press</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800/50 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-slate-500 text-sm">
              © 2025 ResumeCraft. All rights reserved. Built with 💙 for job seekers everywhere.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-slate-500 hover:text-cyan-400 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="text-slate-500 hover:text-cyan-400 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ResumeCraftLanding;