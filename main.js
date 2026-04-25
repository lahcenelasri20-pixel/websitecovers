// Custom Cursor Logic
const cursor = document.querySelector('.custom-cursor');
const cursorText = document.querySelector('.cursor-text');

if (cursor) {
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    const interactiveElements = document.querySelectorAll('img, a, button, .collection-card');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hovering');
            if (el.tagName === 'IMG' || el.classList.contains('collection-card')) {
                cursorText.textContent = 'VIEW';
            } else {
                cursorText.textContent = 'EXPLORE';
            }
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hovering');
        });
    });
}

// Hero Gallery Logic
const mainImage = document.getElementById('main-hero-image');
const heroTitle = document.getElementById('hero-title');
const heroDetails = document.getElementById('hero-details');
const thumbnails = document.querySelectorAll('.thumbnail-item');

if (mainImage && thumbnails.length > 0) {
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', () => {
            // Remove active class from all thumbnails
            thumbnails.forEach(t => t.classList.remove('active'));
            // Add active class to clicked thumbnail
            thumb.classList.add('active');
            
            // Update main image with simple fade transition
            mainImage.style.opacity = '0';
            
            setTimeout(() => {
                mainImage.src = thumb.dataset.src;
                mainImage.alt = thumb.dataset.title;
                if (heroTitle) heroTitle.textContent = thumb.dataset.title;
                if (heroDetails) heroDetails.textContent = thumb.dataset.details;
                mainImage.style.opacity = '1';
            }, 300);
        });
    });
}

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(element => {
    observer.observe(element);
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '#admin') return;
        const target = document.querySelector(href);
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Navigation scroll effect
let lastScroll = 0;
const nav = document.querySelector('nav');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        nav.style.boxShadow = 'none';
        return;
    }
    
    if (currentScroll > lastScroll) {
        // Scrolling down
        nav.style.transform = 'translateY(-100%)';
    } else {
        // Scrolling up
        nav.style.transform = 'translateY(0)';
        nav.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)';
    }
    lastScroll = currentScroll;
});

// Lightbox Logic
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-image');
const lightboxTitle = document.getElementById('lightbox-title');
const lightboxDetails = document.getElementById('lightbox-details');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');

let currentArtworks = [];
let currentIndex = 0;

function openLightbox(src, title, details, artworks = []) {
    if (!lightbox || !lightboxImg) return;
    
    currentArtworks = artworks.length > 0 ? artworks : [{ src, title, details }];
    currentIndex = currentArtworks.findIndex(art => art.src === src);
    if (currentIndex === -1) currentIndex = 0;

    updateLightboxContent();
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    // Only restore scroll if collection detail is not open
    if (!collectionDetailView || collectionDetailView.style.display === 'none') {
        document.body.style.overflow = '';
    }
}

function updateLightboxContent() {
    const art = currentArtworks[currentIndex];
    if (!art) return;

    lightboxImg.style.opacity = '0';
    
    setTimeout(() => {
        lightboxImg.src = art.src;
        if (lightboxTitle) lightboxTitle.textContent = art.title;
        if (lightboxDetails) lightboxDetails.textContent = art.details;
        lightboxImg.style.opacity = '1';
    }, 200);
    
    if (lightboxPrev) lightboxPrev.style.display = currentArtworks.length > 1 ? 'block' : 'none';
    if (lightboxNext) lightboxNext.style.display = currentArtworks.length > 1 ? 'block' : 'none';
}

function showNext() {
    currentIndex = (currentIndex + 1) % currentArtworks.length;
    updateLightboxContent();
}

function showPrev() {
    currentIndex = (currentIndex - 1 + currentArtworks.length) % currentArtworks.length;
    updateLightboxContent();
}

if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxClose.addEventListener('mouseenter', () => {
        cursor.classList.add('hovering');
        cursorText.textContent = 'CLOSE';
    });
    lightboxClose.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
}

if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        showNext();
    });
    lightboxNext.addEventListener('mouseenter', () => {
        cursor.classList.add('hovering');
        cursorText.textContent = 'NEXT';
    });
    lightboxNext.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
}

