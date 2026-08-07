import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProducts } from '../../hooks/useProducts';
import { useCart } from '../../hooks/useCart';
import ProductCard from '../../components/product/ProductCard';
import toast from 'react-hot-toast';
import { 
  FaBolt, 
  FaShieldAlt, 
  FaUndo, 
  FaHeadset, 
  FaClock, 
  FaFire, 
  FaArrowRight, 
  FaChevronLeft, 
  FaChevronRight,
  FaHeadphones,
  FaLaptop,
  FaMobileAlt,
  FaGamepad,
  FaShoppingBag,
  FaPaperPlane,
  FaCheckCircle
} from 'react-icons/fa';

// Hero Slides
const HERO_SLIDES = [
  {
    id: 1,
    title: 'Next-Gen Spatial Audio',
    subtitle: 'Immerse yourself in active noise cancellation with ultra-low latency.',
    badge: 'NEW RELEASE',
    ctaText: 'Explore Audio',
    link: '/products',
    gradient: 'from-blue-600 via-indigo-600 to-purple-700',
    glowColor: 'rgba(99, 102, 241, 0.25)',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
  },
  {
    id: 2,
    title: 'Titanium Smart Tech',
    subtitle: 'Track your bio-metrics and fitness goals with 14-day battery life.',
    badge: 'BESTSELLER 2026',
    ctaText: 'Shop Wearables',
    link: '/products',
    gradient: 'from-slate-900 via-slate-800 to-indigo-950',
    glowColor: 'rgba(59, 130, 246, 0.25)',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
  },
  {
    id: 3,
    title: 'Pro Gaming Gear',
    subtitle: 'Precision mechanical switches built for competitive esports performance.',
    badge: 'LIMITED EDITION',
    ctaText: 'Discover Gear',
    link: '/products',
    gradient: 'from-violet-700 via-purple-800 to-slate-900',
    glowColor: 'rgba(168, 85, 247, 0.25)',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
  },
];

// Brand Partner Logos for Marquee
const BRAND_PARTNERS = ['SONY', 'APPLE', 'SAMSUNG', 'BOSE', 'LOGITECH', 'RAZER', 'JBL'];

// Visual Category Cards
const VISUAL_CATEGORIES = [
  {
    id: 'audio',
    title: 'Audio & Sound',
    count: '12 Items',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
    colSpan: 'sm:col-span-2 lg:col-span-1',
  },
  {
    id: 'mobile',
    title: 'Wearables & Tech',
    count: '8 Items',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
    colSpan: 'sm:col-span-1 lg:col-span-1',
  },
  {
    id: 'gaming',
    title: 'Pro Gaming Gear',
    count: '15 Items',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600',
    colSpan: 'sm:col-span-1 lg:col-span-1',
  },
];

