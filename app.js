document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    /* ==========================================================================
       CUSTOM CURSOR
       ========================================================================== */
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');
    
    let mouseX = 0;
    let mouseY = 0;
    let outlineX = 0;
    let outlineY = 0;

    // Track mouse movement
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Show cursor elements once active
        cursorDot.style.opacity = '1';
        cursorOutline.style.opacity = '1';
        
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
    });

    // Smooth cursor outline trailing
    function animateOutline() {
        // Linear interpolation for smooth trail
        const ease = 0.15;
        outlineX += (mouseX - outlineX) * ease;
        outlineY += (mouseY - outlineY) * ease;
        
        cursorOutline.style.left = `${outlineX}px`;
        cursorOutline.style.top = `${outlineY}px`;
        
        requestAnimationFrame(animateOutline);
    }
    animateOutline();

    // Hover state effects
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, .skills-tab-btn, .project-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorOutline.style.borderColor = 'var(--color-accent)';
            cursorDot.style.transform = 'translate(-50%, -50%) scale(0.5)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorOutline.style.borderColor = 'var(--color-secondary)';
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        cursorDot.style.opacity = '0';
        cursorOutline.style.opacity = '0';
    });

    /* ==========================================================================
       NAVBAR SCROLL EFFECT
       ========================================================================== */
    const navbar = document.getElementById('navbar');
    // Extract background color dynamically to set RGB variables for opacity background
    const bgRGB = getComputedStyle(document.body).getPropertyValue('--bg-primary').trim();
    
    // Set custom scroll offset properties
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    /* ==========================================================================
       MOBILE MENU TOGGLE
       ========================================================================== */
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Enforce dark theme by default
    document.body.classList.add('dark-theme');
    document.body.classList.remove('light-theme');

    /* ==========================================================================
       HERO TYPING EFFECT
       ========================================================================== */
    const typingTextElement = document.getElementById('typing-text');
    const words = ["MERN Stack Applications.", "AI & Data Solutions.", "Full-Stack Web Experiences."];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            // Delete character
            typingTextElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            // Write character
            typingTextElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        // Handle transitions
        if (!isDeleting && charIndex === currentWord.length) {
            // Hold full word
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            // Move to next word
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 500;
        }

        setTimeout(type, typingSpeed);
    }

    if (typingTextElement) {
        type();
    }

    /* ==========================================================================
       SCROLL REVEAL OBSERVER
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal-fade');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target); // Trigger only once
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    /* ==========================================================================
       SKILLS PROGRESS BARS ANIMATION
       ========================================================================== */
    const skillCards = document.querySelectorAll('.skill-card');
    
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                skillsObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });

    skillCards.forEach(card => skillsObserver.observe(card));

    /* ==========================================================================
       STATS COUNTER ANIMATION
       ========================================================================== */
    const statNums = document.querySelectorAll('.stat-num');
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const value = parseInt(target.getAttribute('data-val'));
                let current = 0;
                const duration = 1500; // 1.5 seconds
                const increment = value / (duration / 16); // ~60fps
                
                const counter = setInterval(() => {
                    current += increment;
                    if (current >= value) {
                        target.textContent = value;
                        clearInterval(counter);
                    } else {
                        target.textContent = Math.floor(current);
                    }
                }, 16);
                
                statsObserver.unobserve(target);
            }
        });
    }, {
        threshold: 0.5
    });

    statNums.forEach(num => statsObserver.observe(num));

    /* ==========================================================================
       SKILLS CATEGORIES FILTER
       ========================================================================== */
    const skillButtons = document.querySelectorAll('.skills-tab-btn');
    const skills = document.querySelectorAll('.skill-card');

    skillButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Toggle active state
            skillButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.getAttribute('data-category');

            skills.forEach(skill => {
                const skillCat = skill.getAttribute('data-skill-cat');
                if (category === 'all' || skillCat === category) {
                    skill.style.display = 'block';
                    // Retrigger animation
                    setTimeout(() => {
                        skill.style.opacity = '1';
                        skill.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    skill.style.opacity = '0';
                    skill.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        skill.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    /* ==========================================================================
       CONTACT FORM SUBMIT
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Set loading state
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            const originalBtnText = submitBtn.querySelector('.btn-text').textContent;
            submitBtn.querySelector('.btn-text').textContent = 'Sending...';

            // Simulate form submission API delay
            setTimeout(() => {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                submitBtn.querySelector('.btn-text').textContent = originalBtnText;

                // Display status
                formStatus.textContent = 'Message sent successfully! I will get back to you soon.';
                formStatus.className = 'form-status success';
                
                // Clear fields
                contactForm.reset();

                // Hide success message after 5 seconds
                setTimeout(() => {
                    formStatus.style.display = 'none';
                }, 5000);
            }, 1800);
        });
    }

    /* ==========================================================================
       SCROLL INDICATOR (ACTIVE NAV LINK)
       ========================================================================== */
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Highlight when section covers middle of viewport
            if (window.scrollY >= (sectionTop - sectionHeight / 3)) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === currentSection) {
                link.classList.add('active');
            }
        });
    });

    /* ==========================================================================
       3D TILT EFFECT
       ========================================================================== */
    const tiltCards = document.querySelectorAll('.coding-dashboard, .project-card, .stat-card, .skill-card');
    
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate tilt angle (max 15 degrees)
            const angleX = -(y - centerY) / centerY * 15;
            const angleY = (x - centerX) / centerX * 15;
            
            // Apply transform in 3D space with perspective and scaling
            card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            // Smoothly ease back to flat alignment
            card.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
        
        card.addEventListener('mouseenter', () => {
            // Remove transitions for real-time tracking response
            card.style.transition = 'none';
        });
    });
});
