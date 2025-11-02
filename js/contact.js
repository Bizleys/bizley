/*
  contact.js
  - Client-side validation for contact form
  - Inline error messages and ARIA attributes
*/

(function(){
  function showFieldError(input, msg){
    input.classList.add('invalid');
    input.setAttribute('aria-invalid', 'true');
    let err = input.nextElementSibling;
    if (!err || !err.classList.contains('field-error')){
      err = document.createElement('div');
      err.className = 'field-error';
      input.insertAdjacentElement('afterend', err);
    }
    err.textContent = msg;
  }

  function clearFieldError(input){
    input.classList.remove('invalid');
    input.removeAttribute('aria-invalid');
    const err = input.nextElementSibling;
    if (err && err.classList.contains('field-error')) err.textContent = '';
  }

  function isValidEmail(email){
    // Simple RFC 5322-like pattern
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function initContactValidation(){
    const form = document.querySelector('form[action^="https://formspree.io/"]');
    if (!form) return;

    const name = form.querySelector('#name');
    const email = form.querySelector('#email');
    const message = form.querySelector('#message');

    function validate(){
      let valid = true;
      [name, email, message].forEach(clearFieldError);
      if (!name.value.trim()) { showFieldError(name, 'Please enter your name.'); valid = false; }
      if (!email.value.trim() || !isValidEmail(email.value.trim())) { showFieldError(email, 'Please enter a valid email.'); valid = false; }
      if (!message.value.trim() || message.value.trim().length < 10) { showFieldError(message, 'Please enter at least 10 characters.'); valid = false; }
      return valid;
    }

    [name, email, message].forEach(el => el.addEventListener('input', () => clearFieldError(el)));

    form.addEventListener('submit', (e) => {
      if (!validate()) {
        e.preventDefault();
        const existing = document.getElementById('contact-form-msg');
        const msg = existing || (()=>{
          const m = document.createElement('div');
          m.id = 'contact-form-msg';
          m.setAttribute('aria-live','polite');
          m.style.marginTop = '8px';
          form.insertAdjacentElement('beforebegin', m);
          return m;
        })();
        msg.textContent = 'Please fix the errors above before sending.';
      }
    });
  }

  document.addEventListener('DOMContentLoaded', initContactValidation);
})();
