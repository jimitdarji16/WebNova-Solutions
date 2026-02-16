// ========================================
// WebNova Solutions - JavaScript
// ========================================

// Initialize Three.js Background Animation
function initThreeJS() {
    const canvas = document.getElementById('bg-canvas');
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    
    const posArray = new Float32Array(particlesCount * 3);
    const colorsArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 15;
    }
    
    // Colors - purple, pink, cyan gradient
    for (let i = 0; i < particlesCount; i++) {
        const colorChoice = Math.random();
        if (colorChoice < 0.33) {
            // Purple
            colorsArray[i * 3] = 0.39;
            colorsArray[i * 3 + 1] = 0.4;
            colorsArray[i * 3 + 2] = 0.95;
        } else if (colorChoice < 0.66) {
            // Pink
            colorsArray[i * 3] = 0.96;
            colorsArray[i * 3 + 1] = 0.25;
            colorsArray[i * 3 + 2] = 0.37;
        } else {
            // Cyan
            colorsArray[i * 3] = 0.02;
            colorsArray[i * 3 + 1] = 0.71;
            colorsArray[i * 3 + 2] = 0.83;
        }
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));
    
    // Particle material
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.02,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    // Create floating geometric shapes
    const shapes = [];
    
    // Torus
    const torusGeometry = new THREE.TorusGeometry(0.8, 0.2, 16, 100);
    const torusMaterial = new THREE.MeshBasicMaterial({
        color: 0x6366f1,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    torus.position.set(3, 1, -2);
    scene.add(torus);
    shapes.push({ mesh: torus, rotationSpeed: { x: 0.01, y: 0.005, z: 0 } });
    
    // Icosahedron
    const icosaGeometry = new THREE.IcosahedronGeometry(0.6, 0);
    const icosaMaterial = new THREE.MeshBasicMaterial({
        color: 0xf43f5e,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    const icosahedron = new THREE.Mesh(icosaGeometry, icosaMaterial);
    icosahedron.position.set(-3, -1, -3);
    scene.add(icosahedron);
    shapes.push({ mesh: icosahedron, rotationSpeed: { x: 0.008, y: 0.01, z: 0.005 } });
    
    // Octahedron
    const octaGeometry = new THREE.OctahedronGeometry(0.5, 0);
    const octaMaterial = new THREE.MeshBasicMaterial({
        color: 0x06b6d4,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    const octahedron = new THREE.Mesh(octaGeometry, octaMaterial);
    octahedron.position.set(2, -2, -2);
    scene.add(octahedron);
    shapes.push({ mesh: octahedron, rotationSpeed: { x: 0.005, y: 0.008, z: 0.01 } });
    
    // Dodecahedron
    const dodecaGeometry = new THREE.DodecahedronGeometry(0.4, 0);
    const dodecaMaterial = new THREE.MeshBasicMaterial({
        color: 0x818cf8,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    const dodecahedron = new THREE.Mesh(dodecaGeometry, dodecaMaterial);
    dodecahedron.position.set(-2, 2, -4);
    scene.add(dodecahedron);
    shapes.push({ mesh: dodecahedron, rotationSpeed: { x: 0.007, y: 0.006, z: 0.008 } });
    
    // Torus Knot
    const knotGeometry = new THREE.TorusKnotGeometry(0.5, 0.15, 100, 16);
    const knotMaterial = new THREE.MeshBasicMaterial({
        color: 0x6366f1,
        wireframe: true,
        transparent: true,
        opacity: 0.2
    });
    const torusKnot = new THREE.Mesh(knotGeometry, knotMaterial);
    torusKnot.position.set(0, 0, -5);
    scene.add(torusKnot);
    shapes.push({ mesh: torusKnot, rotationSpeed: { x: 0.003, y: 0.004, z: 0.002 } });
    
    camera.position.z = 5;
    
    // Mouse movement effect
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Smooth mouse following
        targetX += (mouseX - targetX) * 0.02;
        targetY += (mouseY - targetY) * 0.02;
        
        // Rotate particles
        particlesMesh.rotation.y += 0.001;
        particlesMesh.rotation.x = targetY * 0.3;
        particlesMesh.position.x = targetX * 0.5;
        
        // Rotate shapes
        shapes.forEach(shape => {
            shape.mesh.rotation.x += shape.rotationSpeed.x;
            shape.mesh.rotation.y += shape.rotationSpeed.y;
            shape.mesh.rotation.z += shape.rotationSpeed.z;
            
            // Floating animation
            shape.mesh.position.y += Math.sin(Date.now() * 0.001 + shapes.indexOf(shape)) * 0.002;
        });
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Handle resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Mobile Navigation Toggle
function initMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
    
    // Close menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

// Smooth Scroll
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Navbar scroll effect
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.style.padding = '15px 0';
            navbar.style.background = 'rgba(15, 23, 42, 0.95)';
        } else {
            navbar.style.padding = '20px 0';
            navbar.style.background = 'rgba(15, 23, 42, 0.8)';
        }
    });
}

// Scroll Reveal Animation
function initScrollReveal() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Add reveal animation to elements
    const revealElements = document.querySelectorAll('.service-card, .feature-item, .portfolio-item, .contact-item');
    revealElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
    
    // Add CSS for revealed state
    const style = document.createElement('style');
    style.textContent = `
        .revealed {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

// Counter Animation
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        root: null,
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const targetText = counter.textContent;
                const targetNumber = parseInt(targetText.replace(/\D/g, ''));
                const suffix = targetText.replace(/[0-9]/g, '');
                
                if (!isNaN(targetNumber)) {
                    animateCounter(counter, targetNumber, suffix);
                }
                
                observer.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target, suffix) {
    let current = 0;
    const increment = target / 50;
    const duration = 1500;
    const stepTime = duration / 50;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + suffix;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + suffix;
        }
    }, stepTime);
}

// Backend API URL
const API_URL = 'http://localhost:3000/api';

// Form Handling
function initFormHandling() {
    const form = document.getElementById('contactForm');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        try {
            // Send data to backend
            const response = await fetch(`${API_URL}/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Show success message
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                
                // Reset form
                form.reset();
                
                // Show success notification
                showNotification(result.message, 'success');
            } else {
                // Show error message
                submitBtn.innerHTML = '<i class="fas fa-times"></i> Error!';
                submitBtn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
                showNotification(result.message, 'error');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            submitBtn.innerHTML = '<i class="fas fa-times"></i> Error!';
            submitBtn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
            showNotification('Connection error. Please make sure the server is running.', 'error');
        }
        
        // Reset button after 3 seconds
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
        }, 3000);
    });
}

