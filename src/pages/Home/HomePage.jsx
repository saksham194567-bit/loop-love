import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Heart,
  ArrowRight,
  Feather,
  ShieldCheck,
  Check,
  Clock,
  Gift,
  Compass,
  Smile,
  Package,
  CheckCircle2
} from 'lucide-react';
import { InstagramIcon } from '../../components/common/Icons';
import { categories } from '../../data/categories';
import { EmptyState } from '../../components/common/EmptyState';
import api from '../../services/api';

export const HomePage = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterDone, setNewsletterDone] = useState(false);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      try {
        await api.newsletter.subscribe(newsletterEmail.trim());
      } catch (err) {
        console.warn('[HomePage] Newsletter saved locally:', err);
      }
      setNewsletterDone(true);
      setNewsletterEmail('');
    }
  };
  return (
    <div className="space-y-20 sm:space-y-28 pb-16">
      
      {/* 3. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:py-24 bg-subtle-lilac border-b border-brand-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Text column (7 cols) */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-brand-200 shadow-subtle text-xs font-medium text-brand-800">
                <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                <span>The Luxury of Slow Handmade Craft</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-mauve-deep leading-[1.15] font-normal tracking-tight">
                Every stitch holds <br className="hidden sm:inline" />
                <span className="italic font-serif text-brand-700">a little love.</span>
              </h1>

              <p className="text-base sm:text-lg text-mauve-muted max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
                Welcome to <strong>Loop &amp; Love</strong>. We craft heirloom amigurumi dolls, delicate floral charms, tactile keychains, and mindful accessories — lovingly crocheted loop by loop in India.
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/shop"
                  className="px-7 py-3.5 rounded-full bg-brand-700 hover:bg-brand-800 text-white text-sm font-medium tracking-wide shadow-subtle hover:shadow-soft transition-all flex items-center gap-2"
                >
                  <span>Explore Handcrafted Categories</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/about"
                  className="px-6 py-3.5 rounded-full bg-white hover:bg-brand-50 text-mauve-charcoal border border-brand-200 text-sm font-medium transition-colors"
                >
                  Our Craft Philosophy
                </Link>
              </div>

              {/* Artisanal Trust Badges */}
              <div className="pt-6 border-t border-brand-200/60 grid grid-cols-3 gap-4 text-center lg:text-left">
                <div>
                  <p className="font-serif text-xl sm:text-2xl font-semibold text-mauve-deep">100%</p>
                  <p className="text-[11px] text-mauve-muted uppercase tracking-wider mt-0.5">Handmade Stitches</p>
                </div>
                <div>
                  <p className="font-serif text-xl sm:text-2xl font-semibold text-mauve-deep">Zero</p>
                  <p className="text-[11px] text-mauve-muted uppercase tracking-wider mt-0.5">Machine Duplication</p>
                </div>
                <div>
                  <p className="font-serif text-xl sm:text-2xl font-semibold text-mauve-deep">Pan-India</p>
                  <p className="text-[11px] text-mauve-muted uppercase tracking-wider mt-0.5">Safe Delivery</p>
                </div>
              </div>
            </div>

            {/* Emblem & Brand Art column (5 cols) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-72 h-72 sm:w-96 sm:h-96">
                
                {/* Subtle watercolor aura behind logo */}
                <div className="absolute inset-0 bg-brand-200/40 rounded-full blur-2xl -z-10 transform scale-95" />

                {/* Primary Framed Brand Logo */}
                <div className="w-full h-full rounded-full border-4 border-white shadow-elevated overflow-hidden bg-cream-50 p-2 relative flex items-center justify-center">
                  <img
                    src="/logo.png"
                    alt="Loop & Love — Little Loops. Endless Love."
                    className="w-full h-full object-contain rounded-full"
                  />
                  
                  {/* Floating Handcrafted Pill Tag */}
                  <div className="absolute -bottom-2 bg-white border border-brand-200/80 px-4 py-2 rounded-full shadow-soft flex items-center gap-2">
                    <Heart className="w-4 h-4 text-brand-600 fill-brand-300" />
                    <span className="text-xs font-serif font-medium text-mauve-deep">
                      Little Loops. Endless Love.
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. SHORT BRAND INTRODUCTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
        <span className="text-xs font-semibold tracking-widest uppercase text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
          The Art of the Single Hook
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif text-mauve-deep font-normal leading-tight">
          Crochet is one of the rare textile crafts that machines cannot simulate.
        </h2>
        <p className="text-mauve-muted text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-light">
          Unlike knitting or industrial weaving, there is no factory machine in the world that can replicate the intricate loops of crochet. Every piece at <strong>Loop &amp; Love</strong> is formed one loop at a time by human hands, carrying patience, soul, and warm intentions.
        </p>
      </section>

      {/* 5. SHOP BY CATEGORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-brand-200 pb-5">
          <div>
            <span className="text-xs font-semibold tracking-widest uppercase text-brand-700 block mb-1">
              Curated Craft Categories
            </span>
            <h2 className="text-3xl font-serif text-mauve-deep font-medium">
              Handmade for Every Day &amp; Every Heart
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-sm font-medium text-brand-700 hover:text-brand-900 flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>Browse All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 7 Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <Link
              key={cat.id}
              to={`/shop/${cat.slug}`}
              className="group p-6 rounded-2xl bg-white border border-brand-100 hover:border-brand-300 shadow-subtle hover:shadow-soft transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-brand-400">0{idx + 1}</span>
                  <span className="text-[10px] font-medium tracking-wider uppercase px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-100">
                    Handmade
                  </span>
                </div>

                <h3 className="font-serif text-xl font-medium text-mauve-deep group-hover:text-brand-700 transition-colors">
                  {cat.name}
                </h3>

                <p className="text-xs text-mauve-muted leading-relaxed line-clamp-3">
                  {cat.description}
                </p>

                <div className="pt-2 text-[11px] text-brand-600/80 font-mono italic">
                  &ldquo;{cat.tagline}&rdquo;
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-brand-50 flex items-center justify-between text-xs font-medium text-mauve-charcoal group-hover:text-brand-700">
                <span>View Collection</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 text-brand-500" />
              </div>
            </Link>
          ))}

          {/* Custom Commission Card (8th Grid Item for symmetry) */}
          <Link
            to="/contact"
            className="group p-6 rounded-2xl bg-gradient-to-br from-brand-50 to-cream-200 border border-brand-200 shadow-subtle hover:shadow-soft transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-brand-600">CUSTOM</span>
                <Gift className="w-4 h-4 text-brand-600" />
              </div>
              <h3 className="font-serif text-xl font-medium text-mauve-deep group-hover:text-brand-700 transition-colors">
                Bespoke Commissions
              </h3>
              <p className="text-xs text-mauve-muted leading-relaxed">
                Have a dream color palette, wedding bouquet, personalized anniversary charm, or special doll in mind? We welcome custom crochet commissions.
              </p>
            </div>
            <div className="pt-6 mt-4 border-t border-brand-200/50 flex items-center justify-between text-xs font-medium text-brand-800">
              <span>Inquire on WhatsApp</span>
              <ArrowRight className="w-3.5 h-3.5 text-brand-600" />
            </div>
          </Link>
        </div>
      </section>

      {/* 6. FEATURED COLLECTION SECTION (Intentional Empty / In-Preparation State) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-brand-200 shadow-subtle">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-semibold tracking-widest uppercase text-brand-700 block mb-1">
              Curated Releases
            </span>
            <h2 className="text-3xl font-serif text-mauve-deep font-normal">
              Featured Handmade Pieces
            </h2>
            <p className="text-xs sm:text-sm text-mauve-muted mt-2">
              Small-batch pieces handcrafted with premium combed cotton yarns.
            </p>
          </div>

          {/* Minimal, beautiful empty state strictly without fake products */}
          <EmptyState
            icon={Sparkles}
            badge="Inaugural Batch in Production"
            title="Our Stitches Are In The Making"
            subtitle="To honor authentic craftsmanship, we do not showcase simulated or pre-manufactured stock. Our artisans are handcrafting our debut collection pieces right now."
            actionText="Browse Categories"
            actionLink="/shop"
            secondaryActionText="Request a Custom Creation"
            secondaryActionLink="/contact"
          />
        </div>
      </section>

      {/* 7. OUR HANDMADE PHILOSOPHY */}
      <section className="bg-brand-50/50 py-16 sm:py-20 border-y border-brand-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-semibold tracking-widest uppercase text-brand-700">
              The Loop &amp; Love Standard
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-mauve-deep font-normal">
              Our Handmade Philosophy
            </h2>
            <p className="text-sm text-mauve-muted">
              Every creation is guided by these three unwavering commitments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-brand-100 shadow-subtle space-y-3">
              <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h3 className="font-serif text-xl font-medium text-mauve-deep">
                Unrushed Time
              </h3>
              <p className="text-xs sm:text-sm text-mauve-muted leading-relaxed">
                Good things cannot be hurried. A single amigurumi doll requires hundreds of continuous stitches and hours of focused rhythm. We never cut corners for speed.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-brand-100 shadow-subtle space-y-3">
              <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center mb-4">
                <Feather className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h3 className="font-serif text-xl font-medium text-mauve-deep">
                Gentle &amp; Pure Fibers
              </h3>
              <p className="text-xs sm:text-sm text-mauve-muted leading-relaxed">
                We select premium combed milk cotton, mercerized threads, and hypoallergenic polyfill stuffing. Skin-friendly, soft to hold, and safe for all ages.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-brand-100 shadow-subtle space-y-3">
              <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 stroke-[1.5] text-brand-600 fill-brand-200" />
              </div>
              <h3 className="font-serif text-xl font-medium text-mauve-deep">
                Meaningful Gifting
              </h3>
              <p className="text-xs sm:text-sm text-mauve-muted leading-relaxed">
                Whether celebrating a birthday, a graduation, or sending quiet comfort to someone far away, a handmade crochet piece carries genuine emotional warmth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. WHY CHOOSE HANDMADE (Comparison) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-semibold tracking-widest uppercase text-brand-700">
            Artisanal Integrity
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-mauve-deep font-normal">
            Why Choose Handmade?
          </h2>
          <p className="text-sm text-mauve-muted">
            The difference between industrial mass production and thoughtful craft.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Mass Produced Side */}
          <div className="p-8 rounded-2xl bg-cream-200/50 border border-brand-200/60 space-y-4 opacity-80">
            <span className="text-xs font-medium uppercase tracking-wider text-mauve-muted">
              Mass-Manufactured Fast Goods
            </span>
            <ul className="space-y-3 text-xs sm:text-sm text-mauve-muted">
              <li className="flex items-start gap-2.5">
                <span className="text-mauve-light font-bold">&times;</span>
                <span>Automated factory output with zero human touch or personal care</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-mauve-light font-bold">&times;</span>
                <span>Cheap synthetic yarns prone to fraying and excessive shedding</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-mauve-light font-bold">&times;</span>
                <span>Disposable mindset designed to be discarded quickly</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-mauve-light font-bold">&times;</span>
                <span>Identical clone pieces without individuality or character</span>
              </li>
            </ul>
          </div>

          {/* Loop & Love Handmade Side */}
          <div className="p-8 rounded-2xl bg-white border-2 border-brand-400 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-800">
                The Loop &amp; Love Standard
              </span>
              <Sparkles className="w-4 h-4 text-brand-600" />
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-mauve-charcoal">
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Every stitch is hand-tied</strong> with focused devotion and tight tension</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Premium cotton blends</strong> that maintain tactile softness over years</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Bespoke customization:</strong> tailor colors, initials, and charm details</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Heirloom keepsakes</strong> crafted to be treasured through life&apos;s moments</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 9. BRAND STORY PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-cream-200/60 border border-brand-200/80 p-8 sm:p-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <span className="text-xs font-semibold tracking-widest uppercase text-brand-700">
              Our Journey
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-mauve-deep font-normal">
              Born from a quiet ball of yarn and a single hook.
            </h2>
            <p className="text-sm sm:text-base text-mauve-muted leading-relaxed font-light">
              Loop &amp; Love started with a simple belief: in a world moving faster by the second, things made slowly by hand carry an irreplaceable magic. When you hold one of our crochet flowers or amigurumi companions, you are holding hours of dedication, patience, and love.
            </p>
            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand-800 hover:text-brand-900"
              >
                <span>Read Our Full Story</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-center">
            <div className="p-6 rounded-2xl bg-white border border-brand-200 shadow-subtle text-center space-y-2 max-w-xs">
              <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 mx-auto flex items-center justify-center">
                <Heart className="w-5 h-5 fill-brand-300" />
              </div>
              <h4 className="font-serif text-lg font-medium text-mauve-deep">
                Handcrafted in India
              </h4>
              <p className="text-xs text-mauve-muted leading-relaxed">
                Supporting independent slow-craft and delivering heartfelt parcels to homes across India.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 10. INSTAGRAM / SOCIAL MEDIA SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-semibold tracking-widest uppercase text-brand-700 flex items-center justify-center gap-1.5">
            <InstagramIcon className="w-3.5 h-3.5" />
            <span>@loopandlove.crafts</span>
          </span>
          <h2 className="text-3xl font-serif text-mauve-deep font-normal">
            Moments From Our Craft Studio
          </h2>
          <p className="text-xs sm:text-sm text-mauve-muted">
            Behind the stitches: yarn skeins, WIP amigurumi characters, and parcels packed with love.
          </p>
        </div>

        {/* Studio Curated Grid Placeholders */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { tag: 'Yarn Selection', note: 'Soft pastel lilac & milk cotton skeins' },
            { tag: 'In The Making', note: 'Single-crochet amigurumi loops' },
            { tag: 'Botanical Stems', note: 'Handcrafted everlasting lavender blossoms' },
            { tag: 'Packed With Care', note: 'Eco-friendly wraps & handwritten cards' },
          ].map((item, index) => (
            <div
              key={index}
              className="group aspect-square rounded-2xl bg-cream-50 border border-brand-200/80 p-5 flex flex-col justify-between hover:border-brand-400 hover:shadow-soft transition-all"
            >
              <div className="flex items-center justify-between text-brand-400 text-xs">
                <span>0{index + 1}</span>
                <InstagramIcon className="w-4 h-4 text-brand-500 group-hover:scale-110 transition-transform" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-mauve-deep">{item.tag}</p>
                <p className="text-[11px] text-mauve-muted">{item.note}</p>
              </div>
              <span className="text-[10px] text-brand-600 font-mono">#LoopAndLoveCrafts</span>
            </div>
          ))}
        </div>
      </section>

      {/* 11. NEWSLETTER SUBSCRIPTION INTERFACE */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="p-8 sm:p-12 rounded-3xl bg-brand-gradient text-white text-center space-y-6 shadow-soft">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto text-brand-100">
            <Sparkles className="w-6 h-6" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <h2 className="text-3xl sm:text-4xl font-serif text-white font-normal">
              Join The Inner Stitch Circle
            </h2>
            <p className="text-brand-100 text-xs sm:text-sm leading-relaxed font-light">
              Receive private invitations when new small-batch crochet drops are completed, along with seasonal care guides and exclusive early access.
            </p>
          </div>

          {newsletterDone ? (
            <div className="p-4 rounded-full bg-white/20 backdrop-blur-md text-white text-xs sm:text-sm font-medium max-w-md mx-auto flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Welcome to the Inner Stitch Circle! You will be notified at launch.</span>
            </div>
          ) : (
            <form
              onSubmit={handleNewsletterSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-full bg-white text-mauve-charcoal placeholder-mauve-light text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-full bg-mauve-deep hover:bg-mauve-charcoal text-white text-xs sm:text-sm font-medium tracking-wide uppercase transition-colors shrink-0"
              >
                Subscribe
              </button>
            </form>
          )}

          <p className="text-[11px] text-brand-200">
            We respect your inbox. You may unsubscribe at any time.
          </p>
        </div>
      </section>

    </div>
  );
};