// Category Filter Pills
const CATEGORY_PILLS = [
  { id: 'all', label: 'All Items', icon: FaShoppingBag, count: 12 },
  { id: 'audio', label: 'Audio & Sound', icon: FaHeadphones, count: 4 },
  { id: 'laptops', label: 'Computers', icon: FaLaptop, count: 3 },
  { id: 'mobile', label: 'Mobiles & Tech', icon: FaMobileAlt, count: 3 },
  { id: 'gaming', label: 'Gaming Gear', icon: FaGamepad, count: 2 },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const { addItem } = useCart();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Flash Sale Countdown State
  const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 42, seconds: 18 });

  // Auto-advance Hero Carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Flash Sale Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 0, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubscribed(true);
    toast.success('Welcome to the ShopSphere VIP Club!');
    setNewsletterEmail('');
  };

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.categoryId?.toLowerCase() === selectedCategory);

  const activeHero = HERO_SLIDES[currentSlide];

  return (
    <div className="space-y-16 pb-12">
      
      {/* 1. DYNAMIC HERO CAROUSEL BANNER */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 shadow-soft-lg">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeHero.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className={`relative flex min-h-[460px] flex-col justify-center px-8 py-12 lg:px-16 lg:py-20 bg-gradient-to-r ${activeHero.gradient}`}
          >
            {/* Background Ambient Glow */}
            <div 
              className="absolute -right-20 -top-20 h-96 w-96 rounded-full blur-3xl pointer-events-none"
              style={{ background: activeHero.glowColor }}
            />

            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
              <motion.div 
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="space-y-6 z-10 text-white"
              >
                <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-white backdrop-blur-md border border-white/20">
                  {activeHero.badge}
                </span>

                <h1 className="text-3xl font-black tracking-tight sm:text-5xl lg:text-6xl leading-tight">
                  {activeHero.title}
                </h1>

                <p className="max-w-md text-xs sm:text-sm text-slate-200/90 leading-relaxed font-normal">
                  {activeHero.subtitle}
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link
                    to={activeHero.link}
                    className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-xs font-bold text-slate-900 shadow-soft-xs hover:bg-slate-100 hover:scale-105 transition duration-200"
                  >
                    {activeHero.ctaText} <FaArrowRight className="h-3 w-3" />
                  </Link>
                  <Link
                    to="/products"
                    className="rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-xs font-bold text-white backdrop-blur-md hover:bg-white/20 transition"
                  >
                    Explore Deals
                  </Link>
                </div>
              </motion.div>

              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="relative flex justify-center z-10"
              >
                <img
                  src={activeHero.image}
                  alt={activeHero.title}
                  className="h-72 w-72 lg:h-96 lg:w-96 rounded-2xl object-cover shadow-soft-lg border border-white/20 hover:scale-105 transition-transform duration-500"
                />
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Controls */}
        <div className="absolute bottom-5 left-8 lg:left-16 z-20 flex items-center gap-3">
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md border border-white/20 hover:bg-white/30 transition"
          >
            <FaChevronLeft className="h-3 w-3" />
          </button>
          
          <div className="flex gap-1.5">
            {HERO_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentSlide === idx ? 'w-6 bg-white' : 'w-2 bg-white/40'
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md border border-white/20 hover:bg-white/30 transition"
          >
            <FaChevronRight className="h-3 w-3" />
          </button>
        </div>
      </section>


      {/* 2. TRUST & VALUE-PROPS BAR */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { icon: FaBolt, title: 'Express Delivery', desc: 'Free 2-day shipping on $100+', color: 'text-amber-500 bg-amber-50' },
          { icon: FaShieldAlt, title: 'Encrypted Payments', desc: '100% secure checkouts', color: 'text-blue-500 bg-blue-50' },
          { icon: FaUndo, title: '30-Day Easy Returns', desc: 'Hassle-free money back', color: 'text-emerald-500 bg-emerald-50' },
          { icon: FaHeadset, title: '24/7 Priority Support', desc: 'Dedicated expert team', color: 'text-purple-500 bg-purple-50' },
        ].map((prop, idx) => {
          const Icon = prop.icon;
          return (
            <div 
              key={idx} 
              className="glass-panel flex items-center gap-4 rounded-2xl p-4 shadow-soft-xs hover:shadow-soft-md transition duration-300"
            >
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${prop.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">{prop.title}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">{prop.desc}</p>
              </div>
            </div>
          );
        })}
      </section>


      {/* 3. BRAND LOGO MARQUEE STRIP */}
      <section className="glass-panel rounded-2xl py-6 px-4 shadow-soft-xs border border-slate-200/80">
        <p className="text-center text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-4">
          Trusted by Industry Leaders & Official Brand Partners
        </p>
        <div className="flex flex-wrap items-center justify-around gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-300">
          {BRAND_PARTNERS.map((brand) => (
            <span key={brand} className="text-sm font-black tracking-widest text-slate-700 hover:text-blue-600 cursor-pointer transition">
              {brand}
            </span>
          ))}
        </div>
      </section>


      {/* 4. CURATED "SHOP BY CATEGORIES" VISUAL GRID */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Shop by Lifestyle</h2>
            <p className="text-xs text-slate-500">Pick a category to jump straight to filtered gear</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {VISUAL_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => navigate('/products')}
              className={`group relative overflow-hidden rounded-3xl h-64 shadow-soft-xs hover:shadow-soft-md transition duration-300 cursor-pointer ${cat.colSpan}`}
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent p-6 flex flex-col justify-end text-white">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">{cat.count}</span>
                <h3 className="text-lg font-black">{cat.title}</h3>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>Browse Collection</span>
                  <FaArrowRight className="h-3 w-3 text-blue-400" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* 5. FLASH SALE COUNTDOWN WIDGET */}
      <section className="rounded-3xl border border-red-100 bg-gradient-to-r from-red-500/5 via-rose-500/5 to-amber-500/5 p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-red-100 pb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-500 text-white shadow-soft-xs animate-bounce">
              <FaFire className="h-5 w-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900">Flash Sale Deals</h2>
                <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-extrabold text-red-600 uppercase">
                  Limited Quantities
                </span>
              </div>
              <p className="text-xs text-slate-500">Grab these items before the countdown timer runs out!</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <FaClock className="h-4 w-4 text-red-500" />
            <span className="text-xs font-bold text-slate-600">Ends In:</span>
            <div className="flex gap-1.5 text-xs font-black text-white">
              <span className="rounded-lg bg-slate-900 px-2.5 py-1 shadow-soft-xs">
                {String(timeLeft.hours).padStart(2, '0')}h
              </span>
              <span className="text-slate-900 font-bold self-center">:</span>
              <span className="rounded-lg bg-slate-900 px-2.5 py-1 shadow-soft-xs">
                {String(timeLeft.minutes).padStart(2, '0')}m
              </span>
              <span className="text-slate-900 font-bold self-center">:</span>
              <span className="rounded-lg bg-red-600 px-2.5 py-1 shadow-soft-xs">
                {String(timeLeft.seconds).padStart(2, '0')}s
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.slice(0, 3).map((prod) => (
            <div key={prod.id} className="glass-panel rounded-2xl p-4 shadow-soft-xs flex flex-col justify-between space-y-4">
              <div className="flex gap-4">
                <img src={prod.thumbnail} alt="" className="h-20 w-20 rounded-xl object-cover bg-slate-100" />
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-wider">{prod.brand}</span>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{prod.title}</h4>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-sm font-extrabold text-red-600">${prod.discountPrice ?? prod.price}</span>
                    <span className="text-xs font-semibold text-slate-400 line-through">${prod.price}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-red-600">Hurry! Only 4 left in stock</span>
                  <span className="text-slate-400">72% Claimed</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-red-500 to-amber-500 rounded-full w-[72%]" />
                </div>
              </div>

              <button
                onClick={() => addItem(prod)}
                className="w-full rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white hover:bg-blue-600 shadow-soft-xs transition"
              >
                Claim Deal
              </button>
            </div>
          ))}
        </div>
      </section>


      {/* 6. INTERACTIVE CATEGORY PILLS & FEATURED GRID */}
      <section className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Featured Products</h2>
            <p className="text-xs text-slate-500">Filter through our high-performance product lineups</p>
          </div>

          <Link to="/products" className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline">
            View All Products <FaArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORY_PILLS.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex shrink-0 items-center gap-2.5 rounded-xl px-4 py-2.5 text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-gradient text-white shadow-soft-xs scale-105'
                    : 'glass-panel text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-white' : 'text-blue-600'}`} />
                <span>{cat.label}</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-600'
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-80 rounded-2xl bg-slate-200/60 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredProducts.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>


      {/* 7. NEWSLETTER / VIP DISCOUNT BANNER */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 sm:p-12 text-white shadow-soft-lg">
        <div className="relative z-10 mx-auto max-w-2xl text-center space-y-6">
          <span className="inline-block rounded-full bg-blue-500/20 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-widest text-blue-400 border border-blue-500/30">
            Exclusive Member Perks
          </span>

          <h2 className="text-2xl font-black sm:text-4xl">
            Join the ShopSphere VIP Club
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Subscribe to our newsletter and get <span className="font-bold text-amber-400">15% off</span> your first order, plus early access to flash sales and product drops.
          </p>

          {subscribed ? (
            <div className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 p-4 text-emerald-400 font-bold text-sm">
              <FaCheckCircle className="h-5 w-5" /> You're on the VIP list! Use promo code <span className="underline">PROMO10</span> at checkout.
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                placeholder="Enter your email address..."
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="flex-1 rounded-xl bg-white/10 px-4 py-3 text-xs text-white placeholder-slate-400 backdrop-blur-md border border-white/20 focus:border-blue-500 focus:outline-none"
              />
              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-xs font-bold text-white shadow-soft-xs hover:bg-blue-500 transition"
              >
                <span>Subscribe</span>
                <FaPaperPlane className="h-3 w-3" />
              </button>
            </form>
          )}
        </div>
      </section>

    </div>
  );
}