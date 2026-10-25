(() => {
  const menuButton = document.querySelector('.menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  if(menuButton && mobileMenu){menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')==='true';menuButton.setAttribute('aria-expanded', String(!open));menuButton.setAttribute('aria-label',open?'Open navigation':'Close navigation');mobileMenu.hidden=open;});mobileMenu.addEventListener('click',e=>{if(e.target.closest('a')){mobileMenu.hidden=true;menuButton.setAttribute('aria-expanded','false')}})}
  const servicesDropdown = document.querySelector('.services-dropdown');
  if (servicesDropdown) {
    const toggle = servicesDropdown.querySelector('.services-toggle');
    const submenu = servicesDropdown.querySelector('.services-submenu');
    let closeTimer;
    const setOpen = open => {
      clearTimeout(closeTimer);
      toggle.setAttribute('aria-expanded', String(open));
      submenu.hidden = !open;
    };
    servicesDropdown.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') setOpen(true); });
    servicesDropdown.addEventListener('pointerleave', () => {
      closeTimer = setTimeout(() => { if (!servicesDropdown.contains(document.activeElement)) setOpen(false); }, 180);
    });
    servicesDropdown.addEventListener('focusin', e => { if (e.target !== toggle) setOpen(true); });
    servicesDropdown.addEventListener('focusout', e => { if (!servicesDropdown.contains(e.relatedTarget)) setOpen(false); });
    toggle.addEventListener('click', () => setOpen(submenu.hidden));
    servicesDropdown.addEventListener('keydown', e => {
      if (e.key === 'Escape') { toggle.focus(); setOpen(false); e.preventDefault(); }
    });
    document.addEventListener('click', e => { if (!servicesDropdown.contains(e.target)) setOpen(false); });
  }
  let publicConfig = {};
  try { publicConfig = JSON.parse(document.getElementById('site-config')?.textContent || '{}'); } catch {}
  const measurementId = publicConfig.measurementId;
  const preferenceKey = 'elderindex-analytics-consent-v1';
  let consent = 'denied';
  let analyticsStarted = false;
  const consentBanner = document.querySelector('.consent-banner');
  const readPreference = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(preferenceKey));
      if (saved && ['granted', 'denied'].includes(saved.value) && Date.now() - saved.at < 180 * 86400000) return saved.value;
    } catch {}
    return null;
  };
  const startAnalytics = () => {
    if (!measurementId || analyticsStarted) return;
    analyticsStarted = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', {analytics_storage:'denied', ad_storage:'denied', ad_user_data:'denied', ad_personalization:'denied'});
    window.gtag('consent', 'update', {analytics_storage:'granted'});
    window.gtag('js', new Date());
    window.gtag('config', measurementId, {send_page_view:false, allow_google_signals:false, allow_ad_personalization_signals:false, page_location:location.origin+location.pathname});
    window.gtag('event', 'page_view', {page_location:location.origin+location.pathname, page_title:document.title});
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(measurementId);
    document.head.append(script);
  };
  const clearAnalyticsCookies = () => {
    const hostParts = location.hostname.split('.');
    for (const cookie of document.cookie.split(';')) {
      const name = cookie.split('=')[0].trim();
      if (!/^_ga(?:_|$)/.test(name)) continue;
      document.cookie = name+'=; Max-Age=0; path=/';
      for (let i = 0; i < hostParts.length - 1; i++) document.cookie = name+'=; Max-Age=0; path=/; domain=.'+hostParts.slice(i).join('.');
    }
  };
  const applyConsent = value => {
    consent = value;
    if (measurementId) window['ga-disable-' + measurementId] = value !== 'granted';
    if (value === 'granted') {
      if (analyticsStarted) window.gtag?.('consent', 'update', {analytics_storage:'granted'});
      else startAnalytics();
    } else {
      window.gtag?.('consent', 'update', {analytics_storage:'denied'});
      clearAnalyticsCookies();
    }
  };
  if (measurementId && consentBanner) {
    const saved = readPreference();
    if (saved) applyConsent(saved);
    else consentBanner.hidden = false;
    document.querySelectorAll('[data-consent]').forEach(button => button.addEventListener('click', () => {
      const value = button.dataset.consent;
      applyConsent(value);
      try { localStorage.setItem(preferenceKey, JSON.stringify({value, at:Date.now()})); } catch {}
      consentBanner.hidden = true;
    }));
    document.querySelectorAll('[data-cookie-preferences]').forEach(button => button.addEventListener('click', () => {
      consentBanner.hidden = false;
      consentBanner.querySelector('button')?.focus();
    }));
  }
  const track = (event, parameters = {}) => {
    if (consent === 'granted' && measurementId) window.gtag?.('event', event, parameters);
  };
  document.addEventListener('click', event => {
    const anchor = event.target.closest('a[href]');
    if (!anchor) return;
    const href = anchor.getAttribute('href');
    // Do not send email addresses, phone numbers or form contents to analytics.
    if (href.startsWith('mailto:')) track('email_click');
    if (href.startsWith('tel:')) track('phone_click');
  });

  for (const form of document.querySelectorAll('form[data-enquiry-form]')) {
    const feedback = form.querySelector('.form-feedback');
    const submit = form.querySelector('[type="submit"]');
    let sending = false;
    const inputs = [...form.querySelectorAll('input:not([type="checkbox"]), textarea')];
    const clearError = input => {
      input.removeAttribute('aria-invalid');
      const error = input.parentElement.querySelector('.field-error');
      if (error) error.remove();
      input.removeAttribute('aria-describedby');
    };
    inputs.forEach((input, i) => {
      input.id = input.id || `enquiry-${form.dataset.enquiryForm}-${input.name}-${i}`;
      input.addEventListener('input', () => clearError(input));
    });
    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (sending || !form.getAttribute('action')) return;
      let firstInvalid;
      for (const input of inputs) {
        clearError(input);
        // Native required accepts whitespace; enquiries need actual text.
        if (input.required && !input.value.trim() || !input.checkValidity()) {
          const error = document.createElement('span');
          error.className = 'field-error';
          error.id = input.id + '-error';
          error.textContent = !input.value.trim() ? 'Please complete this field.' : input.type === 'email' ? 'Enter a valid email address.' : input.type === 'url' ? 'Enter a full website address, starting with https://.' : input.validationMessage;
          input.parentElement.append(error);
          input.setAttribute('aria-invalid', 'true');
          input.setAttribute('aria-describedby', error.id);
          firstInvalid = firstInvalid || input;
        }
      }
      if (firstInvalid) {
        feedback.textContent = 'Please check the highlighted fields before sending.';
        feedback.dataset.state = 'error';
        firstInvalid.focus();
        return;
      }
      sending = true;
      submit.disabled = true;
      submit.textContent = 'Sending…';
      form.setAttribute('aria-busy', 'true');
      feedback.textContent = 'Sending your enquiry…';
      feedback.dataset.state = 'pending';
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20000);
      try {
        const payload = new FormData(form);
        const response = await fetch(form.action, {method:'POST', body:payload, headers:{Accept:'application/json'}, signal:controller.signal, credentials:'omit'});
        const result = await response.json().catch(() => null);
        if (!response.ok || result?.ok !== true) throw new Error('Submission was not confirmed');
        feedback.textContent = 'Thank you — your enquiry has been received. We’ll respond to arrange a useful conversation.';
        feedback.dataset.state = 'success';
        form.reset();
        track('generate_lead', {form_id:form.dataset.enquiryForm});
        // Keep a confirmed form disabled to avoid accidental duplicate enquiries.
        submit.textContent = 'Enquiry received';
      } catch (error) {
        feedback.textContent = error.name === 'AbortError' ? 'We couldn’t confirm your enquiry in time. Please email hello@elderindex.co.uk before retrying, to avoid sending it twice.' : 'Your enquiry could not be confirmed. Please try again or email hello@elderindex.co.uk directly.';
        feedback.dataset.state = 'error';
        sending = false;
        submit.disabled = false;
        submit.textContent = 'Send enquiry';
      } finally {
        clearTimeout(timeout);
        form.removeAttribute('aria-busy');
        feedback.focus();
      }
    });
  }
})();
