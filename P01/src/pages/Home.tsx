import { ArrowRight, Shield, Lock, Eye, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export function Home() {
  const features = [
    {
      icon: Shield,
      title: 'Immutability',
      description: 'Records stored on blockchain cannot be altered once verified',
    },
    {
      icon: Lock,
      title: 'Security',
      description: 'Military-grade encryption protects all personal data',
    },
    {
      icon: Eye,
      title: 'Transparency',
      description: 'Every change is logged and verifiable on the blockchain',
    },
    {
      icon: CheckCircle,
      title: 'Auditability',
      description: 'Complete audit trails for compliance and verification',
    },
  ];

  const stats = [
    { label: 'Total Records', value: '15,234' },
    { label: 'Verified Documents', value: '14,892' },
    { label: 'Active Authorities', value: '42' },
    { label: 'Verification Rate', value: '97.8%' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-white via-white to-orange-50/80">
      {/* Navigation - white strip, dark logo, black CTA */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/95">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-semibold text-foreground lowercase tracking-tight">blockrecords</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition">
              Features
            </a>
            <a href="#stats" className="text-sm text-muted-foreground hover:text-foreground transition">
              Process
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground font-medium">
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button className="rounded-md bg-neutral-900 hover:bg-neutral-800 text-white font-medium px-5">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section - left aligned, gradient bg */}
      <section className="container mx-auto max-w-7xl px-4 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl space-y-6 mb-12"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            The smartest way to manage records
          </p>
          <h1 className="text-heading-1 leading-[1.05] text-left">
            <span className="block text-foreground">Government Records</span>
            <span className="block bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 bg-clip-text text-transparent drop-shadow-sm" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>on the Blockchain</span>
          </h1>
          <p className="text-base text-muted-foreground max-w-xl">
            A modern, secure public records management system ensuring transparency,
            immutability, and auditability of government documents through blockchain
            technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Link to="/register?role=citizen">
              <Button size="lg" className="gap-2 rounded-md text-base font-semibold px-6 bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 hover:from-orange-600 hover:via-orange-700 hover:to-red-600 text-white border-0 shadow-md">
                Citizen Login <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/register?role=authority">
              <Button size="lg" variant="outline" className="gap-2 rounded-md text-base font-medium px-6 bg-white border border-gray-200 text-foreground hover:bg-gray-50">
                Authority Login
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Scrolling Ticker */}
        <div className="ticker-wrap border-y border-gray-200 py-4 mb-16 bg-white/50">
          <div className="ticker-content">
            {[...Array(2)].map((_, i) => (
              <span key={i} className="inline-flex items-center shrink-0">
                <span className="text-sm font-semibold text-muted-foreground mx-6">SECURE</span>
                <span className="text-primary mx-2">✦</span>
                <span className="text-sm font-semibold text-muted-foreground mx-6">IMMUTABLE</span>
                <span className="text-primary mx-2">✦</span>
                <span className="text-sm font-semibold text-muted-foreground mx-6">VERIFIED</span>
                <span className="text-primary mx-2">✦</span>
                <span className="text-sm font-semibold text-muted-foreground mx-6">TRANSPARENT</span>
                <span className="text-primary mx-2">✦</span>
                <span className="text-sm font-semibold text-muted-foreground mx-6">BLOCKCHAIN</span>
                <span className="text-primary mx-2">✦</span>
                <span className="text-sm font-semibold text-muted-foreground mx-6">AUDITABLE</span>
                <span className="text-primary mx-2">✦</span>
              </span>
            ))}
          </div>
        </div>

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-white border border-gray-200 rounded-xl p-6 text-center mb-20 shadow-sm"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="h-5 w-5 text-orange-600" />
            <span className="font-semibold">Secured by Blockchain</span>
            <Shield className="h-5 w-5 text-orange-600" />
          </div>
          <p className="text-sm text-muted-foreground">
            HTTPS encrypted • Government Grade Security • ISO 27001 Compliant
          </p>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto max-w-7xl px-4 py-20">
        <h2 className="text-heading-2 text-center mb-4">Key Features</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">Built for trust and transparency</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
              >
                <Card className="rounded-xl border border-gray-200 bg-white shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-14 h-14 rounded-xl bg-orange-50 flex items-center justify-center mb-4">
                      <Icon className="h-7 w-7 text-orange-600" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Numbered Steps Section */}
      <section className="container mx-auto max-w-7xl px-4 py-20">
        <h2 className="text-heading-2 text-center mb-2">THREE STEPS.</h2>
        <h2 className="text-heading-2 text-center mb-12 text-orange-600">ZERO FRICTION.</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <span className="text-5xl font-extrabold text-orange-300 block mb-4">01</span>
            <h3 className="text-xl font-bold mb-2">Register & Verify</h3>
            <p className="text-muted-foreground">Create your account and complete identity verification.</p>
          </div>
          <div className="text-center">
            <span className="text-5xl font-extrabold text-orange-300 block mb-4">02</span>
            <h3 className="text-xl font-bold mb-2">Submit Records</h3>
            <p className="text-muted-foreground">Upload documents for blockchain verification.</p>
          </div>
          <div className="text-center">
            <span className="text-5xl font-extrabold text-orange-300 block mb-4">03</span>
            <h3 className="text-xl font-bold mb-2">Access Anytime</h3>
            <p className="text-muted-foreground">View, share, and verify your records instantly.</p>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section id="stats" className="container mx-auto max-w-7xl px-4 py-20">
        <h2 className="text-heading-2 text-center mb-12">Our Impact</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="bg-white border border-gray-200 rounded-xl p-8 text-center shadow-md"
            >
              <p className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">
                {stat.value}
              </p>
              <p className="text-muted-foreground text-sm font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto max-w-7xl px-4 py-20">
        <Card className="bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 text-white rounded-xl overflow-hidden shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-white text-heading-2">
              Ready to get started?
            </CardTitle>
            <CardDescription className="text-white/90 text-base">
              Join thousands of citizens and authorities using BlockRecords
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4 justify-center">
            <Link to="/register">
              <Button variant="secondary" size="lg" className="rounded-xl font-semibold">
                Create Account
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="rounded-md border-white/50 text-white hover:bg-white/20 hover:text-white bg-transparent">
              Learn More
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50/50 mt-20">
        <div className="container mx-auto max-w-7xl px-4 py-12">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2025 BlockRecords. All rights reserved. Secured by blockchain technology.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
