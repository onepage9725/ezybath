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
const langZhBtn = document.querySelector('#lang-zh');
const langEnBtn = document.querySelector('#lang-en');

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
const deliveryCarouselSection = document.querySelector('#delivery-carousel');
const deliveryCarouselTitle = document.querySelector('#delivery-carousel-title');
const deliveryCarouselTrack = document.querySelector('#delivery-carousel-track');
const deliveryCarouselPrev = document.querySelector('#delivery-carousel-prev');
const deliveryCarouselNext = document.querySelector('#delivery-carousel-next');
const imageLightbox = document.querySelector('#image-lightbox');
const imageLightboxImg = document.querySelector('#image-lightbox-img');
const beforeAfterSlider = document.querySelector('[data-before-after]');

const cart = [];
let currentLanguage = 'en';

const TESTIMONIAL_LOOP_MALE_IMAGES = [
  'ezybath content/ezybath_testi_1/IMG_6034.png',
  'ezybath content/ezybath_testi_1/IMG_6035.png',
  'ezybath content/ezybath_testi_1/IMG_6036.png',
  'ezybath content/ezybath_testi_1/IMG_6037.png',
  'ezybath content/ezybath_testi_1/WhatsApp Image 2026-07-27 at 14.09.56.jpeg',
  'ezybath content/ezybath_testi_1/WhatsApp Image 2026-07-27 at 14.18.09.jpeg',
  'ezybath content/ezybath_testi_1/WhatsApp Image 2026-07-27 at 14.41.55.jpeg',
];

const TESTIMONIAL_LOOP_FEMALE_IMAGES = [
  'ezybath content/ezybath_testi_1/IMG_6039.png',
  'ezybath content/ezybath_testi_1/IMG_6040.png',
  'ezybath content/ezybath_testi_1/WhatsApp Image 2026-07-27 at 13.50.19.jpeg',
  'ezybath content/ezybath_testi_1/WhatsApp Image 2026-07-27 at 14.37.47.jpeg',
  'ezybath content/ezybath_testi_1/WhatsApp Image 2026-07-28 at 11.43.48.jpeg',
];

const TESTIMONIAL_FACE_FOCUS_IMAGES = new Set([
  'ezybath content/ezybath_testi_1/WhatsApp Image 2026-07-27 at 13.50.19.jpeg',
]);

function getRandomFeedbackDate(startDate, endDate) {
  const startTime = startDate.getTime();
  const endTime = endDate.getTime();
  const randomTime = startTime + Math.floor(Math.random() * (endTime - startTime + 1));
  const date = new Date(randomTime);

  date.setHours(0, 0, 0, 0);
  return date;
}

function formatFeedbackDate(dateValue, isEnglish) {
  if (!(dateValue instanceof Date)) {
    return '';
  }

  if (isEnglish) {
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(dateValue);
  }

  const year = dateValue.getFullYear();
  const month = dateValue.getMonth() + 1;
  const day = dateValue.getDate();
  return `${year}年${month}月${day}日`;
}

const deliveryReviewYear = new Date().getFullYear();
const deliveryReviewStartDate = new Date(deliveryReviewYear, 3, 1);
const deliveryReviewEndDate = new Date(deliveryReviewYear, 7, 31);

const DELIVERY_REVIEWS = [
  {
    image: 'deliveryimage/delivery4.jpg',
    en: 'Fast shipping, great product, zero complaints. 10/10 would recommend.',
    zh: '发货快，东西好，没有任何可挑剔的。满分推荐。',
    author: 'Sarah T.',
  },
  {
    image: 'deliveryimage/delivery5.jpg',
    en: 'Their customer service was super helpful and answered all my questions patiently. The item even arrived earlier than expected.',
    zh: '客服态度超级好，耐心解答了我的所有问题。包裹甚至比预期更早送达。',
    author: 'Elise C.',
  },
  {
    image: 'deliveryimage/delivery6.jpg',
    en: 'I have been using ezybath, and it is highly effective. It is very easy to use.',
    zh: '用了 ezybath，真的很有效果！而且非常好用！',
    author: 'Mr Tan.',
  },
  {
    image: 'deliveryimage/delivery7.jpg',
    en: 'I have struggled with eczema and itchy skin for years, but EzyBath has been a lifesaver. It stops the itching almost instantly. Highly recommend!',
    zh: '我被湿疹和皮肤干痒困扰了好几年，但 EzyBath 简直是我的救星。洗完后它几乎立刻就能止痒。强烈推荐！',
    author: 'Wendy N.',
  },
  {
    image: 'deliveryimage/delivery8.jpg',
    en: 'Finally, a body wash without harsh chemicals or SLS! My skin feels so smooth and hydrated after every shower.',
    zh: '终于找到一款没有刺激性化学物质或SLS的沐浴露了！每次洗完澡皮肤都感觉特别水润光滑。',
    author: 'Jerry C.',
  },
  {
    image: 'deliveryimage/delivery9.jpg',
    en: 'After using EzyBath for just two weeks, my skin redness and peeling have significantly reduced. I love it.',
    zh: '仅仅用了两个星期 EzyBath，我皮肤的泛红和脱皮就明显减少了。我太喜欢了！',
    author: 'Siew Yen T.',
  },
  {
    image: 'deliveryimage/delivery10.jpg',
    en: 'I was skeptical at first, but this product truly delivers. The medical-grade formula is gentle yet effective. Will definitely repurchase!',
    zh: '刚开始我抱着怀疑的态度，但这款产品真的名副其实。医用级配方温和又有效。绝对会无限回购！',
    author: 'Ah Liau Y.',
  },
].map((item) => ({
  ...item,
  date: getRandomFeedbackDate(deliveryReviewStartDate, deliveryReviewEndDate),
}));

