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
  for(const form of document.querySelectorAll('form[data-mailto]')){
    form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;const data=new FormData(form);const name=(data.get('name')||'').toString().trim(), email=(data.get('email')||'').toString().trim(),org=(data.get('organisation')||'').toString().trim(),message=(data.get('message')||'').toString().trim(),website=(data.get('website')||'').toString().trim(),services=data.getAll('service').map(String);const subject=`ElderIndex website enquiry${org?' – '+org:''}`;const body=`Name: ${name}\nEmail: ${email}\nOrganisation: ${org||'Not supplied'}\nExisting website: ${website||'Not supplied'}\nServices: ${services.length?services.join(', '):'Not selected'}\n\nProject details:\n${message}\n\nSent via an email draft from elderindex.co.uk`;window.location.href=`mailto:hello@elderindex.co.uk?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`})
  }
})();
