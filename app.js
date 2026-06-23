// new: Core application - orchestrates all rendering and immersive effects
document.addEventListener('DOMContentLoaded', () => {
    initParticleUniverse();
    initCustomCursor();
    initNavScroll();
    initMobileNav();
    initScrollProgressBar();
    loadPortfolioData();
    initHeroTechStack();           // ← Added: Makes tech stack clickable
    // initPageTransition();       // DISABLED (was breaking CV page buttons)
});

// ============================================================
// DATA LOADING
// ============================================================

// new: Fetch JSON data and route to correct page renderer
async function loadPortfolioData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) throw new Error('Failed to load data');
        const data = await response.json();

        const isCV = window.location.pathname.includes('cv.html');

        if (!isCV) {
            await renderHomepage(data);
        } else {
            await renderCVPage(data);
        }

        // new: Hide page loader once all content is rendered
        const loader = document.getElementById('page-loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.style.display = 'none', 500);
        }

        // new: Initialize all immersive effects after DOM is populated
        requestAnimationFrame(() => {
            initScrollReveal();
            initSkillBars();
            initCounters();
            initTiltCards();
            initMagneticButtons();
            initRippleButtons();
        });

    } catch (err) {
        console.error('Data load failed:', err);
        const loader = document.getElementById('page-loader');
        if (loader) loader.style.display = 'none';
    }
}

// ============================================================
// HOMEPAGE RENDERING
// ============================================================

// new: Build entire homepage dynamically from JSON
async function renderHomepage(data) {
    setText('footer-name', data.name);
    setText('hero-location', `📍 ${data.location}`);

    // new: Neon glow pulse applied to hero name span
    setHTML('hero-name', `<span class="gradient-text neon-pulse">${data.name}</span>`);

    const titleEl = document.getElementById('hero-title');
    if (titleEl) {
        titleEl.textContent = '';
        await sleep(400);

        // new: Cycling typewriter loops through multiple role strings
        const roles = [
            data.title,
            'AI-Assisted Developer',
            'Open Source Contributor',
            'CS Student @ Lancaster',
        ];
        initCyclingTypewriter(titleEl, roles);
    }

    // new: Tagline fades in after a short delay
    const taglineEl = document.getElementById('hero-tagline');
    if (taglineEl) {
        taglineEl.textContent = data.tagline;
        await sleep(600);
        taglineEl.style.opacity = '1';
    }

    setText('about-text', data.about);

    // new: Stats bar with animated counters from JSON data
    setHTML('stats-bar', `
        <div class="stat-item">
            <span class="stat-number" data-target="90" data-suffix="%">0</span>
            <span class="stat-label">Assessment A Score</span>
        </div>
        <div class="stat-item">
            <span class="stat-number" data-target="${data.skills.length}" data-suffix="">0</span>
            <span class="stat-label">Skills</span>
        </div>
        <div class="stat-item">
            <span class="stat-number" data-target="${data.projects.length}" data-suffix="">0</span>
            <span class="stat-label">Projects</span>
        </div>
        <div class="stat-item">
            <span class="stat-number" data-target="${data.languages.length}" data-suffix="">0</span>
            <span class="stat-label">Languages</span>
        </div>
    `);

    renderFeaturedProjects(data.projects);
    renderAchievements(data.achievements);
}

// new: Cycling typewriter - types and deletes multiple strings in a loop
function initCyclingTypewriter(element, strings, speed = 70, pause = 1800) {
    let strIndex = 0;
    let charIndex = 0;
    let deleting = false;

    element.style.borderRight = '2px solid var(--accent)';

    function tick() {
        const current = strings[strIndex];

        if (!deleting) {
            element.textContent = current.substring(0, charIndex + 1);
            charIndex++;
            if (charIndex === current.length) {
                setTimeout(() => { deleting = true; tick(); }, pause);
                return;
            }
        } else {
            element.textContent = current.substring(0, charIndex - 1);
            charIndex--;
            if (charIndex === 0) {
                deleting = false;
                strIndex = (strIndex + 1) % strings.length;
            }
        }

        const delay = deleting ? speed / 2 : speed;
        setTimeout(tick, delay);
    }

    tick();
}