let deliveryCarouselIndex = 0;

function getDeliveryCardsPerView() {
  if (window.innerWidth <= 760) {
    return 1;
  }

  if (window.innerWidth <= 1200) {
    return 2;
  }

  return 4;
}

function getDeliveryCarouselMaxIndex() {
  return Math.max(0, DELIVERY_REVIEWS.length - getDeliveryCardsPerView());
}

function getDeliverySlideStep() {
  if (!deliveryCarouselTrack) {
    return 0;
  }

  const firstSlide = deliveryCarouselTrack.querySelector('.delivery-slide');
  if (!(firstSlide instanceof HTMLElement)) {
    return 0;
  }

  const trackStyles = window.getComputedStyle(deliveryCarouselTrack);
  const gap = parseFloat(trackStyles.columnGap || trackStyles.gap || '0');
  return firstSlide.getBoundingClientRect().width + gap;
}

function updateDeliveryCarouselPosition() {
  if (!deliveryCarouselTrack) {
    return;
  }

  const maxIndex = getDeliveryCarouselMaxIndex();
  deliveryCarouselIndex = Math.min(Math.max(deliveryCarouselIndex, 0), maxIndex);

  const step = getDeliverySlideStep();
  deliveryCarouselTrack.style.transform = `translateX(-${deliveryCarouselIndex * step}px)`;

  if (deliveryCarouselPrev) {
    const disabled = deliveryCarouselIndex === 0;
    deliveryCarouselPrev.disabled = disabled;
    deliveryCarouselPrev.setAttribute('aria-disabled', String(disabled));
  }

  if (deliveryCarouselNext) {
    const disabled = deliveryCarouselIndex >= maxIndex;
    deliveryCarouselNext.disabled = disabled;
    deliveryCarouselNext.setAttribute('aria-disabled', String(disabled));
  }
}

