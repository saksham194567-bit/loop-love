import { config } from '../config/env.js';

let storeSettings = {
  brandName: 'Loop & Love',
  tagline: 'Little Loops. Endless Love.',
  subtitle: 'Handmade Crochet Boutique',
  currency: 'INR',
  currencySymbol: '₹',
  freeShippingThreshold: config.FREE_SHIPPING_THRESHOLD,
  standardShippingFee: config.STANDARD_SHIPPING_FEE,
  supportEmail: config.SUPPORT_EMAIL,
  supportWhatsApp: config.SUPPORT_WHATSAPP,
  instagramHandle: '@loopandlove.crafts',
  shippingRegions: 'Pan-India',
  isStoreLive: false,
  isPaymentTestMode: config.IS_PAYMENT_TEST_MODE,
  gstinPlaceholder: '[PLACEHOLDER - To be configured before commercial launch]',
};

export async function getStoreSettings(req, res) {
  res.json({
    success: true,
    settings: storeSettings,
  });
}

export async function updateStoreSettings(req, res) {
  const { freeShippingThreshold, standardShippingFee, supportEmail, supportWhatsApp, instagramHandle, gstinPlaceholder } = req.body;

  storeSettings = {
    ...storeSettings,
    freeShippingThreshold: freeShippingThreshold !== undefined ? Number(freeShippingThreshold) : storeSettings.freeShippingThreshold,
    standardShippingFee: standardShippingFee !== undefined ? Number(standardShippingFee) : storeSettings.standardShippingFee,
    supportEmail: supportEmail || storeSettings.supportEmail,
    supportWhatsApp: supportWhatsApp || storeSettings.supportWhatsApp,
    instagramHandle: instagramHandle || storeSettings.instagramHandle,
    gstinPlaceholder: gstinPlaceholder || storeSettings.gstinPlaceholder,
  };

  res.json({
    success: true,
    message: 'Store settings updated successfully.',
    settings: storeSettings,
  });
}

