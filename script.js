const slides = document.querySelectorAll('.hero-slide');
let activeIndex = 0;

if (slides.length > 1) {
  setInterval(() => {
    slides[activeIndex].classList.remove('active');
    activeIndex = (activeIndex + 1) % slides.length;
    slides[activeIndex].classList.add('active');
  }, 5000);
}

const hoursEl = document.querySelector('#count-hours');
const minsEl = document.querySelector('#count-mins');
const secsEl = document.querySelector('#count-secs');
let remainingSeconds = 2 * 60 * 60;

function pad(value) {
  return String(value).padStart(2, '0');
}

function renderCountdown() {
  if (!hoursEl || !minsEl || !secsEl) {
    return;
  }

  const hours = Math.floor(remainingSeconds / 3600);
  const mins = Math.floor((remainingSeconds % 3600) / 60);
  const secs = remainingSeconds % 60;

  hoursEl.textContent = pad(hours);
  minsEl.textContent = pad(mins);
  secsEl.textContent = pad(secs);
}

renderCountdown();

if (hoursEl && minsEl && secsEl) {
  setInterval(() => {
    if (remainingSeconds > 0) {
      remainingSeconds -= 1;
      renderCountdown();
    }
  }, 1000);
}

const menuBtn = document.querySelector('.menu-btn');
const nav = document.querySelector('.main-nav');

if (menuBtn && nav) {
  menuBtn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

const addCartButtons = document.querySelectorAll('.add-cart-btn');
const cartFab = document.querySelector('#cart-fab');
const headerCartBtn = document.querySelector('#header-cart-btn');
const headerCartCount = document.querySelector('#header-cart-count');
const cartCount = document.querySelector('#cart-count');
const cartDrawer = document.querySelector('#cart-drawer');
const cartOverlay = document.querySelector('#cart-overlay');
const cartClose = document.querySelector('#cart-close');
const cartItems = document.querySelector('#cart-items');
const cartEmpty = document.querySelector('#cart-empty');
const cartSubtotal = document.querySelector('#cart-subtotal');
const checkoutForm = document.querySelector('#checkout-form');
const testimonialLoopTrack = document.querySelector('.testi-loop-track');
const testiCarouselTrack = document.querySelector('#testi-carousel-track');
const testiCarouselPrev = document.querySelector('#testi-carousel-prev');
const testiCarouselNext = document.querySelector('#testi-carousel-next');
const imageLightbox = document.querySelector('#image-lightbox');
const imageLightboxImg = document.querySelector('#image-lightbox-img');

const cart = [];

const TESTIMONIAL_LOOP_IMAGES = [
  'ezybath content/ezybath_testi_1/IMG_6034.png',
  'ezybath content/ezybath_testi_1/IMG_6035.png',
  'ezybath content/ezybath_testi_1/IMG_6036.png',
  'ezybath content/ezybath_testi_1/IMG_6037.png',
  'ezybath content/ezybath_testi_1/IMG_6039.png',
  'ezybath content/ezybath_testi_1/IMG_6040.png',
  'ezybath content/ezybath_testi_1/WhatsApp Image 2026-07-27 at 13.50.19.jpeg',
  'ezybath content/ezybath_testi_1/WhatsApp Image 2026-07-27 at 14.09.56.jpeg',
  'ezybath content/ezybath_testi_1/WhatsApp Image 2026-07-27 at 14.18.09.jpeg',
  'ezybath content/ezybath_testi_1/WhatsApp Image 2026-07-27 at 14.37.47.jpeg',
  'ezybath content/ezybath_testi_1/WhatsApp Image 2026-07-27 at 14.41.55.jpeg',
  'ezybath content/ezybath_testi_1/WhatsApp Image 2026-07-28 at 11.43.48.jpeg',
];

function shuffleArray(values) {
  const shuffled = [...values];

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

function renderTestimonialLoop() {
  if (!testimonialLoopTrack || TESTIMONIAL_LOOP_IMAGES.length === 0) {
    return;
  }

  const shuffledImages = shuffleArray(TESTIMONIAL_LOOP_IMAGES);
  const primary = shuffledImages
    .map(
      (src, index) => `<article class="testi-photo"><img src="${src}" alt="顾客反馈图片 ${index + 1}" loading="lazy" /></article>`,
    )
    .join('');

  const duplicate = shuffledImages
    .map((src) => `<article class="testi-photo" aria-hidden="true"><img src="${src}" alt="" loading="lazy" /></article>`)
    .join('');

  testimonialLoopTrack.innerHTML = primary + duplicate;
}

function formatMoney(amount) {
  return `RM${amount.toFixed(2)}`;
}

function getTotalQty() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

function getSubtotal() {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function renderCart() {
  if (!cartItems || !cartCount || !cartSubtotal || !cartEmpty) {
    return;
  }

  cartItems.innerHTML = '';

  cart.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'cart-item';
    li.innerHTML = `
      <img class="cart-item-image" src="${item.image}" alt="${item.name}" />
      <div class="cart-item-content">
        <div class="cart-item-top">
          <span class="cart-item-name">${item.name}</span>
          <span class="cart-item-price">${formatMoney(item.price * item.qty)}</span>
        </div>
        <div class="cart-item-actions">
          <div class="cart-qty">
            <button type="button" data-action="decrease" data-id="${item.id}">-</button>
            <span>${item.qty}</span>
            <button type="button" data-action="increase" data-id="${item.id}">+</button>
          </div>
          <button class="cart-remove" type="button" data-action="remove" data-id="${item.id}">删除</button>
        </div>
      </div>
    `;
    cartItems.appendChild(li);
  });

  const totalQty = getTotalQty();
  cartCount.textContent = String(totalQty);
  if (headerCartCount) {
    headerCartCount.textContent = String(totalQty);
  }
  cartSubtotal.textContent = formatMoney(getSubtotal());

  const hasItems = totalQty > 0;
  cartEmpty.hidden = hasItems;
}

function openCart() {
  if (!cartDrawer || !cartOverlay || !cartFab) {
    return;
  }
  cartDrawer.classList.add('open');
  cartDrawer.setAttribute('aria-hidden', 'false');
  cartOverlay.hidden = false;
  cartFab.setAttribute('aria-expanded', 'true');
}

function closeCart() {
  if (!cartDrawer || !cartOverlay || !cartFab) {
    return;
  }
  cartDrawer.classList.remove('open');
  cartDrawer.setAttribute('aria-hidden', 'true');
  cartOverlay.hidden = true;
  cartFab.setAttribute('aria-expanded', 'false');
}

function addItemToCart({ id, name, price, image }) {
  const existing = cart.find((item) => item.id === id);

  if (existing) {
    existing.qty += 1;
    if (!existing.image && image) {
      existing.image = image;
    }
  } else {
    cart.push({ id, name, price, image: image || 'ezybath_logo.png', qty: 1 });
  }

  renderCart();
  openCart();
}

if (addCartButtons.length > 0) {
  addCartButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const { id, name, price, image } = button.dataset;
      const parsedPrice = Number(price);

      if (!id || !name || Number.isNaN(parsedPrice)) {
        return;
      }

      addItemToCart({ id, name, price: parsedPrice, image });
    });
  });
}

