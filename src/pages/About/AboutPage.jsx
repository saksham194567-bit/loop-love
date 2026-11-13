import React from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  Sparkles,
  Feather,
  Clock,
  ShieldCheck,
  ArrowRight,
  Gift,
  Smile
} from 'lucide-react';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';

export const AboutPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 space-y-16 sm:space-y-24">
      
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: 'Our Story & Philosophy' }]} />

      {/* Hero Header */}
      <section className="text-center max-w-3xl mx-auto space-y-4 pt-4">
        <span className="text-xs font-semibold tracking-widest uppercase text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
          The Loop &amp; Love Origin
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-mauve-deep font-normal leading-[1.15]">
          Where patience meets yarn, <br />
          <span className="italic text-brand-700">and every stitch holds love.</span>
        </h1>
        <p className="text-base sm:text-lg text-mauve-muted leading-relaxed font-light">
          An independent handmade boutique born from a quiet obsession with yarn textures, soft pastel palettes, and the enduring magic of things made slowly by hand.
        </p>
      </section>

      {/* Emblem & Editorial Quote Banner */}
      <section className="rounded-3xl bg-cream-200/60 border border-brand-200/80 p-8 sm:p-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-full border-4 border-white shadow-elevated overflow-hidden bg-cream-50 p-2">
            <img
              src="/logo.png"
              alt="Loop & Love Emblem"
              className="w-full h-full object-contain rounded-full"
            />
          </div>
        </div>

        <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
          <span className="text-xs font-serif italic text-brand-700 uppercase tracking-widest">
            A Gentle Truth
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-mauve-deep leading-snug">
            &ldquo;There is no machine in the modern world that can crochet. Every loop you see was drawn by human fingers.&rdquo;
          </h2>
          <p className="text-xs sm:text-sm text-mauve-muted leading-relaxed font-light">
            While industrial looms can knit sweaters and weave fabrics at dizzying speed, crochet requires a continuous, singular chain of interlocking loops with variable manual tension. It remains one of the last pure artisan arts that factory automation cannot replicate.
          </p>
        </div>
      </section>

      {/* 3 Core Pillars */}
      <section className="space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-semibold tracking-widest uppercase text-brand-700">
            Guiding Principles
          </span>
          <h2 className="text-3xl font-serif text-mauve-deep font-normal">
            What Drives Our Craft
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-brand-200/80 shadow-subtle space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-700 mb-4">
              <Clock className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h3 className="font-serif text-xl font-medium text-mauve-deep">
              The Luxury of Slowness
            </h3>
            <p className="text-xs sm:text-sm text-mauve-muted leading-relaxed">
              In a culture that prioritizes instant gratification, we choose the rhythm of the slow craft. We believe the time spent breathing life into an amigurumi doll or a floral stem is woven directly into its essence.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-brand-200/80 shadow-subtle space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-700 mb-4">
              <Feather className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h3 className="font-serif text-xl font-medium text-mauve-deep">
              Mindful Fibers &amp; Care
            </h3>
            <p className="text-xs sm:text-sm text-mauve-muted leading-relaxed">
              We exclusively use soft combed cottons, mercerized blends, and hypoallergenic stuffing. We test tension meticulously so keychains resist daily wear and dolls remain cuddly without losing form.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-brand-200/80 shadow-subtle space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-700 mb-4">
              <Gift className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h3 className="font-serif text-xl font-medium text-mauve-deep">
              Heirloom Gifting
            </h3>
            <p className="text-xs sm:text-sm text-mauve-muted leading-relaxed">
              Every parcel leaving our studio is packaged as a ready gift. Wrapped in eco-conscious paper with a handwritten note, our pieces are created to mark milestones, friendships, and quiet personal celebrations.
            </p>
          </div>
        </div>
      </section>

      {/* Editable Founder / Atelier Note (Strictly without fabricated biography) */}
      <section className="max-w-3xl mx-auto bg-white rounded-3xl border-2 border-dashed border-brand-200 p-8 sm:p-12 space-y-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-800">
          <Heart className="w-4 h-4 text-brand-600 fill-brand-200" />
          <span>A Note From The Studio [Editable Section]</span>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-mauve-charcoal leading-relaxed font-light">
          <p>
            &ldquo;When I pick up my crochet hook, the rest of the world goes quiet. What begins as a single strand of yarn slowly curls, loops, and blossoms into a companion that might sit on someone’s desk for the next ten years.&rdquo;
          </p>
          <p className="text-mauve-muted">
            <em>[FOUNDER BIOGRAPHY PLACEHOLDER: The founder may replace this paragraph with their personal backstory, city of origin, and personal inspiration for founding Loop &amp; Love before official business launch.]</em>
          </p>
        </div>

        <div className="pt-4 border-t border-brand-100 flex items-center justify-between text-xs text-mauve-muted">
          <span className="font-serif italic text-base text-mauve-deep">Loop &amp; Love Atelier</span>
          <span>Handmade in India &bull; Little Loops. Endless Love.</span>
        </div>
      </section>

      {/* CTA to Shop */}
      <section className="text-center space-y-4 pt-4">
        <h3 className="font-serif text-3xl font-normal text-mauve-deep">
          Ready to discover our creations?
        </h3>
        <p className="text-xs sm:text-sm text-mauve-muted max-w-md mx-auto">
          Explore our handmade categories or reach out for custom orders and special colorways.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to="/shop"
            className="px-7 py-3.5 rounded-full bg-brand-700 hover:bg-brand-800 text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-subtle"
          >
            Explore Handcrafted Categories
          </Link>
          <Link
            to="/contact"
            className="px-6 py-3.5 rounded-full bg-white hover:bg-brand-50 text-mauve-charcoal border border-brand-200 text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            Custom Inquiries
          </Link>
        </div>
      </section>

    </div>
  );
};

