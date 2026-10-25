(() => {
  const menuButton = document.querySelector('.menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  if(menuButton && mobileMenu){menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')==='true';menuButton.setAttribute('aria-expanded', String(!open));menuButton.setAttribute('aria-label',open?'Open navigation':'Close navigation');mobileMenu.hidden=open;});mobileMenu.addEventListener('click',e=>{if(e.target.closest('a')){mobileMenu.hidden=true;menuButton.setAttribute('aria-expanded','false')}})}
  for(const form of document.querySelectorAll('form[data-mailto]')){
    form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;const data=new FormData(form);const name=(data.get('name')||'').toString().trim(), email=(data.get('email')||'').toString().trim(),org=(data.get('organisation')||'').toString().trim(),message=(data.get('message')||'').toString().trim();const subject=`ElderIndex website enquiry${org?' – '+org:''}`;const body=`Name: ${name}\nEmail: ${email}\nOrganisation: ${org||'Not supplied'}\n\nMessage:\n${message}\n\nSent via an email draft from elderindex.co.uk`;window.location.href=`mailto:hello@elderindex.co.uk?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`})
  }
})();
