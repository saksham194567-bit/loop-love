import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Sparkles, Mail, ArrowRight, Compass } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = Heart,
  title = "Handcrafting In Progress",
  subtitle = "Our artisans are currently twisting the loops and weaving love into this collection.",
  badge = "Handmade With Care",
  actionText = "Explore Other Collections",
  actionLink = "/shop",
  secondaryActionText,
  secondaryActionLink,
  showNewsletterPrompt = true,
  className = ""
}) => {
  return (
    <div className={`text-center py-16 px-6 max-w-2xl mx-auto ${className}`}>
      {/* Decorative Brand Emblem / Icon Badge */}
      <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-brand-50 border border-brand-200 shadow-subtle">
        <Icon className="w-8 h-8 text-brand-600 stroke-[1.5]" />
        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-cream-50 border border-brand-200 flex items-center justify-center">
          <Sparkles className="w-3 h-3 text-brand-500" />
        </div>
      </div>

      {badge && (
        <div className="mb-3">
          <span className="inline-block text-[11px] font-medium tracking-widest uppercase text-brand-700 bg-brand-100/70 px-3 py-1 rounded-full border border-brand-200/60">
            {badge}
          </span>
        </div>
      )}

      <h3 className="text-2xl sm:text-3xl font-serif text-mauve-deep mb-3 font-medium">
        {title}
      </h3>

      <p className="text-mauve-muted text-sm sm:text-base leading-relaxed mb-8 max-w-lg mx-auto">
        {subtitle}
      </p>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {actionLink && (
          <Link
            to={actionLink}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-brand-700 hover:bg-brand-800 text-white text-sm font-medium transition-all shadow-subtle hover:shadow-soft"
          >
            <span>{actionText}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}

        {secondaryActionLink && (
          <Link
            to={secondaryActionLink}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-brand-50 text-mauve-charcoal border border-brand-200 text-sm font-medium transition-colors"
          >
            <span>{secondaryActionText}</span>
          </Link>
        )}
      </div>

      {/* Gentle Newsletter / Notification note */}
      {showNewsletterPrompt && (
        <div className="mt-10 pt-8 border-t border-brand-200/60 flex items-center justify-center gap-2 text-xs text-mauve-muted">
          <Mail className="w-3.5 h-3.5 text-brand-500" />
          <span>Want early access when pieces are released? Subscribe to our private launch dispatch below.</span>
        </div>
      )}
    </div>
  );
};

