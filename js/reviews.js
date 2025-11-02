/*
  reviews.js
  - Client-side reviews using localStorage
  - Accessibility: aria-live updates, role=list/listitem, labelled star display
*/

(function(){
  const STORAGE_KEY = 'bizleyReviews_v1';

  function escapeHtml(s){
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function loadReviews(){
    try{
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    }catch(e){
      console.error('Failed to load reviews', e);
      return [];
    }
  }

  function saveReviews(list){
    try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); }catch(e){ console.error('Failed to save reviews', e); }
  }

  function renderReviews(){
    const container = document.getElementById('reviews-list');
    const reviews = loadReviews();
    if(!container) return;
    if(reviews.length === 0){
      container.innerHTML = '<p class="muted">No reviews yet — be the first to leave one.</p>';
      return;
    }
    container.innerHTML = reviews.map((r, idx) => {
      const loc = r.location ? (' — ' + escapeHtml(r.location)) : '';
      const stars = '★'.repeat(r.rating) + '☆'.repeat(5-r.rating);
      return `
      <article class="review" role="listitem" data-idx="${idx}">
        <div class="review-body">
          <div class="review-stars" aria-label="${r.rating} out of 5 stars">${stars}</div>
          <p>${escapeHtml(r.text)}</p>
        </div>
        <footer>
          <strong>${escapeHtml(r.name)}${loc}</strong>
          <button class="delete-review" data-idx="${idx}" aria-label="Delete review by ${escapeHtml(r.name)}">Delete</button>
        </footer>
      </article>`;
    }).join('\n');
  }

  function addReview(review){
    const list = loadReviews();
    list.unshift(review);
    saveReviews(list);
    renderReviews();
  }

  function clearReviews(){
    localStorage.removeItem(STORAGE_KEY);
    renderReviews();
  }

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

  document.addEventListener('DOMContentLoaded', function(){
    if (!document.getElementById('leave-review')) return; // only on review page

    renderReviews();

    const form = document.getElementById('leave-review');
    const msg = document.getElementById('review-msg') || (function(){
      const m = document.createElement('div');
      m.id = 'review-msg';
      m.setAttribute('aria-live','polite');
      form.insertAdjacentElement('beforebegin', m);
      return m;
    })();

    const nameInput = document.getElementById('reviewer-name');
    const locInput = document.getElementById('reviewer-location');
    const ratingInput = document.getElementById('review-rating');
    const textInput = document.getElementById('review-text');

    function validate(){
      let valid = true;
      clearFieldError(nameInput);
      clearFieldError(textInput);
      if (!nameInput.value.trim()) { showFieldError(nameInput, 'Please enter your name.'); valid = false; }
      if (!textInput.value.trim()) { showFieldError(textInput, 'Please write a short review.'); valid = false; }
      return valid;
    }

    nameInput.addEventListener('input', () => clearFieldError(nameInput));
    textInput.addEventListener('input', () => clearFieldError(textInput));

    form.addEventListener('submit', function(e){
      e.preventDefault();
      if (!validate()) { msg.textContent = 'Please fix the errors above.'; return; }
      const review = {
        name: nameInput.value.trim(),
        location: locInput.value.trim(),
        rating: parseInt(ratingInput.value, 10) || 5,
        text: textInput.value.trim(),
        created: Date.now()
      };
      addReview(review);
      form.reset();
      msg.textContent = 'Thanks — your review has been added.';
      setTimeout(()=> msg.textContent = '', 3000);
    });

    document.getElementById('clear-reviews').addEventListener('click', function(){
      if(confirm('Clear all reviews? This cannot be undone.')){ clearReviews(); }
    });

    document.getElementById('reviews-list').addEventListener('click', function(e){
      const btn = e.target.closest('.delete-review');
      if(!btn) return;
      const idx = Number(btn.getAttribute('data-idx'));
      const list = loadReviews();
      if(isNaN(idx) || idx < 0 || idx >= list.length) return;
      if(!confirm('Delete this review?')) return;
      list.splice(idx,1);
      saveReviews(list);
      renderReviews();
    });
  });
})();
