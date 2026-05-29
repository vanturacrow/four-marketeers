// ===== NAVIGATION & SCROLL BEHAVIOR =====
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('[data-nav]');

// Close mobile menu
function closeMobileMenu() {
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('active');
}

// Toggle hamburger menu
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', hamburger.classList.contains('active'));
    navMenu.classList.toggle('active');
});

// Close menu on nav link click and handle smooth scroll
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        closeMobileMenu();
    });
});

// ===== INTERSECTION OBSERVER FOR ACTIVE NAV STATE =====
const observerOptions = {
    threshold: [0, 0.25, 0.5, 0.75, 1],
    rootMargin: `-${80 + 100}px 0px -66% 0px`
};

const observer = new IntersectionObserver((entries) => {
    let activeSection = null;

    entries.forEach(entry => {
        if (entry.isIntersecting) {
            activeSection = entry.target.id;
        }
    });

    if (activeSection) {
        navLinks.forEach(link => {
            const section = link.getAttribute('data-nav');
            if (section === activeSection) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
}, observerOptions);

// Observe all sections
document.querySelectorAll('section[id]').forEach(section => {
    observer.observe(section);
});

// ===== INTERSECTION OBSERVER FOR SCROLL REVEAL ANIMATIONS =====
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal');
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
});

// Observe all animatable elements
const animatableElements = document.querySelectorAll(
    '.value-card, .who-image, .timeline-item, .manifesto-block, .service-card, .staff-card, .portfolio-intro, .portfolio-card'
);

animatableElements.forEach(el => {
    revealObserver.observe(el);
});

// ===== PORTFOLIO MODAL =====
const modal = document.getElementById('portfolioModal');
const modalClose = document.querySelector('.modal-close');

const portfolioData = {
    1: {
        title: 'Toronto Café Rebrand',
        client: 'Coffee Retail',
        description: 'A beloved Toronto café needed a modern refresh while maintaining its heritage charm. We developed a new brand identity that celebrates both tradition and innovation.',
        results: [
            'Instagram followers increased 240%',
            'Foot traffic up 35% post-launch',
            'New logo now appears on 200+ locations',
            'Won Regional Design Award 2023'
        ]
    },
    2: {
        title: 'Fitness Startup Launch',
        client: 'Health & Wellness',
        description: 'A new fitness app needed visibility in a crowded market. We created a multi-channel campaign that positioned them as the premium, accessible alternative to big-box gyms.',
        results: [
            '50,000 app downloads in first 3 months',
            'Avg. session time: 32 minutes',
            'Featured in top 10 fitness apps category',
            '87% user retention rate'
        ]
    },
    3: {
        title: 'SaaS B2B Strategy',
        client: 'Enterprise Software',
        description: 'An enterprise software company needed to communicate complex features to non-technical decision-makers. We built a content strategy and campaign that drove qualified leads.',
        results: [
            'Lead generation up 156%',
            'Average deal size increased $50K',
            'Sales cycle reduced by 3 weeks',
            '42% conversion rate from content to demo request'
        ]
    },
    4: {
        title: 'E-commerce Growth',
        client: 'Fashion & Apparel',
        description: 'An online fashion brand wanted to expand beyond their core demographic. We executed a targeted social campaign and email strategy that drove growth without increasing ad spend.',
        results: [
            'Revenue increased 89% year-over-year',
            'New customer acquisition cost down 22%',
            'Email open rates: 31% (industry avg: 18%)',
            'First repeat purchase rate: 43%'
        ]
    },
    5: {
        title: 'Non-profit Awareness',
        client: 'Community Impact',
        description: 'A grassroots non-profit needed amplification for their annual campaign. We created storytelling that moved people to action and helped them exceed their goals by 340%.',
        results: [
            'Campaign reached 2.1M people',
            'Fundraising target exceeded by 340%',
            'New volunteer signups: 340%',
            '8 media mentions in major publications'
        ]
    },
    6: {
        title: 'Tech Conference Marketing',
        client: 'Events & Education',
        description: 'A regional tech conference wanted to attract speakers and attendees. We built a presence across all channels that positioned the event as the place to be for innovators.',
        results: [
            'Attendance up 125% year-over-year',
            '120+ speaker submissions',
            'Sponsor interest doubled',
            '95% attendee satisfaction rating'
        ]
    }
};

portfolioCards.forEach(card => {
    card.addEventListener('click', () => {
        const projectId = card.getAttribute('data-project');
        const data = portfolioData[projectId];

        document.getElementById('modalTitle').textContent = data.title;
        document.getElementById('modalClient').textContent = data.client;
        document.getElementById('modalDescription').textContent = data.description;
        document.getElementById('modalImage').src = card.querySelector('img').src;

        const resultsList = document.getElementById('modalResults');
        resultsList.innerHTML = '';
        data.results.forEach(result => {
            const li = document.createElement('li');
            li.textContent = result;
            resultsList.appendChild(li);
        });

        modal.classList.add('show');
    });
});

modalClose.addEventListener('click', () => {
    modal.classList.remove('show');
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('show');
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        modal.classList.remove('show');
    }
});

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = {
        name: document.getElementById('name').value,
        company: document.getElementById('company').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };

    console.log('Form submitted:', formData);

    const button = contactForm.querySelector('button');
    const originalText = button.textContent;
    button.textContent = 'Message Sent! ✓';
    button.disabled = true;

    setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
        contactForm.reset();
    }, 3000);
});

// ===== STATS COUNTER ANIMATION =====
let statsAnimated = false;

function animateStats() {
    if (statsAnimated) return;
    statsAnimated = true;

    const statNumbers = document.querySelectorAll('.stat-number');

    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        let current = 0;
        const increment = target / 50;
        const duration = 2000;
        const steps = 50;
        const stepDuration = duration / steps;

        let step = 0;
        const counter = setInterval(() => {
            step++;
            current += increment;

            if (step >= steps) {
                stat.textContent = target;
                clearInterval(counter);
            } else {
                stat.textContent = Math.floor(current);
            }
        }, stepDuration);
    });
}

// Use IntersectionObserver to trigger stats animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateStats();
            statsObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.3
});

const statsStrip = document.querySelector('.stats-strip');
if (statsStrip) {
    statsObserver.observe(statsStrip);
}

// ===== PARALLAX SCROLL EFFECT =====
const hero = document.querySelector('.hero');
const heroContent = document.querySelector('.hero-content');
const navbarLogo = document.querySelector('.navbar-logo');

window.addEventListener('scroll', () => {
    const scrollPosition = window.pageYOffset;
    const heroRect = hero ? hero.getBoundingClientRect() : null;

    // Only parallax background while it's in view
    if (hero && heroRect && heroRect.bottom > 0) {
        // Calculate parallax - background moves slower than scroll
        const parallaxOffset = scrollPosition * 0.5;
        hero.style.backgroundPosition = `center ${parallaxOffset}px`;
    }

    // Content parallax
    if (heroContent) {
        heroContent.style.transform = `translateY(${scrollPosition * 0.3}px)`;
    }

    // Logo parallax
    if (navbarLogo) {
        navbarLogo.style.transform = `translateY(${scrollPosition * 0.15}px)`;
    }
}, { passive: true });

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    document.body.style.opacity = '1';
});