if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        showPrev();
    });
    lightboxPrev.addEventListener('mouseenter', () => {
        cursor.classList.add('hovering');
        cursorText.textContent = 'PREV';
    });
    lightboxPrev.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
}

if (lightbox) {
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-content')) closeLightbox();
    });
}

// Hero Main Image Preview
if (mainImage) {
    mainImage.addEventListener('click', () => {
        // Collect hero thumbnails for navigation
        const heroArtworks = Array.from(document.querySelectorAll('.thumbnail-item img')).map(img => ({
            src: img.src,
            title: img.alt,
            details: "Original Artwork"
        }));
        openLightbox(mainImage.src, heroTitle.textContent, heroDetails.textContent, heroArtworks);
    });
}

// Enhanced Cursor Logic for Preview
function updateCursorBehavior() {
    const previewableElements = document.querySelectorAll('#main-hero-image, .artwork-item img');
    
    previewableElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hovering');
            cursorText.textContent = 'PREVIEW';
        });
    });
}

// Collection State Management
const DEFAULT_COLLECTIONS = {
    figurative: {
        name: "Figurative",
        description: "Exploring the human form through a lens of classical tradition and contemporary soul. This collection focuses on the emotional depth and physical presence of the subject.",
        artworks: [
            { src: "/Paints/Fine-Art-Kosovo-Maiden-Original-Figurative-Oil-Painting-on-Canvas-after-Uros-Predic-by-artist-Darko-Topalski.jpg", title: "Kosovo Maiden", details: "Original Oil on Canvas" },
            { src: "/Paints/Fine-Art-Couple-at-the-Spanish-Square-in-Seville-Original-Oil-Painting-on-Canvas-by-artist-Darko-Topalski.jpg", title: "Couple at Spanish Square", details: "Figurative Oil Study" }
        ]
    },
    nature: {
        name: "Nature",
        description: "A topography of light and color, capturing the raw essence of the natural world. From serene lakes to rugged mountains, these works celebrate the organic beauty of our environment.",
        artworks: [
            { src: "/hero/Radgost-Rtanj-and-Lake-Original-landscape-Oil-Painting-on-Canvas-by-artist-Darko-Topalski.jpg", title: "Radgost Rtanj and Lake", details: "Landscape Oil on Canvas" },
            { src: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=1000", title: "Topography of Light", details: "Abstract Nature Series" }
        ]
    },
    portraits: {
        name: "Portraits",
        description: "Capturing the silent gaze and the movement of the soul. Each portrait is an intimate study of character, light, and the passage of time.",
        artworks: [
            { src: "/Paints/Fine-Art-Couple-at-the-Spanish-Square-in-Seville-Original-Oil-Painting-on-Canvas-by-artist-Darko-Topalski.jpg", title: "Soul and Movement", details: "Portrait Oil on Canvas" },
            { src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=1000", title: "The Silent Gaze", details: "Classical Portraiture" }
        ]
    },
    'limited-editions': {
        name: "Limited Editions",
        description: "Exclusive series and numbered prints for the discerning collector. These pieces represent a curated selection of some of the most sought-after works.",
        artworks: [
            { src: "/hero/Radgost-Rtanj-and-Lake-Original-landscape-Oil-Painting-on-Canvas-by-artist-Darko-Topalski.jpg", title: "Exclusive Series I", details: "Limited Print #1/50" },
            { src: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=1000", title: "Exclusive Series II", details: "Limited Print #1/50" }
        ]
    }
};

const DEFAULT_SETTINGS = {
    artistName: "Evelyn Thorne",
    artistTitle: "Fine Art & Creative Direction",
    aboutBio: "Based in Paris, I specialize in oil-on-canvas and mixed media, blending traditional techniques with contemporary aesthetics to capture the ephemeral beauty of the human experience.",
    socials: {
        instagram: "https://instagram.com",
        pinterest: "https://pinterest.com",
        linkedin: "https://linkedin.com"
    },
    hero: [
        { src: "/hero/Radgost-Rtanj-and-Lake-Original-landscape-Oil-Painting-on-Canvas-by-artist-Darko-Topalski.jpg", title: "Radgost Rtanj and Lake", details: "Original landscape Oil Painting on Canvas" },
        { src: "/Paints/Fine-Art-Couple-at-the-Spanish-Square-in-Seville-Original-Oil-Painting-on-Canvas-by-artist-Darko-Topalski.jpg", title: "Couple at the Spanish Square", details: "Original Oil Painting on Canvas" },
        { src: "/hero/Radgost-Rtanj-and-Lake-Original-landscape-Oil-Painting-on-Canvas-by-artist-Darko-Topalski.jpg", title: "Radgost Rtanj and Lake", details: "Original landscape Oil Painting on Canvas" }
    ]
};

let collectionData = DEFAULT_COLLECTIONS;
let siteSettings = DEFAULT_SETTINGS;

// UI Elements
const collectionDetailView = document.getElementById('collection-detail');
const currentCollectionName = document.getElementById('current-collection-name');
const currentCollectionDescription = document.getElementById('current-collection-description');
const collectionArtworksGrid = document.getElementById('collection-artworks-grid');
const backButton = document.getElementById('back-to-collections');
const collectionsGrid = document.getElementById('collections-grid');

// Old renderGallery removed to avoid duplicates

// Initial Render moved to initAll

let cartItems = [];
const cartDrawer = document.getElementById('cart-drawer');
const cartOverlay = document.getElementById('cart-overlay');
const cartItemsContainer = document.getElementById('cart-items');
const totalCountElement = document.getElementById('total-count');
const cartCountElement = document.getElementById('cart-count');

function toggleCart(show = true) {
    if (!cartDrawer || !cartOverlay) return;
    if (show) {
        cartDrawer.classList.add('active');
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    } else {
        cartDrawer.classList.remove('active');
        cartOverlay.classList.remove('active');
        // Only restore overflow if other overlays are closed
        if ((!collectionDetailView || collectionDetailView.style.display === 'none') && 
            (!lightbox || !lightbox.classList.contains('active'))) {
            document.body.style.overflow = '';
        }
    }
}

function renderCart() {
    if (!cartItemsContainer || !totalCountElement || !cartCountElement) return;

    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart-msg">Your collection is empty.</div>';
    } else {
        cartItemsContainer.innerHTML = cartItems.map((item, index) => `
            <div class="cart-item">
                <img src="${item.src}" alt="${item.title}">
                <div class="cart-item-info">
                    <h4>${item.title}</h4>
                    <p>${item.details}</p>
                </div>
                <button class="remove-item" onclick="removeFromCart(${index})" aria-label="Remove Item">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"/></svg>
                </button>
            </div>
        `).join('');
    }

    totalCountElement.textContent = cartItems.length;
    cartCountElement.textContent = `(${cartItems.length})`;
}

window.removeFromCart = function(index) {
    cartItems.splice(index, 1);
    renderCart();
};

function addToCart(item) {
    cartItems.push(item);
    renderCart();
    toggleCart(true); // Automatically open the cart to show added item
    
    if (cartCountElement) {
        cartCountElement.style.color = 'var(--gold-color)';
        setTimeout(() => {
            cartCountElement.style.color = '';
        }, 1000);
    }
}

function openWhatsApp() {
    if (cartItems.length === 0) return;
    
    const artistPhone = "1234567890"; // Placeholder
    let message = "Hello Evelyn Thorne, I am interested in the following pieces from your collection:\n\n";
    cartItems.forEach((item, i) => {
        message += `${i+1}. ${item.title} (${item.details})\n`;
    });
    message += "\nPlease let me know about their availability and pricing.";
    
    const url = `https://wa.me/${artistPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// Event Listeners for Cart
document.getElementById('close-cart')?.addEventListener('click', () => toggleCart(false));
cartOverlay?.addEventListener('click', () => toggleCart(false));
document.querySelector('.nav-cart')?.addEventListener('click', (e) => {
    e.preventDefault();
    toggleCart(true);
});
document.getElementById('whatsapp-contact')?.addEventListener('click', openWhatsApp);

function flyToCart(imgElement, itemData) {
    const cartIcon = document.querySelector('.nav-cart');
    if (!cartIcon || !imgElement || !window.gsap) {
        addToCart(itemData);
        return;
    }

    const rect = imgElement.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();

    // Create a clone
    const clone = imgElement.cloneNode();
    
    Object.assign(clone.style, {
        position: 'fixed',
        top: rect.top + 'px',
        left: rect.left + 'px',
        width: rect.width + 'px',
        height: rect.height + 'px',
        zIndex: '1000000',
        pointerEvents: 'none',
        borderRadius: '2px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
        objectFit: 'cover'
    });

    document.body.appendChild(clone);

    // Calculate center-to-center coordinates
    const deltaX = (cartRect.left + cartRect.width / 2) - (rect.left + rect.width / 2);
    const deltaY = (cartRect.top + cartRect.height / 2) - (rect.top + rect.height / 2);

    gsap.to(clone, {
        duration: 1,
        x: deltaX,
        y: deltaY,
        scale: 0.05,
        opacity: 0.2,
        rotation: 360, // Full elegant spin
        ease: "power3.inOut",
        onComplete: () => {
            clone.remove();
            addToCart(itemData);
            // Refined bounce on cart icon
            gsap.fromTo(cartIcon, 
                { scale: 1 }, 
                { scale: 1.6, duration: 0.2, yoyo: true, repeat: 1, ease: "back.out(3)" }
            );
        }
    });
}

window.openCollection = function(id) {
    const data = collectionData[id];
    if (!data) return;

    currentCollectionName.textContent = data.name;
    if (currentCollectionDescription) currentCollectionDescription.textContent = data.description;
    
    collectionArtworksGrid.innerHTML = data.artworks.map(art => `
        <div class="artwork-item fade-in visible">
            <img src="${art.src}" alt="${art.title}" data-title="${art.title}" data-details="${art.details}">
            <div class="artwork-item-info">
                <div class="artwork-item-text">
                    <h4>${art.title}</h4>
                    <p>${art.details}</p>
                </div>
                <button class="add-to-cart-btn" aria-label="Add to Cart">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6zM3 6h18M16 10a4 4 0 01-8 0"/></svg>
                </button>
            </div>
        </div>
    `).join('');

    // Attach listeners
    collectionArtworksGrid.querySelectorAll('.artwork-item').forEach(item => {
        const img = item.querySelector('img');
        const btn = item.querySelector('.add-to-cart-btn');

        img.addEventListener('click', () => {
            openLightbox(img.src, img.dataset.title, img.dataset.details, data.artworks);
        });

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            flyToCart(img, {
                src: img.src,
                title: img.dataset.title,
                details: img.dataset.details
            });
        });

        btn.addEventListener('mouseenter', () => {
            cursor.classList.add('hovering');
            cursorText.textContent = 'ADD';
        });
        btn.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });

    updateCursorBehavior();

    // Next Collection Logic
    const collectionIds = Object.keys(collectionData);
    const currentIndex = collectionIds.indexOf(id);
    const nextIndex = (currentIndex + 1) % collectionIds.length;
    const nextId = collectionIds[nextIndex];
    const nextData = collectionData[nextId];

    const nextWrapper = document.getElementById('next-collection-wrapper');
    const nextName = document.getElementById('next-collection-name');
    const nextBtn = document.getElementById('next-collection-btn');

    if (nextWrapper && nextName && nextBtn) {
        nextWrapper.style.display = 'block';
        nextName.textContent = nextData.name;
        
        // Remove old event listeners
        const newBtn = nextBtn.cloneNode(true);
        nextBtn.parentNode.replaceChild(newBtn, nextBtn);
        
        newBtn.addEventListener('click', () => {
            if (collectionDetailView) {
                // Scroll to top smoothly
                collectionDetailView.scrollTo({ top: 0, behavior: 'smooth' });
                
                // Fade out content briefly
                const container = collectionDetailView.querySelector('.container');
                if (container) {
                    container.style.opacity = '0';
                    container.style.transition = 'opacity 0.3s ease';
                    
                    setTimeout(() => {
                        openCollection(nextId);
                        container.style.opacity = '1';
                    }, 300);
                } else {
                    openCollection(nextId);
                }
            }
        });
    }

    if (collectionDetailView) {
        collectionDetailView.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

window.closeCollection = function() {
    if (collectionDetailView) {
        collectionDetailView.style.display = 'none';
        document.body.style.overflow = '';
    }
}

// Click listeners are now handled via onclick in the dynamic HTML

if (backButton) {
    backButton.addEventListener('click', closeCollection);
}

// Initial Cursor setup
updateCursorBehavior();

console.log('Evelyn Thorne Portfolio Loaded');


function renderGallery() {
    if (!collectionsGrid) return;
    
    collectionsGrid.innerHTML = Object.entries(collectionData).map(([id, data]) => {
        const coverImage = data.coverImg || (data.artworks && data.artworks.length > 0 ? data.artworks[0].src : 'https://via.placeholder.com/800x1000?text=No+Cover');
        return `
        <div class="collection-card fade-in" onclick="openCollection('${id}')">
            <div class="card-image-container">
                <img src="${coverImage}" alt="${data.name}">
                <div class="card-overlay">
                    <span class="explore-text">EXPLORE</span>
                </div>
            </div>
            <div class="card-info">
                <h3>${data.name}</h3>
                <p>${data.artworks.length} Piece${data.artworks.length !== 1 ? 's' : ''}</p>
            </div>
        </div>
        `;
    }).join('');

    // Re-observe new elements
    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}



function applySiteSettings() {
    // Apply Name
    const nameElements = ['dynamic-name', 'dynamic-footer-name', 'dynamic-about-name', 'admin-sidebar-name'];
    nameElements.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = siteSettings.artistName;
    });
    
    document.title = `${siteSettings.artistName} | Portfolio`;
    
    // Apply Title & Bio
    const titleEl = document.getElementById('dynamic-about-title');
    if (titleEl) titleEl.textContent = siteSettings.artistTitle;
    
    const bioEl = document.getElementById('dynamic-about-bio');
    if (bioEl) bioEl.innerHTML = `<p>${siteSettings.aboutBio}</p>`;
    
    // Apply Socials
    const igEl = document.getElementById('dynamic-ig');
    if (igEl) igEl.href = siteSettings.socials.instagram;
    const pinEl = document.getElementById('dynamic-pin');
    if (pinEl) pinEl.href = siteSettings.socials.pinterest;
    const liEl = document.getElementById('dynamic-li');
    if (liEl) liEl.href = siteSettings.socials.linkedin;
    
    // Apply Hero
    // This updates the thumbnail data-attrs and initial state
    const thumbs = document.querySelectorAll('.thumbnail-item');
    thumbs.forEach((thumb, index) => {
        if (siteSettings.hero[index]) {
            const h = siteSettings.hero[index];
            thumb.dataset.src = h.src;
            thumb.dataset.title = h.title;
            thumb.dataset.details = h.details;
            const img = thumb.querySelector('img');
            if (img) img.src = h.src;
        }
    });
    
    // Update main hero if it hasn't been interacted with
    const mainImg = document.getElementById('main-hero-image');
    if (mainImg) {
        mainImg.src = siteSettings.hero[0].src;
        const ht = document.getElementById('dynamic-hero-title');
        if (ht) ht.textContent = siteSettings.hero[0].title;
        const hd = document.getElementById('dynamic-hero-details');
        if (hd) hd.textContent = siteSettings.hero[0].details;
    }
}


// Robust Initialization
function initAll() {
    applySiteSettings();
    renderGallery();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
} else {
    initAll();
}