if (cartItems) {
  cartItems.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLButtonElement)) {
      return;
    }

    const action = target.dataset.action;
    const id = target.dataset.id;

    if (!action || !id) {
      return;
    }

    const index = cart.findIndex((item) => item.id === id);
    if (index < 0) {
      return;
    }

    if (action === 'increase') {
      cart[index].qty += 1;
    }

    if (action === 'decrease') {
      cart[index].qty -= 1;
      if (cart[index].qty <= 0) {
        cart.splice(index, 1);
      }
    }

    if (action === 'remove') {
      cart.splice(index, 1);
    }

    renderCart();
  });
}

if (cartFab) {
  cartFab.addEventListener('click', () => {
    if (cartDrawer?.classList.contains('open')) {
      closeCart();
    } else {
      openCart();
    }
  });
}

if (headerCartBtn) {
  headerCartBtn.addEventListener('click', () => {
    openCart();
  });
}

if (cartClose) {
  cartClose.addEventListener('click', closeCart);
}

if (cartOverlay) {
  cartOverlay.addEventListener('click', closeCart);
}

if (checkoutForm) {
  checkoutForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (getTotalQty() === 0) {
      return;
    }

    if (!checkoutForm.checkValidity()) {
      checkoutForm.reportValidity();
      return;
    }

    const submitBtn = checkoutForm.querySelector('button[type="submit"]');
    const originalSubmitText = submitBtn instanceof HTMLButtonElement ? submitBtn.textContent : '';

    try {
      if (submitBtn instanceof HTMLButtonElement) {
        submitBtn.disabled = true;
        submitBtn.textContent = '正在连接支付...';
      }

      const formData = new FormData(checkoutForm);
      const payload = {
        cart: cart.map((item) => ({
          id: item.id,
          name: item.name,
          qty: item.qty,
          price: item.price,
        })),
        customer: {
          email: String(formData.get('email') || '').trim(),
          contactNumber: String(formData.get('contactNumber') || '').trim(),
          firstName: String(formData.get('firstName') || '').trim(),
          lastName: String(formData.get('lastName') || '').trim(),
          address: String(formData.get('address') || '').trim(),
          apartment: String(formData.get('apartment') || '').trim(),
          postcode: String(formData.get('postcode') || '').trim(),
          city: String(formData.get('city') || '').trim(),
          state: String(formData.get('state') || '').trim(),
        },
      };

      const response = await fetch('/api/create-bill', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result?.url) {
        throw new Error(result?.message || '创建支付链接失败，请稍后重试。');
      }

      window.location.href = result.url;
    } catch (error) {
      alert(error instanceof Error ? error.message : '创建支付链接失败，请稍后重试。');
    } finally {
      if (submitBtn instanceof HTMLButtonElement) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalSubmitText || 'Pay Now';
      }
    }
  });
}

