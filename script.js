// Optional: Add intersection observer for scroll animations later
document.addEventListener('DOMContentLoaded', () => {
    console.log("Portfolio loaded successfully");

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    const skillsAboutContent = document.querySelector('body.skills-page #skills .about-content');
    if (skillsAboutContent) {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                skillsAboutContent.classList.add('skills-panels-visible');
            });
        });
    }

    // Typewriter effect for hero description
    const descriptionElement = document.querySelector('.hero-content .description');
    if (descriptionElement) {
        // Get text and clean up whitespace
        const text = "Building intelligent AI/ML solutions by turning complex data into predictive models, smart automation, and impactful real-world applications.";
        descriptionElement.textContent = ''; // Clear initial text

        // Create a blinking cursor element
        const cursor = document.createElement('span');
        cursor.textContent = '|';
        cursor.style.color = 'var(--accent-color)';
        cursor.style.animation = 'blinkCursor 1s step-end infinite';

        let i = 0;
        function typeWriter() {
            if (i < text.length) {
                descriptionElement.textContent = text.substring(0, i + 1);
                descriptionElement.appendChild(cursor);
                i++;
                // Slight randomization for typing speed to feel more natural
                setTimeout(typeWriter, 30 + Math.random() * 30);
            }
        }

        // Start typing after a short delay
        setTimeout(typeWriter, 800);
    }

    // Typewriter for skills page profile.ts block (syntax-colored segments)
    const profileCodeEl = document.getElementById('profile-code-typewriter');
    if (profileCodeEl) {
        const segments = [
            { cls: 'keyword', text: 'const' },
            { cls: null, text: ' ' },
            { cls: 'variable', text: 'profile' },
            { cls: null, text: ' = {\n  ' },
            { cls: 'property', text: 'name' },
            { cls: null, text: ': ' },
            { cls: 'string', text: "'Rahul'" },
            { cls: null, text: ',\n  ' },
            { cls: 'property', text: 'role' },
            { cls: null, text: ': ' },
            { cls: 'string', text: "'AI/ML Engineer'" },
            { cls: null, text: ',\n  ' },
            { cls: 'property', text: 'focus' },
            { cls: null, text: ': ' },
            { cls: 'string', text: "'Machine Learning'" },
            { cls: null, text: ',\n  ' },
            { cls: 'property', text: 'expertise' },
            { cls: null, text: ': [\n    ' },
            { cls: 'string', text: "'Machine Learning'" },
            { cls: null, text: ', ' },
            { cls: 'string', text: "'NLP'" },
            { cls: null, text: ', ' },
            { cls: 'string', text: "'Deep Learning'" },
            { cls: null, text: ',\n    ' },
            { cls: 'string', text: "'Generative AI'" },
            { cls: null, text: ', ' },
            { cls: 'string', text: "'Data Analytics'" },
            { cls: null, text: ', ' },
            { cls: 'string', text: "'Power Bi'" },
            { cls: null, text: '\n  ],\n\n' },
            { cls: null, text: '};' }
        ];

        const cursor = document.createElement('span');
        cursor.className = 'profile-typewriter-cursor';
        cursor.textContent = '|';
        cursor.setAttribute('aria-hidden', 'true');

        let segIndex = 0;
        let charIndex = 0;
        let currentSpan = null;

        function appendChar(ch) {
            profileCodeEl.removeChild(cursor);
            const target = currentSpan || profileCodeEl;
            target.appendChild(document.createTextNode(ch));
            profileCodeEl.appendChild(cursor);
        }

        function startNextSegment() {
            if (segIndex >= segments.length) {
                profileCodeEl.removeChild(cursor);
                return;
            }
            const seg = segments[segIndex];
            if (charIndex === 0) {
                profileCodeEl.removeChild(cursor);
                if (seg.cls) {
                    currentSpan = document.createElement('span');
                    currentSpan.className = seg.cls;
                    profileCodeEl.appendChild(currentSpan);
                } else {
                    currentSpan = null;
                }
                profileCodeEl.appendChild(cursor);
            }
        }

        function tick() {
            if (segIndex >= segments.length) {
                return;
            }
            const seg = segments[segIndex];
            if (charIndex === 0) {
                startNextSegment();
            }
            const ch = seg.text[charIndex];
            appendChar(ch);
            charIndex++;
            const finishedSegment = charIndex >= seg.text.length;
            if (finishedSegment) {
                segIndex++;
                charIndex = 0;
            }
            if (segIndex < segments.length) {
                const isNewline = ch === '\n';
                const delay = isNewline ? 48 : 16 + Math.random() * 20;
                setTimeout(tick, delay);
            } else {
                profileCodeEl.removeChild(cursor);
            }
        }

        const codeWindow = profileCodeEl.closest('.code-window');
        const runProfileTypewriter = () => {
            profileCodeEl.textContent = '';
            profileCodeEl.appendChild(cursor);
            segIndex = 0;
            charIndex = 0;
            currentSpan = null;
            setTimeout(tick, 400);
        };

        if (document.body.classList.contains('skills-page')) {
            const twDelay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 50 : 1000;
            setTimeout(runProfileTypewriter, twDelay);
        } else if (codeWindow) {
            const codeObserver = new IntersectionObserver(
                (entries, obs) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            runProfileTypewriter();
                            obs.unobserve(entry.target);
                        }
                    });
                },
                { root: null, rootMargin: '0px', threshold: 0.25 }
            );
            codeObserver.observe(codeWindow);
        } else {
            runProfileTypewriter();
        }
    }

    // Advanced Effects for Project Cards
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const projectObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered delay based on index if multiple items appear at once
                setTimeout(() => {
                    entry.target.classList.add('visible');
                    // Add an extra class to trigger internal card animations
                    entry.target.classList.add('animated');
                }, index * 150);
            } else {
                // Remove classes to re-trigger the animation next time it scrolls into view
                entry.target.classList.remove('visible', 'animated');
            }
        });
    }, observerOptions);

    const projectCards = document.querySelectorAll('.project-card, .extracurriculars-container');
    projectCards.forEach(card => {
        projectObserver.observe(card);
        
        // Add mousemove effect for 3D tilt
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculate rotation values (-5 to +5 degrees)
            const rotateY = ((x / rect.width) - 0.5) * 10;
            const rotateX = ((y / rect.height) - 0.5) * -10;
            
            // Apply a subtle glowing highlight based on mouse position
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
            card.style.borderColor = 'rgba(0, 240, 255, 0.6)';
            card.style.boxShadow = `
                ${-rotateY}px ${rotateX}px 30px rgba(0, 0, 0, 0.6),
                0 0 25px rgba(0, 240, 255, 0.2)
            `;
        });
        
        // Reset transform on mouse leave
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
            card.style.borderColor = 'rgba(0, 240, 255, 0.05)';
            card.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.4)';
        });
    });

    // Contact page interactive panel glow
    const contactPanel = document.querySelector('.contact-form-panel');
    if (contactPanel) {
        contactPanel.addEventListener('mousemove', (e) => {
            const rect = contactPanel.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            contactPanel.style.setProperty('--mouse-x', `${x}px`);
            contactPanel.style.setProperty('--mouse-y', `${y}px`);

            const rotateY = ((x / rect.width) - 0.5) * 5.5;
            const rotateX = ((y / rect.height) - 0.5) * -5.5;
            contactPanel.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        contactPanel.addEventListener('mouseleave', () => {
            contactPanel.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    }
});
