// Public build-time configuration. Never put API tokens or other secrets here.
const env = process.env;
const endpoint = (env.FORM_ENDPOINT ?? 'https://formspree.io/f/xpqlvnaa').trim();
if (endpoint && !/^https:\/\//.test(endpoint)) throw new Error('FORM_ENDPOINT must be an HTTPS URL');
if (endpoint) {
  const url = new URL(endpoint);
  if (url.username || url.password || url.hash) throw new Error('FORM_ENDPOINT must not contain credentials or a fragment');
}
const measurementId = (env.GA4_MEASUREMENT_ID || '').trim();
if (measurementId && !/^G-[A-Z0-9]+$/.test(measurementId)) throw new Error('Invalid GA4_MEASUREMENT_ID');
const canonical = new URL(env.SITE_URL || 'https://elderindex.co.uk');
if (canonical.protocol !== 'https:' || canonical.pathname !== '/' || canonical.search || canonical.hash || canonical.username || canonical.password) {
  throw new Error('SITE_URL must be an HTTPS origin');
}
export const config = {
  baseUrl: canonical.origin,
  production: env.SITE_ENV === 'production',
  formEndpoint: endpoint,
  measurementId,
  founderName: 'Josh Fraser-Shaw',
};
