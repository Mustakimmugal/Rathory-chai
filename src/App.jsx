import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Footer from './components/Footer';
import AdminLayout from './components/admin/AdminLayout';
import ToastContainer from './components/ToastContainer';
import InstallPwaPrompt from './components/InstallPwaPrompt';
import LoadingScreen from './components/LoadingScreen';
import ScrollToTop from './components/ScrollToTop';
import PageTransition from './components/PageTransition';
import './App.css';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Menu = lazy(() => import('./pages/Menu'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Contact = lazy(() => import('./pages/Contact'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Login = lazy(() => import('./pages/Login'));
const Profile = lazy(() => import('./pages/Profile'));
const OrderTracking = lazy(() => import('./pages/OrderTracking'));

// Admin pages
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminProducts = lazy(() => import('./pages/admin/Products'));
const AdminOrders = lazy(() => import('./pages/admin/Orders'));
const AdminCustomers = lazy(() => import('./pages/admin/Customers'));
const AdminAnalytics = lazy(() => import('./pages/admin/Analytics'));
const AdminInventory = lazy(() => import('./pages/admin/Inventory'));
const AdminGallery = lazy(() => import('./pages/admin/GalleryMgmt'));
const AdminSettings = lazy(() => import('./pages/admin/Settings'));

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Customer Routes — wrapped in PageTransition */}
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/about" element={<PageTransition><About /></PageTransition>} />
        <Route path="/services" element={<PageTransition><Services /></PageTransition>} />
        <Route path="/menu" element={<PageTransition><Menu /></PageTransition>} />
        <Route path="/gallery" element={<PageTransition><Gallery /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
        <Route path="/cart" element={<PageTransition><Cart /></PageTransition>} />
        <Route path="/checkout" element={<PageTransition><Checkout /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
        <Route path="/track-order" element={<PageTransition><OrderTracking /></PageTransition>} />

        {/* Admin Routes — no page transition (handled by admin layout) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="inventory" element={<AdminInventory />} />
          <Route path="gallery" element={<AdminGallery />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="app">
      <ScrollToTop />
      <ToastContainer />
      <InstallPwaPrompt />

      {/* Desktop/Tablet: Top Navbar | Mobile: Hidden (replaced by BottomNav) */}
      {!isAdminRoute && <Navbar />}

      <Suspense fallback={<LoadingScreen />}>
        <AnimatedRoutes />
      </Suspense>

      {/* Footer: visible on desktop, reduced on mobile */}
      {!isAdminRoute && <Footer />}

      {/* Mobile: Floating bottom navigation bar */}
      {!isAdminRoute && <BottomNav />}
    </div>
  );
}

export default App;
