
import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, CloudUpload, FileText, Target, Lightbulb } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Index: React.FC = () => {
  const featuresRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('opacity-0');
          entry.target.classList.add('animate-fade-up');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.reveal');
    elements.forEach(el => {
      el.classList.add('opacity-0');
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 sm:pt-36 sm:pb-24 md:pt-44 md:pb-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-blue-50 to-transparent opacity-70 z-0"></div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center space-y-6">
            <div className="inline-block animate-fade-in">
              <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
                AI-Powered Resume Analysis
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance animate-fade-up" style={{ animationDelay: '0.1s' }}>
              Land Your <span className="text-primary">Dream Job</span> with Confidence
            </h1>
            
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground animate-fade-up" style={{ animationDelay: '0.2s' }}>
              Get personalized AI feedback on your resume with precise fit scores and actionable insights tailored to specific job descriptions.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-fade-up" style={{ animationDelay: '0.3s' }}>
              <Link to="/signup">
                <Button size="lg" className="rounded-full w-full sm:w-auto px-8">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg" 
                className="rounded-full w-full sm:w-auto"
                onClick={() => featuresRef.current?.scrollIntoView({ behavior: 'smooth' })}
              >
                Learn More
              </Button>
            </div>
          </div>
          
          <div className="mt-16 relative mx-auto max-w-3xl animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/20 glass-effect">
              <div className="bg-secondary/50 w-full h-full flex items-center justify-center">
                <div className="text-center px-6">
                  <FileText size={48} className="mx-auto mb-4 text-primary" />
                  <p className="text-lg font-medium mb-2">Resume Analysis Dashboard</p>
                  <p className="text-sm text-muted-foreground">Upload your resume and get instant AI feedback</p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary/10 rounded-full blur-xl"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 reveal">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Key Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered platform provides everything you need to optimize your resume for your target job
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-border shadow-sm transition-all duration-300 hover:shadow-md reveal">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-5">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Fit Score</h3>
              <p className="text-muted-foreground">
                Get an accurate 0-100 score showing how well your resume matches specific job requirements.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-border shadow-sm transition-all duration-300 hover:shadow-md reveal" style={{ animationDelay: '0.1s' }}>
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-5">
                <Lightbulb className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Actionable Insights</h3>
              <p className="text-muted-foreground">
                Receive 4-6 specific, actionable recommendations to improve your resume for each job.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-border shadow-sm transition-all duration-300 hover:shadow-md reveal" style={{ animationDelay: '0.2s' }}>
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-5">
                <CloudUpload className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Job Posting Analysis</h3>
              <p className="text-muted-foreground">
                Simply paste a job URL, and our AI will extract and analyze the requirements automatically.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section ref={howItWorksRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 reveal">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Getting valuable feedback on your resume is quick and easy
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
            <div className="flex flex-col items-center text-center reveal">
              <div className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center mb-6 text-xl font-semibold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Upload Your Resume</h3>
              <p className="text-muted-foreground">
                Upload your current resume in PDF or Word format to our secure platform.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center reveal" style={{ animationDelay: '0.1s' }}>
              <div className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center mb-6 text-xl font-semibold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Enter Job Details</h3>
              <p className="text-muted-foreground">
                Enter a job title and description or simply paste the URL to a job posting.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center reveal" style={{ animationDelay: '0.2s' }}>
              <div className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center mb-6 text-xl font-semibold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Get AI Feedback</h3>
              <p className="text-muted-foreground">
                Receive your fit score and actionable insights to improve your resume for the specific job.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-blue-50 to-transparent opacity-70 z-0"></div>
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-border glass-effect reveal">
            <div className="text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Ready to Land Your Dream Job?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join thousands of job seekers who have optimized their resumes and improved their chances with FitFinderAI.
              </p>
              <div className="pt-4">
                <Link to="/signup">
                  <Button size="lg" className="rounded-full px-8">
                    Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