const I18N_BINDINGS = [
  { key: 'docTitle', selector: 'title' },
  { key: 'metaDescription', selector: 'meta[name="description"]', attr: 'content' },
  { key: 'brandAria', selector: '.brand', attr: 'aria-label' },
  { key: 'menuAria', selector: '.menu-btn', attr: 'aria-label' },
  { key: 'quickActionsAria', selector: '.header-quick-actions', attr: 'aria-label' },
  { key: 'langToggleAria', selector: '.lang-toggle', attr: 'aria-label' },
  { key: 'navHome', selector: '.main-nav a', index: 0 },
  { key: 'navPackages', selector: '.main-nav a', index: 1 },
  { key: 'navBenefits', selector: '.main-nav a', index: 2 },
  { key: 'navStory', selector: '.main-nav a', index: 3 },
  { key: 'navRepair', selector: '.main-nav a', index: 4 },
  { key: 'navReviews', selector: '.main-nav a', index: 5 },
  { key: 'navFaq', selector: '.main-nav a', index: 6 },
  { key: 'headerPackagesBtn', selector: '.header-packages-btn' },
  { key: 'headerCartAria', selector: '#header-cart-btn', attr: 'aria-label' },
  { key: 'heroH1', selector: '.sale-intro h1' },
  { key: 'heroSubtitle', selector: '.intro-subtitle' },
  { key: 'heroText', selector: '.sale-intro .section-head > p' },
  { key: 'heroCtaPrimary', selector: '.cta-primary' },
  { key: 'heroCtaGhost', selector: '.cta-ghost' },
  { key: 'countdownAria', selector: '#countdown', attr: 'aria-label' },
  { key: 'countdownTag', selector: '.countdown-tag' },
  { key: 'countdownTitle', selector: '.sale-countdown h2' },
  { key: 'countdownHours', selector: '.time-box small', index: 0 },
  { key: 'countdownMinutes', selector: '.time-box small', index: 1 },
  { key: 'countdownSeconds', selector: '.time-box small', index: 2 },
  { key: 'countdownCta', selector: '.countdown-cta' },
  { key: 'countdownNote', selector: '.countdown-note' },
  { key: 'benefitsTitle', selector: '#benefits .section-head h2' },
  { key: 'benefit1', selector: '.benefit-grid article p', index: 0 },
  { key: 'benefit2', selector: '.benefit-grid article p', index: 1 },
  { key: 'benefit3', selector: '.benefit-grid article p', index: 2 },
  { key: 'benefit4', selector: '.benefit-grid article p', index: 3 },
  { key: 'benefit5', selector: '.benefit-grid article p', index: 4 },
  { key: 'benefit6', selector: '.benefit-grid article p', index: 5 },
  { key: 'packagesTitle', selector: '.packages-head h2' },
  { key: 'package1Badge', selector: '.package-card .package-badge', index: 0 },
  { key: 'package1Name', selector: '.package-card .package-name', index: 0 },
  { key: 'package1Promo', selector: '.package-card .package-promo', index: 0 },
  { key: 'package1Original', selector: '.package-card .package-original', index: 0 },
  { key: 'package1AddBtn', selector: '.package-card .add-cart-btn', index: 0 },
  { key: 'package2Badge', selector: '.package-card .package-badge', index: 1 },
  { key: 'package2Name', selector: '.package-card .package-name', index: 1 },
  { key: 'package2Promo', selector: '.package-card .package-promo', index: 1 },
  { key: 'package2Original', selector: '.package-card .package-original', index: 1 },
  { key: 'package2AddBtn', selector: '.package-card .add-cart-btn', index: 1 },
  { key: 'package3Badge', selector: '.package-card .package-badge', index: 2 },
  { key: 'package3Name', selector: '.package-card .package-name', index: 2 },
  { key: 'package3Promo', selector: '.package-card .package-promo', index: 2 },
  { key: 'package3Original', selector: '.package-card .package-original', index: 2 },
  { key: 'package3Item2', selector: '.package-card .package-items li', index: 3 },
  { key: 'package3Item3', selector: '.package-card .package-items li', index: 4 },
  { key: 'package3AddBtn', selector: '.package-card .add-cart-btn', index: 2 },
  { key: 'topAwardAria', selector: '#top-award', attr: 'aria-label' },
  { key: 'topAwardKicker', selector: '.top-award-kicker' },
  { key: 'topAwardTitle', selector: '.top-award-head h2' },
  { key: 'topAwardText1', selector: '.top-award-head p', index: 1 },
  { key: 'topAwardText2', selector: '.top-award-head p', index: 2 },
  { key: 'storyKicker', selector: '.story-kicker' },
  { key: 'storyTitle', selector: '#story .story-head h2' },
  { key: 'storyFounder', selector: '.story-founder' },
  { key: 'storyHeading', selector: '.story-text h3' },
  { key: 'storyQuote', selector: '.story-quote' },
  { key: 'storyPara1', selector: '.story-text > p', index: 2 },
  { key: 'storyPara2', selector: '.story-text > p', index: 3 },
  { key: 'storyHighlight1', selector: '.story-highlight p', index: 0 },
  { key: 'storyHighlight2', selector: '.story-highlight p', index: 1 },
  { key: 'philosophyAria', selector: '#philosophy', attr: 'aria-label' },
  { key: 'philosophyKicker', selector: '.philosophy-kicker' },
  { key: 'philosophyTitle', selector: '.philosophy-head h2' },
  { key: 'philosophyHeading', selector: '.philosophy-text h3' },
  { key: 'philosophyPara1', selector: '.philosophy-text > p', index: 0 },
  { key: 'philosophyPara2', selector: '.philosophy-text > p', index: 1 },
  { key: 'philosophyHighlight1', selector: '.philosophy-highlight p', index: 0 },
  { key: 'philosophyHighlight2', selector: '.philosophy-highlight p', index: 1 },
  { key: 'philosophyHighlight3', selector: '.philosophy-highlight p', index: 2 },
  { key: 'repairEyebrow', selector: '.repair-eyebrow' },
  { key: 'repairTitle', selector: '#repair .section-head h2' },
  { key: 'repairIntro', selector: '.repair-intro' },
  { key: 'step1Title', selector: '#repair .step-body h3', index: 0 },
  { key: 'step1Text', selector: '#repair .step-body p', index: 0 },
  { key: 'step2Title', selector: '#repair .step-body h3', index: 1 },
  { key: 'step2Text', selector: '#repair .step-body p', index: 1 },
  { key: 'step3Title', selector: '#repair .step-body h3', index: 2 },
  { key: 'step3Text', selector: '#repair .step-body p', index: 2 },
  { key: 'step4Title', selector: '#repair .step-body h3', index: 3 },
  { key: 'step4Text', selector: '#repair .step-body p', index: 3 },
  { key: 'step5Title', selector: '#repair .step-body h3', index: 4 },
  { key: 'step5Text', selector: '#repair .step-body p', index: 4 },
  { key: 'reviewsEyebrow', selector: '#reviews .section-head .eyebrow' },
  { key: 'reviewsTitle', selector: '#reviews .section-head h2' },
  { key: 'stat1', selector: '.stats article span', index: 0 },
  { key: 'stat2', selector: '.stats article span', index: 1 },
  { key: 'stat3', selector: '.stats article span', index: 2 },
  { key: 'stat4', selector: '.stats article span', index: 3 },
  { key: 'review1', selector: '.quotes blockquote p', index: 0, html: true },
  { key: 'review2', selector: '.quotes blockquote p', index: 1, html: true },
  { key: 'review3', selector: '.quotes blockquote p', index: 2, html: true },
  { key: 'testiLoopAria', selector: '.testi-loop', attr: 'aria-label' },
  { key: 'testiCarouselAria', selector: '.testi-carousel', attr: 'aria-label' },
  { key: 'testiCarouselTitle', selector: '.testi-carousel-head h3' },
  { key: 'testiPrevAria', selector: '#testi-carousel-prev', attr: 'aria-label' },
  { key: 'testiNextAria', selector: '#testi-carousel-next', attr: 'aria-label' },
  { key: 'lightboxAria', selector: '#image-lightbox', attr: 'aria-label' },
  { key: 'faqEyebrow', selector: '#faq .section-head .eyebrow' },
  { key: 'faqTitle', selector: '#faq .section-head h2' },
  { key: 'faqQ1', selector: '#faq details summary', index: 0 },
  { key: 'faqA1', selector: '#faq details p', index: 0 },
  { key: 'faqQ2', selector: '#faq details summary', index: 1 },
  { key: 'faqA2', selector: '#faq details p', index: 1 },
  { key: 'faqQ3', selector: '#faq details summary', index: 2 },
  { key: 'faqA3', selector: '#faq details p', index: 2 },
  { key: 'faqQ4', selector: '#faq details summary', index: 3 },
  { key: 'faqA4', selector: '#faq details p', index: 3 },
  { key: 'faqQ5', selector: '#faq details summary', index: 4 },
  { key: 'faqA5', selector: '#faq details p', index: 4 },
  { key: 'faqQ6', selector: '#faq details summary', index: 5 },
  { key: 'faqA6', selector: '#faq details p', index: 5 },
  { key: 'faqQ7', selector: '#faq details summary', index: 6 },
  { key: 'faqA7', selector: '#faq details p', index: 6 },
  { key: 'faqQ8', selector: '#faq details summary', index: 7 },
  { key: 'faqA8', selector: '#faq details p', index: 7 },
  { key: 'faqQ9', selector: '#faq details summary', index: 8 },
  { key: 'faqA9', selector: '#faq details p', index: 8 },
  { key: 'faqQ10', selector: '#faq details summary', index: 9 },
  { key: 'faqA10', selector: '#faq details p', index: 9 },
  { key: 'cartDrawerAria', selector: '#cart-drawer', attr: 'aria-label' },
  { key: 'cartTitle', selector: '.cart-head h3' },
  { key: 'cartCloseAria', selector: '#cart-close', attr: 'aria-label' },
  { key: 'cartEmpty', selector: '#cart-empty' },
  { key: 'subtotalLabel', selector: '.cart-summary p' },
  { key: 'footerBrandText', selector: '.footer-brand p' },
  { key: 'footerContactTitle', selector: '.footer-col h3', index: 0 },
  { key: 'footerQuickTitle', selector: '.footer-col h3', index: 1 },
  { key: 'footerQuick1', selector: '.footer-col a', index: 1 },
  { key: 'footerQuick2', selector: '.footer-col a', index: 2 },
  { key: 'footerQuick3', selector: '.footer-col a', index: 3 },
  { key: 'footerQuick4', selector: '.footer-col a', index: 4 },
  { key: 'footerQuick5', selector: '.footer-col a', index: 5 },
  { key: 'footerFacebookTitle', selector: '.footer-col h3', index: 2 },
  { key: 'footerFacebookLink', selector: '.footer-col p a', index: 1 },
  { key: 'footerCopyright', selector: '.footer-bottom p' },
];