// new: Render highlighted projects on the homepage
function renderFeaturedProjects(projects) {
    const container = document.getElementById('featured-projects');
    if (!container || !projects) return;

    const featured = projects.filter(p => p.highlight);
    container.innerHTML = featured.map((proj, i) => `
        <div class="project-card reveal tilt-card" style="--delay: ${i * 0.15}s">
            <div class="project-glow"></div>
            <div class="project-number">0${i + 1}</div>
            <h3>${proj.title}</h3>
            <p>${proj.description}</p>
            <div class="tech-tags">
                ${proj.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
            </div>
            <a href="https://${proj.github}" target="_blank" class="project-link">
                <span>View on GitHub</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
        </div>
    `).join('');
}

// new: Render achievements as animated list items
function renderAchievements(achievements) {
    const container = document.getElementById('achievements-list');
    if (!container || !achievements) return;

    container.innerHTML = achievements.map((item, i) => `
        <li class="achievement-item reveal" style="--delay: ${i * 0.1}s">
            <span class="achievement-icon">◆</span>
            <span>${item}</span>
        </li>
    `).join('');
}

// ============================================================
// CV PAGE RENDERING
// ============================================================

// new: Build full CV page dynamically from JSON data
async function renderCVPage(data) {
    setText('cv-name', data.name);
    setText('cv-title', data.title);
    setText('cv-location', `📍 ${data.location}`);
    setText('footer-name', data.name);

    renderEducation(data.education);
    renderExperience(data.experience);
    renderSkills(data.skills);
    renderAllProjects(data.projects);
    renderLanguages(data.languages);
    renderContact(data);
}

// new: Education cards with module tags
function renderEducation(education) {
    const container = document.getElementById('education-content');
    if (!container || !education) return;

    container.innerHTML = education.map((edu, i) => `
        <div class="cv-card reveal tilt-card" style="--delay: ${i * 0.1}s">
            <div class="cv-card-accent"></div>
            <div class="cv-card-inner">
                <h3>${edu.degree}</h3>
                <p class="cv-meta">
                    <span>${edu.university}</span>
                    <span class="dot">•</span>
                    <span>${edu.year}</span>
                </p>
                ${edu.modules ? `
                    <div class="module-tags">
                        ${edu.modules.map(m => `<span class="module-tag">${m}</span>`).join('')}
                    </div>` : ''}
            </div>
        </div>
    `).join('');
}

