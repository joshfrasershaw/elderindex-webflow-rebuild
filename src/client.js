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
  // Available services are part of the consent scope. Enabling a new provider/ID
  // invalidates old choices rather than treating them as future blanket consent.
  const preferenceKey = 'elderindex-cookie-consent-v2';
  const consentScope = '2026-10-28:ga4=' + (measurementId || 'off') + ':preferences=off:marketing=off';
  const available = {analytics:Boolean(measurementId), preferences:false, marketing:false};
  const consentBanner = document.querySelector('.consent-banner');
  const consentDialog = document.querySelector('.consent-dialog');
  let consent = 'denied', analyticsStarted = false, returnFocus = null;
  const readPreference = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(preferenceKey));
      if (saved?.scope === consentScope && Number.isFinite(saved.at) && saved.at <= Date.now() && Date.now() - saved.at < 180 * 86400000 && ['analytics','preferences','marketing'].every(k => typeof saved[k] === 'boolean')) return saved;
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
  const applyConsent = choice => {
    const granted = available.analytics && choice?.analytics === true;
    consent = granted ? 'granted' : 'denied';
    if (measurementId) window['ga-disable-' + measurementId] = !granted;
    if (granted) {
      if (analyticsStarted) window.gtag?.('consent', 'update', {analytics_storage:'granted'});
      else startAnalytics();
    } else {
      window.gtag?.('consent', 'update', {analytics_storage:'denied', ad_storage:'denied', ad_user_data:'denied', ad_personalization:'denied'});
      clearAnalyticsCookies();
    }
  };
  const syncSwitches = choice => {
    for (const key of Object.keys(available)) {
      const input = consentDialog?.querySelector(`[name="${key}"]`);
      if (input) input.checked = available[key] && choice?.[key] === true;
    }
  };
  const saveChoice = choice => {
    const wasRunning = analyticsStarted;
    const saved = {scope:consentScope, at:Date.now(), ...Object.fromEntries(Object.keys(available).map(key=>[key,available[key] && choice[key] === true]))};
    applyConsent(saved);
    try { localStorage.setItem(preferenceKey, JSON.stringify(saved)); localStorage.removeItem('elderindex-analytics-consent-v1'); } catch {}
    consentBanner.hidden = true;
    consentDialog.close();
    // A loaded third-party library cannot be safely unloaded in place. Refresh
    // after revocation so it cannot keep observing events in this document.
    if (wasRunning && !saved.analytics) location.reload();
  };
  if (consentBanner && consentDialog) {
    const saved = readPreference();
    applyConsent(saved);
    syncSwitches(saved);
    consentBanner.hidden = Boolean(saved);
    document.querySelectorAll('[data-consent]').forEach(button => button.addEventListener('click', () => {
      const accepted = button.dataset.consent === 'accept';
      saveChoice({analytics:accepted, preferences:accepted, marketing:accepted});
    }));
    document.querySelectorAll('[data-cookie-preferences]').forEach(button => button.addEventListener('click', () => {
      returnFocus = button;
      syncSwitches({analytics:consent === 'granted'});
      consentDialog.showModal();
      consentDialog.querySelector('[data-cookie-close]').focus();
    }));
    consentDialog.querySelector('[data-cookie-close]').addEventListener('click',()=>consentDialog.close());
    consentDialog.addEventListener('close',()=>{ if(returnFocus && !returnFocus.closest('[hidden]')) returnFocus.focus(); });
    consentDialog.querySelector('[data-cookie-save]').addEventListener('click',()=>saveChoice(Object.fromEntries(Object.keys(available).map(key=>[key,consentDialog.querySelector(`[name="${key}"]`).checked]))));
    // Rejection/withdrawal in another tab applies here too. Missing, expired or
    // differently scoped consent never enables an optional integration.
    window.addEventListener('storage', event => {
      if (event.key !== preferenceKey && event.key !== null) return;
      const saved = readPreference(), wasRunning = analyticsStarted;
      applyConsent(saved);
      consentBanner.hidden = Boolean(saved);
      syncSwitches(saved);
      if (wasRunning && consent !== 'granted') location.reload();
    });
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