const EN_TRANSLATIONS = {
  docTitle: 'EzyBath | Medical-Grade 100% Natural Anti-Sensitivity Body Wash',
  metaDescription:
    "EzyBath medical-grade 100% natural anti-sensitivity body wash helps improve recurring skin problems with a gentle steroid-free formula for the whole family.",
  brandAria: 'EzyBath Home',
  menuAria: 'Open menu',
  quickActionsAria: 'Quick actions',
  langToggleAria: 'Language toggle',
  navHome: 'Home',
  navPackages: 'Product Packages',
  navBenefits: 'Key Benefits',
  navStory: 'Our Story',
  navRepair: 'How It Repairs',
  navReviews: 'Customer Testimonials',
  navFaq: 'FAQ',
  headerPackagesBtn: 'View Packages',
  headerCartAria: 'View shopping cart',
  heroH1: "Malaysia's Exclusive No.1",
  heroSubtitle: 'Medical-Grade · 100% Natural · Anti-Sensitivity Body Wash',
  heroText: '✨ Helped more than 10,000 people improve their skin problems within 3 months ✨',
  heroCtaPrimary: 'BUY NOW',
  heroCtaGhost: 'LEARN MORE',
  countdownAria: 'Limited-time promotion countdown',
  countdownTag: 'Limited-Time Offer Countdown • Buy 3, Get 2+2 Free',
  countdownTitle: "Today's Promotion Ends In",
  countdownHours: 'Hours',
  countdownMinutes: 'Minutes',
  countdownSeconds: 'Seconds',
  countdownCta: 'BUY NOW →',
  countdownNote: 'Offer Ending Soon · Limited to 30 Sets · Free Shipping Across Malaysia',
  benefitsKicker: 'Core Improvement Areas',
  benefitsTitle: 'EzyBath Medical-Grade Herbal Repair Body Wash',
  benefitsIntro:
    "From skin repair and stabilisation to daily soothing and moisturising, EzyBath uses a herbal repair approach to provide more comprehensive care for your skin's needs.",
  benefit1: 'Repair Damaged Skin Barrier / Cells',
  benefit2: 'Stabilise Sensitive Skin / Reduce Sensitivity',
  benefit3: 'Improve Skin Itchiness',
  benefit4: 'Replenish Skin Nutrients',
  benefit5: 'Improve Skin Immunity',
  benefit6: '360° Hydration & Moisturising',
  packagesEyebrow: 'EzyBath Antibacterial Body Wash',
  packagesTitle: 'Promotional Packages',
  packagesIntro:
    "Specially developed for skin conditions, providing comprehensive repair from the skin's surface to its deeper barrier, allowing you to choose the body wash that best suits your needs.",
  package1Badge: 'Starter Choice',
  package1Name: 'Trial Package',
  package1Promo: 'Suitable for first-time users',
  package1Original: 'Original Price: RM218',
  package1AddBtn: 'ADD TO CART',
  package2Badge: 'Most Popular',
  package2Name: 'Repair Treatment',
  package2Promo: 'Buy 2, Get 1 Free',
  package2Original: 'Original Price: RM654',
  package2AddBtn: 'ADD TO CART',
  package3Badge: 'Best Value',
  package3Name: 'Value Package',
  package3Promo: 'Buy 3, Get 2+2 Free',
  package3Original: 'Original Price: RM1090',
  package3Item2: 'EzyBath (Travel Pack) 30ml x1',
  package3Item3: 'RM14 Discount Voucher x1',
  package3AddBtn: 'ADD TO CART',
  topAwardAria: 'Asia Top 100 Favourite Product Award',
  topAwardKicker: 'Asia Top 100 Favourite Product Award',
  topAwardTitle: 'Asia Top 100 Favourite Product Award',
  topAwardText1:
    'After years of hard work and dedication, we are honoured to receive the Asia Top 100 Favourite Product Award.',
  topAwardText2:
    'We will continue to dedicate ourselves to providing healthy and 100% natural products to all Malaysians.',
  storyKicker: 'Our Original Purpose',
  storyTitle: 'Our Story',
  storyFounder: 'Founder: Boss HH',
  storyHeading: 'Helping More People Achieve Stable, Healthy and Worry-Free Skin',
  storyQuote:
    'Good Products + A Good Team + An Altruistic Heart + Choosing the Right Path + Perseverance = The Formula for Success',
  storyPara1:
    'We have always believed in running our business with positive energy. In both personal growth and business, we uphold the philosophy: “No matter how tall a tree grows, it should never forget its roots. No matter how successful a person becomes, they should never forget those who helped them.”',
  storyPara2:
    'Destiny is determined by heaven, but fortune is created by ourselves. As long as we continue working hard and constantly improve our character and professional abilities, we can gradually change our own destiny and improve the quality of life of others.',
  storyHighlight1: '🏆 Super Health Brand',
  storyHighlight2:
    'After years of dedication, we are honoured to have received a Super Health Brand nomination. This recognition has further strengthened our belief in continuing to create products that provide genuine value to our customers.',
  philosophyAria: 'Our Philosophy',
  philosophyKicker: 'Brand Philosophy',
  philosophyTitle: 'Our Philosophy',
  philosophyHeading: 'We Believe Everyone Deserves to Feel Confident and Have Healthy Skin',
  philosophyPara1:
    'We discovered that many people struggle every day with dry and itchy skin, redness, peeling and stinging sensations, as well as recurring problems such as eczema, psoriasis and hives. These skin problems not only cause frustration, but can also affect sleep and everyday life.',
  philosophyPara2:
    "It is not that people do not want to improve their skin. Many have tried numerous methods, yet their skin problems continue to recur. This does not mean that they have not used enough products, or that the products they used were not good enough or expensive enough. Instead, many people overlook something that comes into contact with their skin every single day — their body wash.",
  philosophyHighlight1:
    "If the cleansing power is too strong, the skin can become even drier and tighter after showering, damaging the skin's protective barrier. As a result, the skin is unable to repair itself properly.",
  philosophyHighlight2:
    'Some people can only continue relying on medicated creams, only for the problem to return once they stop using them. This is exactly why we created EzyBath — with the hope of helping people improve recurring skin problems. This is the original purpose behind EzyBath!',
  philosophyHighlight3:
    "Throughout our journey, we have witnessed many genuine transformations. Since the day EzyBath was founded, we have remained committed to our mission: To provide everyone with safe, gentle and steroid-free products, while genuinely addressing skin problems from deep within the skin.",
  repairEyebrow: 'How It Repairs',
  repairTitle: 'How to Achieve Natural Repair with EzyBath',
  repairIntro:
    'Use EzyBath consistently every day and witness the transformation! Watch eczema and psoriasis subside and reveal truly healthy, smooth and radiant skin.',
  step1Title: 'Wash Away Irritants & Block External Attacks',
  step1Text: 'Use EzyBath to wash away bacteria and dirt. Bericos Ectoin instantly forms a transparent 24-hour protective barrier.',
  step2Title: 'Release Nutrients for Instant Absorption',
  step2Text:
    'When the product is pumped out, Tocopherol Vitamin E, encapsulated using microencapsulation technology, instantly bursts open and releases fresh ingredients for rapid absorption into the skin.',
  step3Title: 'Penetrates Deep into the Skin to Target Inflammation at Its Root',
  step3Text:
    'No longer rely on oral medication or steroids. Our patented ingredients penetrate deep into the skin to address the root cause of inflammation that damages cells with a burning sensation.',
  step4Title: '360° Hydration to Relieve Dryness & Itchiness',
  step4Text:
    '8D Octaplex releases 8 different molecular sizes, locking in moisture from the deeper layers of the skin while moisturising the surface. No more dryness, cracking or stinging after showering.',
  step5Title: 'Improve Immunity & Repair Naturally',
  step5Text:
    "Replenish your skin with nutrients every day while showering and improve your skin's immunity. Allow your skin to naturally repair itself, becoming smoother and brighter while saying goodbye to recurring skin problems.",
  reviewsEyebrow: 'Customer Reviews',
  reviewsTitle: 'From Genuine Word of Mouth to Being Available in Pharmacies Across Malaysia',
  stat1: 'Improved Recurring Inflammation',
  stat2: "Malaysia's First Microencapsulation Technology",
  stat3: 'Extra-Large Capacity Worth Every Penny',
  stat4: 'KKM Safety Certified',
  review1:
    "<strong>Angel Tan</strong> I previously used inexpensive body washes containing SLS/SLES, which damaged my skin's protective barrier. After using EzyBath for two weeks, the redness, swelling and peeling really reduced significantly. My skin also no longer felt as dry, cracked or painful while showering, and the deeper layers of my skin finally stopped feeling like they were burning from inflammation.",
  review2:
    '<strong>Joshua Cheah</strong> I used to experience recurring eczema and psoriasis very easily. Now, with Bericos Ectoin penetrating deep into the skin to reduce inflammation, I feel much more comfortable after consistently using EzyBath. Most importantly, the 360° hydration from 8D Octaplex really gives me the feeling that my skin is no longer dry and itchy after showering.',
  review3:
    '<strong>Low Mei Ling</strong> I bought it for my family to use together, and everyone said their skin felt very comfortable as the Vitamin E bursts open and absorbs into the skin, helping the skin repair itself. I personally feel that my skin has become smoother and brighter as well, without having to rely on steroids. I have already repurchased 7 bottles.',
  testiLoopAria: 'Customer feedback image carousel',
  testiCarouselAria: 'Customer photo carousel',
  testiCarouselTitle: 'Genuine Customer Reviews',
  testiPrevAria: 'View previous image',
  testiNextAria: 'View next image',
  lightboxAria: 'Customer photo lightbox preview',
  faqEyebrow: 'Frequently Asked Questions (FAQ)',
  faqTitle: 'Everything You Want to Know, Answered Here',
  faqQ1: '1) Is the product safe and effective?',
  faqA1:
    'Absolutely safe. It has passed multiple national and international safety certifications, including KKM, SGS, ISO and GMP. The product is currently available at major pharmacies across Malaysia.',
  faqQ2: '2) How long does one bottle last?',
  faqA2:
    'One bottle of EzyBath contains 500ml and can last approximately 1 to 1.5 months, depending on individual usage and frequency.',
  faqQ3: '3) Can EzyBath be used long-term?',
  faqA3:
    'Yes. EzyBath is made from 100% natural ingredients and contains no medicinal substances, prohibited ingredients, chemicals, etc. Long-term use will not cause side effects or dependency. Even after your skin has fully repaired, you can continue using EzyBath as usual to help your skin remain more stable, smoother, softer and brighter.',
  faqQ4: '4) Can children use EzyBath?',
  faqA4:
    'The whole family can use it, regardless of whether they have skin problems. It can be used by children, elderly people, adults and pregnant women. EzyBath is made from 100% natural ingredients.',
  faqQ5: '5) Do I still need to take medication while using EzyBath?',
  faqA5:
    'If you are currently taking oral medication or applying medicated products, we do not recommend stopping them immediately. This is because your skin may already be accustomed to the medication and may require it to keep the condition under control. We recommend using EzyBath alongside your existing treatment first. Once your skin has stabilised, you can gradually reduce the amount of medication used according to your current condition.',
  faqQ6: '6) What is the difference between EzyBath and ordinary body wash?',
  faqA6:
    "While showering, EzyBath penetrates deep into the skin to reduce inflammation and repair the damaged skin barrier. It also forms a 24-hour protective barrier on your skin, helping to block external bacteria and dirt while ensuring that your skin does not lose moisture.",
  faqQ7: "7) What if EzyBath doesn't work for me?",
  faqA7:
    'We are confident in our product and provide a 30-Day Money-Back Guarantee if there are no results, allowing you to purchase and try EzyBath with peace of mind. Simply follow the applicable Terms & Conditions to process your refund.',
  faqQ8: '8) How long does it take to see results?',
  faqA8:
    'Some customers have reported seeing a reduction in redness within 7 days, while others may need to use EzyBath for approximately 1 month before seeing noticeable improvements. Results depend on each individual\'s absorption and repair capabilities. A complete repair treatment normally consists of 3 bottles (Buy 2, Get 1 Free).',
  faqQ9: '9) Do you have a physical store?',
  faqA9:
    'Yes. Our office is located in Penang: 119B Jalan Makloom, George Town, Penang, Malaysia. EzyBath is also available at selected partner pharmacies.',
  faqQ10: '10) What is the shelf life?',
  faqA10:
    'The standard shelf life is 3 years. If the product has not been opened, it will not evaporate. We always provide our customers with products from the latest production batch.',
  cartDrawerAria: 'Shopping cart and checkout',
  cartTitle: 'Shopping Cart',
  cartCloseAria: 'Close cart',
  cartEmpty: 'Your shopping cart is currently empty. Please select a package first.',
  subtotalLabel: 'Subtotal',
  footerBrandText:
    'Malaysia\'s Only Treatment Approach That Uses “Antibacterial & Itch Relief First, Followed by Deep Cellular Repair” to Achieve Itch Relief 🔥 Now Available at 10+ Pharmacies Across Malaysia',
  footerContactTitle: 'Contact Us',
  footerQuickTitle: 'Quick Links',
  footerQuick1: 'Promotional Packages',
  footerQuick2: 'Our Story',
  footerQuick3: 'How to Use?',
  footerQuick4: 'FAQ',
  footerQuick5: 'Customer Testimonials',
  footerFacebookTitle: 'Facebook Page',
  footerFacebookLink: 'EzyBath Antibacterial Body Wash',
  footerCopyright: '© 2026 EzyBath Antibacterial Body Wash. All Rights Reserved.',
};

