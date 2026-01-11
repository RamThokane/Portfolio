// Theme Toggle Functionality
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Check for saved theme preference or default to dark
const savedTheme = localStorage.getItem('theme') || 'dark';
if (savedTheme === 'light') {
    body.setAttribute('data-theme', 'light');
}

themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    
    if (currentTheme === 'light') {
        body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'dark');
    } else {
        body.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }
});

// Navigation Active State
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-links a');
const navbar = document.querySelector('.navbar');

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

const observerOptions = {
    root: null,
    rootMargin: '-50% 0px -50% 0px',
    threshold: 0
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}, observerOptions);

sections.forEach(section => {
    observer.observe(section);
});

// Smooth scroll for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Scroll Animation Observer
const scrollAnimationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            
            // Add special class for main title animation
            if (entry.target.classList.contains('main-title')) {
                entry.target.classList.add('animated');
            }
        }
    });
}, {
    root: null,
    rootMargin: '0px 0px -100px 0px',
    threshold: 0.1
});

// Observe all elements with animation classes
const animatedElements = document.querySelectorAll('.animate-on-scroll, .animate-fade-left, .animate-scale');
animatedElements.forEach(el => {
    scrollAnimationObserver.observe(el);
});

// Cursor glow effect (desktop only)
const cursorGlow = document.getElementById('cursorGlow');
if (cursorGlow && window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
    });
    
    document.addEventListener('mouseenter', () => {
        cursorGlow.style.opacity = '1';
    });
    
    document.addEventListener('mouseleave', () => {
        cursorGlow.style.opacity = '0';
    });
}

// Add hover effect to project cards with tilt
const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        if (window.innerWidth > 768) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        }
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// Add hover effect to skill tags with random rotation
const skillTags = document.querySelectorAll('.skill-tag');

skillTags.forEach(tag => {
    tag.addEventListener('mouseenter', () => {
        const rotation = (Math.random() - 0.5) * 6;
        tag.style.transform = `translateY(-4px) scale(1.02) rotate(${rotation}deg)`;
    });
    
    tag.addEventListener('mouseleave', () => {
        tag.style.transform = 'translateY(0) scale(1) rotate(0deg)';
    });
});

// Parallax effect for avatar (subtle)
const avatar = document.querySelector('.avatar');

if (window.innerWidth > 768) {
    window.addEventListener('mousemove', (e) => {
        const x = (window.innerWidth / 2 - e.pageX) / 50;
        const y = (window.innerHeight / 2 - e.pageY) / 50;
        
        if (avatar) {
            avatar.style.transform = `translate(${x}px, ${y}px)`;
        }
    });
}

// Typing effect for subtitle (optional)
const typeWriter = (element, text, speed = 50) => {
    let i = 0;
    element.innerHTML = '';
    
    const type = () => {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    };
    
    type();
};

// Console Easter Egg
console.log(`
%c Ram Thokane's Portfolio 
%c━━━━━━━━━━━━━━━━━━━━━━━━━━
%c Hey there, fellow developer! 👋
%c Thanks for checking out my code.
%c Let's build something cool together!
%c ━━━━━━━━━━━━━━━━━━━━━━━━━━
`, 
'color: #fff; font-size: 16px; font-weight: bold;',
'color: #666;',
'color: #888; font-size: 12px;',
'color: #888; font-size: 12px;',
'color: #888; font-size: 12px;',
'color: #666;'
);

// Add loading animation
document.addEventListener('DOMContentLoaded', () => {
    document.body.style.opacity = '0';
    
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
        
        // Trigger initial animations for visible elements
        setTimeout(() => {
            const visibleElements = document.querySelectorAll('.about-section .animate-on-scroll');
            visibleElements.forEach((el, index) => {
                setTimeout(() => {
                    el.classList.add('animated');
                }, index * 150);
            });
        }, 300);
    }, 100);
});

// Smooth scroll progress indicator (optional enhancement)
const updateScrollProgress = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    document.documentElement.style.setProperty('--scroll-progress', scrollPercent + '%');
};

window.addEventListener('scroll', updateScrollProgress);

// Add magnetic effect to buttons
const buttons = document.querySelectorAll('.btn');

buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        if (window.innerWidth > 768) {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px) translateY(-3px)`;
        }
    });
    
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
    });
});

// Social links hover animation
const socialLinks = document.querySelectorAll('.social-links a');

socialLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
        link.style.transform = 'translateY(-4px) scale(1.1)';
    });
    
    link.addEventListener('mouseleave', () => {
        link.style.transform = 'translateY(0) scale(1)';
    });
});