// Notification System
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    document.body.appendChild(notification);
    
    // Add notification styles if not already added
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 12px;
                display: flex;
                align-items: center;
                gap: 12px;
                z-index: 10000;
                animation: slideIn 0.3s ease;
                max-width: 400px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
            }
            .notification-success {
                background: linear-gradient(135deg, #10b981, #059669);
                color: white;
            }
            .notification-error {
                background: linear-gradient(135deg, #ef4444, #dc2626);
                color: white;
            }
            .notification i {
                font-size: 1.2rem;
            }
            .notification-close {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                padding: 5px;
                margin-left: auto;
                opacity: 0.8;
                transition: opacity 0.3s;
            }
            .notification-close:hover {
                opacity: 1;
            }
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Close button handler
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Parallax Effect on Mouse Move
function initParallax() {
    const hero = document.querySelector('.hero');
    const floatingCards = document.querySelectorAll('.floating-card');
    
    hero.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        
        const xPos = (clientX / innerWidth - 0.5) * 2;
        const yPos = (clientY / innerHeight - 0.5) * 2;
        
        floatingCards.forEach((card, index) => {
            const speed = (index + 1) * 10;
            card.style.transform = `translate(${xPos * speed}px, ${yPos * speed}px)`;
        });
    });
}

// Typing Effect for Hero Title (Optional Enhancement)
function initTypingEffect() {
    const text = "24 Hours";
    const element = document.querySelector('.gradient-text');
    
    if (element && element.textContent.includes('24 Hours')) {
        element.style.borderRight = '3px solid var(--primary)';
        element.style.animation = 'blink 0.7s infinite';
        
        // Add blink animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes blink {
                0%, 100% { border-color: transparent; }
                50% { border-color: var(--primary); }
            }
        `;
        document.head.appendChild(style);
    }
}

// Service Cards 3D Tilt Effect
function initTiltEffect() {
    const cards = document.querySelectorAll('.service-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

// Magnetic Button Effect
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn-primary');
    
    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });
}

// Cursor Glow Effect
function initCursorGlow() {
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);
    
    const style = document.createElement('style');
    style.textContent = `
        .cursor-glow {
            position: fixed;
            width: 300px;
            height: 300px;
            background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transform: translate(-50%, -50%);
            transition: transform 0.1s ease;
        }
    `;
    document.head.appendChild(style);
    
    document.addEventListener('mousemove', (e) => {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
    });
}

// Initialize Everything
document.addEventListener('DOMContentLoaded', () => {
    initThreeJS();
    initMobileNav();
    initSmoothScroll();
    initNavbarScroll();
    initScrollReveal();
    initCounterAnimation();
    initFormHandling();
    initParallax();
    initTiltEffect();
    initMagneticButtons();
    initCursorGlow();
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});