const PACKAGE_NAME_BY_LANG = {
  zh: ['EzyBath 套装 RM198', 'EzyBath 套装 RM396', 'EzyBath 套装 RM640'],
  en: ['EzyBath Package RM198', 'EzyBath Package RM396', 'EzyBath Package RM640'],
};

const i18nOriginalSnapshot = new Map();

function getBindingTarget(binding) {
  const nodes = document.querySelectorAll(binding.selector);
  if (nodes.length === 0) {
    return null;
  }

  return nodes[binding.index || 0] || null;
}

function takeI18nSnapshot() {
  I18N_BINDINGS.forEach((binding) => {
    const target = getBindingTarget(binding);
    if (!target) {
      return;
    }

    if (binding.attr) {
      i18nOriginalSnapshot.set(binding.key, target.getAttribute(binding.attr) || '');
      return;
    }

    if (binding.html) {
      i18nOriginalSnapshot.set(binding.key, target.innerHTML);
      return;
    }

    i18nOriginalSnapshot.set(binding.key, target.textContent || '');
  });
}

function setLangButtonState(lang) {
  if (!langZhBtn || !langEnBtn) {
    return;
  }

  const isZh = lang === 'zh';
  langZhBtn.classList.toggle('active', isZh);
  langEnBtn.classList.toggle('active', !isZh);
  langZhBtn.setAttribute('aria-pressed', String(isZh));
  langEnBtn.setAttribute('aria-pressed', String(!isZh));
}

