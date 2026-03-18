import React from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { features } from '../../data/mockData.jsx';
import HeroSection from './sections/HeroSection.jsx';
import FeaturesSection from './sections/FeaturesSection.jsx';
import HowItWorksSection from './sections/HowItWorksSection.jsx';
import PricingSection from './sections/PricingSection.jsx';
import FooterSection from './sections/FooterSection.jsx';

export default function HomePage() {
  const { navigate } = useApp();
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="animate-fade-in">
      <HeroSection onGetStarted={() => navigate('signup')} onSeeHow={() => scrollTo('how')} />
      <FeaturesSection features={features} />
      <HowItWorksSection />
      <PricingSection onGetStarted={() => navigate('signup')} />
      <FooterSection />
    </div>
  );
}