// new: Experience as animated vertical timeline
function renderExperience(experience) {
    const container = document.getElementById('experience-content');
    if (!container || !experience) return;

    container.innerHTML = `
        <div class="timeline">
            ${experience.map((exp, i) => `
                <div class="timeline-item reveal" style="--delay: ${i * 0.15}s">
                    <div class="timeline-marker">
                        <div class="timeline-dot"></div>
                        ${i < experience.length - 1 ? '<div class="timeline-line"></div>' : ''}
                    </div>
                    <div class="timeline-content">
                        <span class="timeline-period">${exp.period}</span>
                        <h3>${exp.title}</h3>
                        <p class="timeline-company">${exp.company}</p>
                        <p>${exp.description}</p>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// new: Animated skill bars with percentage labels
function renderSkills(skills) {
    const container = document.getElementById('skills-content');
    if (!container || !skills) return;

    container.innerHTML = skills.map((skill, i) => `
        <div class="skill-item reveal" style="--delay: ${i * 0.08}s">
            <div class="skill-header">
                <span class="skill-name">${skill.name}</span>
                <span class="skill-percent">${skill.level}%</span>
            </div>
            <div class="skill-track">
                <div class="skill-fill" data-level="${skill.level}">
                    <div class="skill-shine"></div>
                </div>
            </div>
        </div>
    `).join('');
}

// new: All projects grid on CV page
function renderAllProjects(projects) {
    const container = document.getElementById('projects-content');
    if (!container || !projects) return;

    container.innerHTML = projects.map((proj, i) => `
        <div class="project-card reveal tilt-card" style="--delay: ${i * 0.15}s">
            <div class="project-glow"></div>
            <div class="project-number">0${i + 1}</div>
            <h3>${proj.title}</h3>
            <p>${proj.description}</p>
            <div class="tech-tags">
                ${proj.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
            </div>
            <a href="https://${proj.github}" target="_blank" class="project-link">
                <span>View on GitHub</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
        </div>
    `).join('');
}

// new: Language cards with proficiency badges
function renderLanguages(languages) {
    const container = document.getElementById('languages-content');
    if (!container || !languages) return;

    container.innerHTML = languages.map((lang, i) => `
        <div class="language-card reveal" style="--delay: ${i * 0.1}s">
            <span class="language-name">${lang.language}</span>
            <span class="language-badge ${lang.level.toLowerCase()}">${lang.level}</span>
        </div>
    `).join('');
}

// new: Contact section built from JSON data fields
function renderContact(data) {
    const container = document.getElementById('contact-content');
    if (!container) return;

    const contacts = [
        { label: 'Email',    value: data.email,    href: `mailto:${data.email}` },
        { label: 'LinkedIn', value: data.linkedin, href: `https://${data.linkedin}` },
        { label: 'GitHub',   value: data.github,   href: `https://${data.github}` },
        { label: 'Location', value: data.location, href: null },
    ];

    container.innerHTML = contacts.map((c, i) => `
        <div class="contact-item reveal" style="--delay: ${i * 0.1}s">
            <span class="contact-label">${c.label}</span>
            ${c.href
                ? `<a href="${c.href}" target="_blank" class="contact-value">${c.value}</a>`
                : `<span class="contact-value">${c.value}</span>`}
        </div>
    `).join('');
}

// ============================================================
// IMMERSIVE EFFECTS
// ============================================================

// new: Scroll progress bar - thin accent line across top showing scroll position
function initScrollProgressBar() {
    const bar = document.createElement('div');
    bar.className = 'scroll-progress-bar';
    document.body.prepend(bar);

    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        bar.style.width = (scrollTop / scrollHeight) * 100 + '%';
    });
}

// new: Particle universe - animated network of floating dots with mouse repulsion
function initParticleUniverse() {
    const canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');
    let mouse = { x: null, y: null };
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    const particles = Array.from({ length: 80 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 2 + 1,
        pulse: Math.random() * Math.PI * 2,
    }));

    document.addEventListener('mousemove', e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    function animate() {
        ctx.clearRect(0, 0, W, H);

        particles.forEach(p => {
            p.pulse += 0.02;
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > W) p.vx *= -1;
            if (p.y < 0 || p.y > H) p.vy *= -1;

            if (mouse.x !== null) {
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 100) {
                    p.x += (dx / dist) * 1.5;
                    p.y += (dy / dist) * 1.5;
                }
            }

            const radius = p.r + Math.sin(p.pulse) * 0.5;
            ctx.beginPath();
            ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0,255,204,0.8)';
            ctx.fill();
        });

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const d = Math.sqrt(dx * dx + dy * dy);
                if (d < 130) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0,255,204,${(1 - d / 130) * 0.35})`;
                    ctx.lineWidth = 0.6;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener('resize', () => {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    });
}

// new: Custom glowing cursor - dot + lagging ring, hidden on touch devices
function initCustomCursor() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const ring = document.createElement('div');
    const dot = document.createElement('div');
    ring.className = 'cursor-ring';
    dot.className = 'cursor-dot';
    document.body.append(ring, dot);

    let cx = 0, cy = 0, tx = 0, ty = 0;

    document.addEventListener('mousemove', e => {
        tx = e.clientX;
        ty = e.clientY;
        dot.style.left = tx + 'px';
        dot.style.top = ty + 'px';
    });

    function animateCursor() {
        cx += (tx - cx) * 0.12;
        cy += (ty - cy) * 0.12;
        ring.style.left = cx + 'px';
        ring.style.top = cy + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    document.addEventListener('mouseover', e => {
        if (e.target.closest('a, button, .project-card, .cv-card, .tilt-card')) {
            ring.classList.add('expanded');
        } else {
            ring.classList.remove('expanded');
        }
    });
}

// new: Magnetic buttons - pulled slightly toward the mouse cursor on hover
function initMagneticButtons() {
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const rect = btn.getBoundingClientRect();
            const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.25;
            const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.25;
            btn.style.transform = `translate(${dx}px, ${dy}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
            btn.style.transform = 'translate(0, 0)';
            setTimeout(() => btn.style.transition = '', 400);
        });

        btn.addEventListener('mouseenter', () => {
            btn.style.transition = 'transform 0.1s ease';
        });
    });
}