function updatePackageButtonDatasetNames(lang) {
  const names = PACKAGE_NAME_BY_LANG[lang] || PACKAGE_NAME_BY_LANG.zh;
  const packageButtons = document.querySelectorAll('.package-card .add-cart-btn');

  packageButtons.forEach((button, index) => {
    if (!names[index]) {
      return;
    }
    button.dataset.name = names[index];
  });
}

function updateCartFabLabel(lang) {
  if (!cartFab) {
    return;
  }

  const label = lang === 'en' ? 'Shopping Cart' : '购物车';
  if (cartFab.firstChild && cartFab.firstChild.nodeType === Node.TEXT_NODE) {
    cartFab.firstChild.nodeValue = `${label}\n      `;
    return;
  }

  cartFab.insertBefore(document.createTextNode(`${label} `), cartFab.firstChild);
}

function applyLanguage(lang) {
  currentLanguage = lang === 'en' ? 'en' : 'zh';
  document.documentElement.lang = currentLanguage === 'en' ? 'en' : 'zh-Hans';
  setLangButtonState(currentLanguage);

  I18N_BINDINGS.forEach((binding) => {
    const target = getBindingTarget(binding);
    if (!target) {
      return;
    }

    const value =
      currentLanguage === 'en' ? EN_TRANSLATIONS[binding.key] : i18nOriginalSnapshot.get(binding.key) || '';

    if (typeof value !== 'string') {
      return;
    }

    if (binding.attr) {
      target.setAttribute(binding.attr, value);
      return;
    }

    if (binding.html) {
      target.innerHTML = value;
      return;
    }

    target.textContent = value;
  });

  const benefitsKickerEl = document.querySelector('.benefits-kicker');
  const benefitsIntroEl = document.querySelectorAll('#benefits .section-head > p')[1];
  const packagesEyebrowEl = document.querySelector('.packages-head .eyebrow');
  const packagesIntroEl = document.querySelectorAll('.packages-head > p')[1];

  if (currentLanguage === 'en') {
    if (benefitsKickerEl) {
      benefitsKickerEl.textContent = 'Core Improvement Areas';
    }
    if (benefitsIntroEl) {
      benefitsIntroEl.textContent =
        "From skin repair and stabilisation to daily soothing and moisturising, EzyBath uses a herbal repair approach to provide more comprehensive care for your skin's needs.";
    }
    if (packagesEyebrowEl) {
      packagesEyebrowEl.textContent = 'EzyBath Antibacterial Body Wash';
    }
    if (packagesIntroEl) {
      packagesIntroEl.textContent =
        "Specially developed for skin conditions, providing comprehensive repair from the skin's surface to its deeper barrier, allowing you to choose the body wash that best suits your needs.";
    }
  } else {
    if (benefitsKickerEl) {
      benefitsKickerEl.textContent = '核心改善方向';
    }
    if (benefitsIntroEl) {
      benefitsIntroEl.textContent = '从肌肤修护到稳定状态，再到日常舒缓保湿，EzyBath 以草本修护逻辑覆盖更全面的皮肤护理需求。';
    }
    if (packagesEyebrowEl) {
      packagesEyebrowEl.textContent = 'EzyBath 抑菌沐浴露';
    }
    if (packagesIntroEl) {
      packagesIntroEl.textContent =
        '专门针对皮肤病研发，从皮肤表面到深层屏障，全方位修复，一次选到适合自己的沐浴露';
    }
  }

  updatePackageButtonDatasetNames(currentLanguage);
  updateCartFabLabel(currentLanguage);
  renderTestimonialLoop();
  renderDeliveryCarousel();
  renderCart();
}

