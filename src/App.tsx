import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import Footer from './components/Footer';
import SignUp from './components/auth/SignUp';
import Login from './components/auth/Login';
import ResetPassword from './components/auth/ResetPassword';
import DashboardLayout from './components/dashboard/DashboardLayout';
import Dashboard from './components/dashboard/pages/Dashboard';
import Analytics from './components/dashboard/pages/Analytics';
import ContentIdeas from './components/dashboard/pages/ContentIdeas';
import Trends from './components/dashboard/pages/Trends';
import UserProfile from './components/dashboard/pages/brand/UserProfile';
import Brand from './components/dashboard/pages/brand/Brand';
import Competitors from './components/dashboard/pages/brand/Competitors';
import Audience from './components/dashboard/pages/brand/Audience';
import ContentStrategy from './components/dashboard/pages/brand/ContentStrategy';
import SocialNetworks from './components/dashboard/pages/brand/SocialNetworks';
import Calendar from './components/dashboard/pages/Calendar';
import Settings from './components/dashboard/pages/Settings';
import Cases from './components/dashboard/pages/Cases';
import PublicCases from './components/PublicCases';
import PricingPage from './components/pages/PricingPage';
import Questionnaire from './components/questionnaire/Questionnaire';
import ContentGenerator from './components/dashboard/pages/ContentGenerator';

function App() {
  return (
    <Router>
      <Routes>
        {/* Публичные маршруты */}
        <Route path="/" element={
          <>
            <Navigation />
            <Hero />
            <Features />
            <HowItWorks />
            <Testimonials />
            <Pricing />
            <Footer />
          </>
        } />
        <Route path="/cases" element={
          <>
            <Navigation />
            <PublicCases />
            <Footer />
          </>
        } />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/questionnaire" element={<Questionnaire />} />

        {/* Защищенные маршруты панели управления */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="content-ideas" element={<ContentIdeas />} />
          <Route path="trends" element={<Trends />} />
          <Route path="brand">
            <Route path="profile" element={<UserProfile />} />
            <Route path="brand" element={<Brand />} />
            <Route path="competitors" element={<Competitors />} />
            <Route path="audience" element={<Audience />} />
            <Route path="strategy" element={<ContentStrategy />} />
            <Route path="social" element={<SocialNetworks />} />
          </Route>
          <Route path="calendar" element={<Calendar />} />
          <Route path="settings" element={<Settings />} />
          <Route path="cases" element={<Cases />} />
          <Route path="content-generator" element={<ContentGenerator />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;