// new: Ripple effect - clicking creates expanding circle from the click point
function initRippleButtons() {
    document.querySelectorAll('.btn').forEach(btn => {
        btn.style.overflow = 'hidden';
        btn.style.position = 'relative';

        btn.addEventListener('click', e => {
            const rect = btn.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height) * 2;
            const ripple = document.createElement('span');

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px; height: ${size}px;
                left: ${e.clientX - rect.left - size / 2}px;
                top: ${e.clientY - rect.top - size / 2}px;
                background: rgba(255,255,255,0.25);
                border-radius: 50%;
                transform: scale(0);
                animation: rippleAnim 0.6s ease-out forwards;
                pointer-events: none;
            `;

            btn.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// new: Scroll reveal using Intersection Observer API
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// new: Animate skill bars filling from 0 to target width on scroll into view
function initSkillBars() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fill = entry.target;
                const level = fill.getAttribute('data-level');
                setTimeout(() => { fill.style.width = level + '%'; }, 400);
                observer.unobserve(fill);
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.skill-fill').forEach(el => observer.observe(el));
}

// new: Animated number counters that count up from zero when scrolled into view
function initCounters() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-target'));
                const suffix = el.getAttribute('data-suffix') || '';
                let current = 0;
                const step = Math.ceil(target / 40);

                const counter = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        el.textContent = target + suffix;
                        clearInterval(counter);
                    } else {
                        el.textContent = current + suffix;
                    }
                }, 40);

                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number').forEach(el => observer.observe(el));
}

// new: 3D tilt effect on cards reacting to exact mouse position within the card
function initTiltCards() {
    document.querySelectorAll('.tilt-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width - 0.5) * 18;
            const y = ((e.clientY - rect.top) / rect.height - 0.5) * 18;
            card.style.transform = `perspective(800px) rotateX(${-y}deg) rotateY(${x}deg) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform 0.5s ease';
            card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
        });

        card.addEventListener('mouseenter', () => {
            card.style.transition = 'transform 0.1s ease';
        });
    });
}

// new: Shrink navbar on scroll via .scrolled class on header element
function initNavScroll() {
    const header = document.querySelector('header');
    if (!header) return;
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 60);
    });
}

// new: Mobile hamburger menu toggle - shows/hides nav links on small screens
function initMobileNav() {
    const toggle = document.getElementById('nav-toggle');
    const links = document.querySelector('.nav-links');
    if (!toggle || !links) return;
    toggle.addEventListener('click', () => {
        links.classList.toggle('open');
        toggle.classList.toggle('open');
    });
}

// ============================================================
// NEW: Interactive Hero Tech Stack
// ============================================================

// new: Make hero-side tech items clickable - smooth scroll + highlight
function initHeroTechStack() {
    document.querySelectorAll('.hero-side-item').forEach(item => {
        item.addEventListener('click', () => {
            const target = item.getAttribute('data-target');
            let section = null;

            if (target === 'skills') {
                section = document.querySelector('#about') || document.querySelector('.about-section');
            } else if (target === 'projects') {
                section = document.querySelector('#projects') || document.querySelector('.projects-section');
            }

            if (section) {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });

                // Highlight effect
                section.style.transition = 'box-shadow 0.3s ease';
                section.style.boxShadow = '0 0 0 3px rgba(0, 255, 204, 0.5)';

                setTimeout(() => {
                    section.style.boxShadow = 'none';
                }, 1400);
            }
        });
    });
}

// ============================================================
// UTILITIES
// ============================================================

// new: Promise-based sleep utility for sequencing async animations
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// new: Safely set element text content by ID
function setText(id, text) {
    const el = document.getElementById(id);
    if (el && text !== undefined) el.textContent = text;
}

// new: Safely set element innerHTML by ID
function setHTML(id, html) {
    const el = document.getElementById(id);
    if (el && html !== undefined) el.innerHTML = html;
}