function buildAlternatingTestimonialImages() {
  const males = [...TESTIMONIAL_LOOP_MALE_IMAGES];
  const females = [...TESTIMONIAL_LOOP_FEMALE_IMAGES];
  const ordered = [];

  while (males.length > 0 && females.length > 0) {
    ordered.push(males.shift(), females.shift());
  }

  return [...ordered, ...males, ...females].filter(Boolean);
}

function renderTestimonialLoop() {
  const orderedImages = buildAlternatingTestimonialImages();
  if (!testimonialLoopTrack || orderedImages.length === 0) {
    return;
  }

  const imageAltPrefix = currentLanguage === 'en' ? 'Customer feedback image' : '顾客反馈图片';

  const primary = orderedImages
    .map((src, index) => {
      const faceFocusClass = TESTIMONIAL_FACE_FOCUS_IMAGES.has(src) ? ' testi-face-focus' : '';
      return `<article class="testi-photo"><img class="${faceFocusClass.trim()}" src="${src}" alt="${imageAltPrefix} ${index + 1}" loading="lazy" /></article>`;
    })
    .join('');

  const duplicate = orderedImages
    .map((src) => {
      const faceFocusClass = TESTIMONIAL_FACE_FOCUS_IMAGES.has(src) ? ' testi-face-focus' : '';
      return `<article class="testi-photo" aria-hidden="true"><img class="${faceFocusClass.trim()}" src="${src}" alt="" loading="lazy" /></article>`;
    })
    .join('');

  testimonialLoopTrack.innerHTML = primary + duplicate;
}

