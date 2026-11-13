import React, { useState } from 'react';
import {
  MessageCircle,
  Mail,
  Send,
  MapPin,
  Clock,
  ChevronDown,
  HelpCircle,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { InstagramIcon } from '../../components/common/Icons';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import api from '../../services/api';

export const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    categoryInterest: 'custom_amigurumi',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await api.contact.submit(formData);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        categoryInterest: 'custom_amigurumi',
        message: ''
      });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError(err.message || 'Unable to submit your message right now.');
    } finally {
      setSubmitting(false);
    }
  };

  const faqs = [
    {
      q: 'How long does a handmade crochet order take to make?',
      a: 'Since each piece is hand-stitched loop by loop, our standard handcrafting time is 3 to 7 business days before dispatch, depending on item complexity and current order queue. Bulk wedding gifts or elaborate custom dolls may require additional crafting days.'
    },
    {
      q: 'Do you ship all across India?',
      a: 'Yes, Loop & Love ships to serviceable pin codes throughout India. Metro delivery typically arrives within 3 to 5 business days post-dispatch, while other regions take 5 to 8 business days.'
    },
    {
      q: 'Can I request a custom color palette or initials on keychains?',
      a: 'Absolutely! Custom colors and personalized initials are our specialty. You can write your preference in the inquiry form or message our team directly on WhatsApp with your inspiration photos.'
    },
    {
      q: 'How do I care for and clean my handmade crochet piece?',
      a: 'Spot clean gently using cool water and mild wool soap. Never machine-wash, wring, or tumble-dry. Reshape gently while damp and allow to air dry flat in shade. Detailed care cards are included inside every parcel.'
    },
    {
      q: 'Do you accept bulk orders for bridal showers, birthdays, or corporate gifting?',
      a: 'Yes! We love crafting custom keepsake batches for celebrations. Please reach out at least 3 to 4 weeks prior to your event date for custom bulk scheduling and pricing.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 space-y-16">
      
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: 'Contact & Custom Orders' }]} />

      <div className="text-center max-w-xl mx-auto space-y-3 pt-2">
        <span className="text-xs font-semibold tracking-widest uppercase text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
          We&apos;re Here to Help
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-mauve-deep font-normal">
          Get in Touch With Us
        </h1>
        <p className="text-xs sm:text-sm text-mauve-muted font-light leading-relaxed">
          Have a question about a design, custom colorways, wedding favors, or order updates? We would love to chat.
        </p>
      </div>

      {/* Main Grid: Form (7 cols) + Contact Cards (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Contact Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-brand-200 p-6 sm:p-10 shadow-subtle space-y-6">
          <div className="space-y-1">
            <h2 className="font-serif text-2xl font-medium text-mauve-deep">
              Send a Message
            </h2>
            <p className="text-xs text-mauve-muted">
              We respond to inquiries within 24 hours on business days.
            </p>
          </div>

          {submitted ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="font-serif text-xl font-medium text-emerald-900">
                Message Received!
              </h3>
              <p className="text-xs text-emerald-800 leading-relaxed max-w-sm mx-auto">
                Thank you for reaching out to Loop &amp; Love. Our artisan team will reply to your email or WhatsApp promptly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-mauve-charcoal mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Meera Patel"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-cream-50 border border-brand-200 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-mauve-charcoal mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-cream-50 border border-brand-200 focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-mauve-charcoal mb-1">
                    WhatsApp Number (Optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-cream-50 border border-brand-200 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-mauve-charcoal mb-1">
                    Inquiry Topic
                  </label>
                  <select
                    value={formData.categoryInterest}
                    onChange={(e) => setFormData({ ...formData, categoryInterest: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-cream-50 border border-brand-200 focus:outline-none focus:border-brand-500"
                  >
                    <option value="custom_amigurumi">Custom Doll / Character</option>
                    <option value="custom_flowers">Everlasting Bouquet / Flowers</option>
                    <option value="keychains">Keychains &amp; Bag Charms</option>
                    <option value="bulk_gifting">Bulk Celebration Gifting</option>
                    <option value="order_query">Existing Order Status</option>
                    <option value="other">General Inquiry</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-mauve-charcoal mb-1">
                  How can we help? *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tell us about the design, colors, or questions you have..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full text-xs p-3.5 rounded-xl bg-cream-50 border border-brand-200 focus:outline-none focus:border-brand-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-full bg-brand-700 hover:bg-brand-800 text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-subtle hover:shadow-soft transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Send Artisan Message</span>
              </button>
            </form>
          )}
        </div>

        {/* Contact Info Channels (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* WhatsApp Card */}
          <div className="p-6 rounded-3xl bg-white border border-brand-200 shadow-subtle space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-medium text-mauve-deep">
                  WhatsApp Direct Chat
                </h3>
                <span className="text-[11px] text-mauve-muted">Instant mobile support</span>
              </div>
            </div>
            <p className="text-xs text-mauve-muted leading-relaxed">
              For quick customization photos, color swatch reviews, and faster responses, chat directly with our studio artisans.
            </p>
            <div className="pt-1">
              <a
                href="https://whatsapp.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-800 hover:text-emerald-950 underline"
              >
                <span>[PLACEHOLDER: +91 WhatsApp Number]</span>
                <span>&rarr;</span>
              </a>
            </div>
          </div>

          {/* Email Support Card */}
          <div className="p-6 rounded-3xl bg-white border border-brand-200 shadow-subtle space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-medium text-mauve-deep">
                  Email Support
                </h3>
                <span className="text-[11px] text-mauve-muted">Formal quotes &amp; orders</span>
              </div>
            </div>
            <p className="text-xs text-mauve-muted leading-relaxed">
              Send us detailed moodboards, event schedules, or collaboration inquiries.
            </p>
            <div className="pt-1">
              <a
                href="mailto:care@loopandlove.in"
                className="inline-flex items-center gap-2 text-xs font-semibold text-brand-800 hover:text-brand-950 underline"
              >
                <span>[PLACEHOLDER: care@loopandlove.in]</span>
                <span>&rarr;</span>
              </a>
            </div>
          </div>

          {/* Social Media Card */}
          <div className="p-6 rounded-3xl bg-white border border-brand-200 shadow-subtle space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center">
                <InstagramIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-medium text-mauve-deep">
                  Instagram Atelier
                </h3>
                <span className="text-[11px] text-mauve-muted">WIP clips &amp; drops</span>
              </div>
            </div>
            <p className="text-xs text-mauve-muted leading-relaxed">
              Follow our daily loops, yarn dyeing experiments, and behind-the-scenes handcrafting.
            </p>
            <div className="pt-1">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold text-purple-800 hover:text-purple-950 underline"
              >
                <span>[PLACEHOLDER: @loopandlove.crafts]</span>
                <span>&rarr;</span>
              </a>
            </div>
          </div>

        </div>

      </div>

      {/* Frequently Asked Questions Accordion */}
      <div className="pt-10 border-t border-brand-200 max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-semibold tracking-widest uppercase text-brand-700">
            Frequently Asked Questions
          </span>
          <h2 className="text-3xl font-serif text-mauve-deep font-normal">
            Everything You Need to Know
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-brand-200/80 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-serif text-base sm:text-lg font-medium text-mauve-deep hover:text-brand-700 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-brand-500 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-0 text-xs sm:text-sm text-mauve-muted leading-relaxed font-light border-t border-brand-50">
                    <p className="pt-3">{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