function getCarouselStep() {
  if (!testiCarouselTrack) {
    return 0;
  }

  const firstCard = testiCarouselTrack.querySelector('.testi-carousel-card');
  if (!(firstCard instanceof HTMLElement)) {
    return 0;
  }

  const cardWidth = firstCard.getBoundingClientRect().width;
  return cardWidth + 12;
}

function openImageLightbox(imageSrc, imageAlt) {
  if (!imageLightbox || !imageLightboxImg || !imageSrc) {
    return;
  }

  imageLightboxImg.src = imageSrc;
  imageLightboxImg.alt = imageAlt || '顾客实拍大图';
  imageLightbox.hidden = false;
  imageLightbox.setAttribute('aria-hidden', 'false');
  document.body.classList.add('no-scroll');
}

function closeImageLightbox() {
  if (!imageLightbox || !imageLightboxImg) {
    return;
  }

  imageLightbox.hidden = true;
  imageLightbox.setAttribute('aria-hidden', 'true');
  imageLightboxImg.src = '';
  document.body.classList.remove('no-scroll');
}

let carouselAutoTimer = null;

function scrollCarouselNext() {
  if (!testiCarouselTrack) {
    return;
  }

  const step = getCarouselStep();
  if (step <= 0) {
    return;
  }

  const maxScrollLeft = testiCarouselTrack.scrollWidth - testiCarouselTrack.clientWidth;
  const nextLeft = testiCarouselTrack.scrollLeft + step;

  if (nextLeft >= maxScrollLeft - 2) {
    testiCarouselTrack.scrollTo({ left: 0, behavior: 'smooth' });
    return;
  }

  testiCarouselTrack.scrollBy({ left: step, behavior: 'smooth' });
}

function stopCarouselAuto() {
  if (carouselAutoTimer) {
    clearInterval(carouselAutoTimer);
    carouselAutoTimer = null;
  }
}

function startCarouselAuto() {
  if (!testiCarouselTrack) {
    return;
  }

  stopCarouselAuto();
  carouselAutoTimer = setInterval(scrollCarouselNext, 3000);
}

if (testiCarouselTrack && testiCarouselPrev && testiCarouselNext) {
  startCarouselAuto();

  testiCarouselPrev.addEventListener('click', () => {
    testiCarouselTrack.scrollBy({ left: -getCarouselStep(), behavior: 'smooth' });
    startCarouselAuto();
  });

  testiCarouselNext.addEventListener('click', () => {
    testiCarouselTrack.scrollBy({ left: getCarouselStep(), behavior: 'smooth' });
    startCarouselAuto();
  });

  testiCarouselTrack.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      testiCarouselTrack.scrollBy({ left: -getCarouselStep(), behavior: 'smooth' });
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      testiCarouselTrack.scrollBy({ left: getCarouselStep(), behavior: 'smooth' });
    }
  });

  testiCarouselTrack.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const card = target.closest('.testi-carousel-card');
    if (!(card instanceof HTMLButtonElement)) {
      return;
    }

    const imageSrc = card.dataset.fullImage;
    const imageEl = card.querySelector('img');

    if (!imageSrc || !(imageEl instanceof HTMLImageElement)) {
      return;
    }

    openImageLightbox(imageSrc, imageEl.alt);
  });

  testiCarouselTrack.addEventListener('mouseenter', stopCarouselAuto);
  testiCarouselTrack.addEventListener('mouseleave', startCarouselAuto);
  testiCarouselTrack.addEventListener('focusin', stopCarouselAuto);
  testiCarouselTrack.addEventListener('focusout', startCarouselAuto);

  testiCarouselTrack.addEventListener('touchstart', stopCarouselAuto, { passive: true });
  testiCarouselTrack.addEventListener('touchend', startCarouselAuto);

}

if (imageLightbox) {
  imageLightbox.hidden = true;
  imageLightbox.setAttribute('aria-hidden', 'true');

  imageLightbox.addEventListener('click', (event) => {
    if (event.target === imageLightbox) {
      closeImageLightbox();
    }
  });
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && imageLightbox && !imageLightbox.hidden) {
    closeImageLightbox();
  }
});

renderTestimonialLoop();
renderCart();
