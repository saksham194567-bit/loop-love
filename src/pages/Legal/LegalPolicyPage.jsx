import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { AlertCircle, FileText, ArrowLeft, ShieldAlert } from 'lucide-react';
import { legalPolicies } from '../../data/legalPolicies';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';

export const LegalPolicyPage = () => {
  const { policyType } = useParams();
  const policy = legalPolicies[policyType];

  if (!policy) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-3xl text-mauve-deep">Policy Document Not Found</h2>
        <p className="text-xs text-mauve-muted">Please select an available policy from the footer links.</p>
        <Link to="/" className="text-xs font-semibold text-brand-700 underline">Return to Home</Link>
      </div>
    );
  }

  const allPolicyLinks = [
    { slug: 'privacy', label: 'Privacy Policy' },
    { slug: 'terms', label: 'Terms of Service' },
    { slug: 'shipping', label: 'Shipping & Delivery' },
    { slug: 'returns-refunds', label: 'Returns & Refunds' },
    { slug: 'cancellation', label: 'Cancellation Policy' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 space-y-8">
      
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Policies' },
          { label: policy.title }
        ]}
      />

      {/* Strict Development Stage Legal Disclaimer */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold block mb-0.5">Template Preparation Notice — Not Legal Advice:</strong>
          This document is a design and operational preparation template for Loop &amp; Love. Business registration numbers, entity details, and exact timelines are marked as <code>[PLACEHOLDER]</code> for review by the business owner and legal counsel prior to commercial launch.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Policy Navigation Sidebar (3 cols) */}
        <aside className="lg:col-span-3 bg-white rounded-3xl border border-brand-200 p-4 shadow-subtle space-y-1 sticky top-28">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-mauve-muted px-3 py-2 block">
            Store Policies
          </span>
          {allPolicyLinks.map((p) => (
            <Link
              key={p.slug}
              to={`/policies/${p.slug}`}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                policyType === p.slug
                  ? 'bg-brand-700 text-white shadow-subtle'
                  : 'text-mauve-charcoal hover:bg-cream-100 hover:text-brand-800'
              }`}
            >
              <span>{p.label}</span>
              <FileText className="w-3.5 h-3.5 opacity-70" />
            </Link>
          ))}
        </aside>

        {/* Main Content Body (9 cols) */}
        <div className="lg:col-span-9 bg-white rounded-3xl border border-brand-200 p-6 sm:p-12 shadow-subtle space-y-8">
          
          <div className="border-b border-brand-100 pb-5 space-y-2">
            <span className="text-xs uppercase tracking-widest text-brand-700 font-semibold">
              Official Document Draft
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif text-mauve-deep font-normal">
              {policy.title}
            </h1>
            <p className="text-xs text-mauve-muted">
              Status: <strong>{policy.lastUpdated}</strong> &bull; Effective: <strong>{policy.effectiveDate}</strong>
            </p>
            <p className="text-xs sm:text-sm text-mauve-charcoal pt-2 italic">
              {policy.summary}
            </p>
          </div>

          {/* Sections List */}
          <div className="space-y-8 text-xs sm:text-sm leading-relaxed text-mauve-charcoal font-light">
            {policy.sections.map((section, idx) => (
              <div key={idx} className="space-y-2">
                <h3 className="font-serif text-lg sm:text-xl font-medium text-mauve-deep">
                  {section.heading}
                </h3>
                <div className="whitespace-pre-line text-mauve-muted leading-relaxed">
                  {section.content}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-brand-100 flex items-center justify-between text-xs text-mauve-muted">
            <span>Loop &amp; Love &bull; Handmade Crochet Boutique</span>
            <Link to="/contact" className="text-brand-700 hover:text-brand-900 font-medium">
              Have questions regarding our policies? &rarr;
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
};