function renderDeliveryCarousel() {
  if (!deliveryCarouselTrack || DELIVERY_REVIEWS.length === 0) {
    return;
  }

  const isEnglish = currentLanguage === 'en';

  if (deliveryCarouselTitle) {
    deliveryCarouselTitle.textContent = isEnglish ? 'Customer Feedback' : '到货记录 & 反馈';
  }

  if (deliveryCarouselSection) {
    deliveryCarouselSection.setAttribute('aria-label', isEnglish ? 'Delivery feedback carousel' : '配送反馈轮播');
  }

  if (deliveryCarouselPrev) {
    deliveryCarouselPrev.setAttribute('aria-label', isEnglish ? 'View previous feedback' : '查看上一条');
  }

  if (deliveryCarouselNext) {
    deliveryCarouselNext.setAttribute('aria-label', isEnglish ? 'View next feedback' : '查看下一条');
  }

  if (deliveryCarouselSection) {
    deliveryCarouselSection.style.setProperty('--cards-per-view', String(getDeliveryCardsPerView()));
  }

  deliveryCarouselTrack.innerHTML = DELIVERY_REVIEWS.map((item, index) => {
    const reviewText = isEnglish ? item.en : item.zh;
    const reviewAlt = isEnglish ? `Delivery feedback image ${index + 1}` : `配送反馈图片 ${index + 1}`;
    const verifiedText = isEnglish ? 'Verified' : '已验证';
    const verifiedDate = formatFeedbackDate(item.date, isEnglish);

    return `
      <article class="delivery-slide" aria-label="${item.author}">
        <img class="delivery-slide-image" src="${item.image}" alt="${reviewAlt}" loading="lazy" />
        <div class="delivery-slide-body">
          <p class="delivery-slide-stars" aria-label="5 stars" role="img">★★★★★</p>
          <p class="delivery-slide-text">${reviewText}</p>
          <div class="delivery-slide-meta">
            <p class="delivery-slide-author">${item.author}</p>
            <p class="delivery-slide-verified">✓ ${verifiedText} · <span class="delivery-slide-date">${verifiedDate}</span></p>
          </div>
        </div>
      </article>
    `;
  }).join('');

  updateDeliveryCarouselPosition();
}

function moveDeliveryCarousel(step) {
  if (!deliveryCarouselTrack || DELIVERY_REVIEWS.length === 0) {
    return;
  }

  const maxIndex = getDeliveryCarouselMaxIndex();
  deliveryCarouselIndex = Math.min(maxIndex, Math.max(0, deliveryCarouselIndex + step));
  updateDeliveryCarouselPosition();
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
    const removeLabel = currentLanguage === 'en' ? 'Remove' : '删除';
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
          <button class="cart-remove" type="button" data-action="remove" data-id="${item.id}">${removeLabel}</button>
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
        submitBtn.textContent = currentLanguage === 'en' ? 'Connecting payment...' : '正在连接支付...';
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
        throw new Error(result?.message || (currentLanguage === 'en' ? 'Failed to create payment link. Please try again later.' : '创建支付链接失败，请稍后重试。'));
      }

      window.location.href = result.url;
    } catch (error) {
      alert(error instanceof Error ? error.message : (currentLanguage === 'en' ? 'Failed to create payment link. Please try again later.' : '创建支付链接失败，请稍后重试。'));
    } finally {
      if (submitBtn instanceof HTMLButtonElement) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalSubmitText || (currentLanguage === 'en' ? 'PAY NOW' : '立即支付');
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
  imageLightboxImg.alt = imageAlt || (currentLanguage === 'en' ? 'Customer full-size photo' : '顾客实拍大图');
  imageLightbox.hidden = false;
  imageLightbox.setAttribute('aria-hidden', 'false');
  document.body.classList.add('no-scroll');
}

function initBeforeAfterSlider() {
  if (!beforeAfterSlider) {
    return;
  }

  const stage = beforeAfterSlider.querySelector('.bna-stage');
  const range = beforeAfterSlider.querySelector('.bna-range');

  if (!(stage instanceof HTMLElement) || !(range instanceof HTMLInputElement)) {
    return;
  }

  const clampValue = (value) => Math.min(100, Math.max(0, value));

  const setPosition = (value) => {
    const next = clampValue(value);
    beforeAfterSlider.style.setProperty('--bna-position', `${next}%`);
    range.value = String(next);
  };

  const setPositionFromClientX = (clientX) => {
    const rect = stage.getBoundingClientRect();
    if (rect.width <= 0) {
      return;
    }

    const relative = ((clientX - rect.left) / rect.width) * 100;
    setPosition(relative);
  };

  range.addEventListener('input', () => {
    setPosition(Number(range.value));
  });

  const onPointerDown = (event) => {
    if (!(event instanceof PointerEvent)) {
      return;
    }

    beforeAfterSlider.classList.add('is-dragging');
    setPositionFromClientX(event.clientX);
    stage.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event) => {
    if (!(event instanceof PointerEvent) || (event.buttons === 0 && event.pointerType !== 'touch')) {
      return;
    }

    setPositionFromClientX(event.clientX);
  };

  const onPointerUp = () => {
    beforeAfterSlider.classList.remove('is-dragging');
  };

  stage.addEventListener('pointerdown', onPointerDown);
  stage.addEventListener('pointermove', onPointerMove);
  stage.addEventListener('pointerup', onPointerUp);
  stage.addEventListener('pointercancel', onPointerUp);
  stage.addEventListener('lostpointercapture', onPointerUp);

  setPosition(Number(range.value));
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

if (deliveryCarouselPrev && deliveryCarouselNext && deliveryCarouselTrack) {
  deliveryCarouselPrev.addEventListener('click', () => {
    moveDeliveryCarousel(-1);
  });

  deliveryCarouselNext.addEventListener('click', () => {
    moveDeliveryCarousel(1);
  });
}

window.addEventListener('resize', () => {
  if (!deliveryCarouselTrack) {
    return;
  }

  if (deliveryCarouselSection) {
    deliveryCarouselSection.style.setProperty('--cards-per-view', String(getDeliveryCardsPerView()));
  }

  updateDeliveryCarouselPosition();
});

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

if (langZhBtn) {
  langZhBtn.addEventListener('click', () => {
    applyLanguage('zh');
  });
}

if (langEnBtn) {
  langEnBtn.addEventListener('click', () => {
    applyLanguage('en');
  });
}

takeI18nSnapshot();
applyLanguage('en');
initBeforeAfterSlider();
