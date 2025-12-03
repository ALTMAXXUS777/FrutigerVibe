/* ================================================
   FrutigerVibe Blog - JavaScript
   ================================================ */

document.addEventListener('DOMContentLoaded', function() {
    // Navegación suave para links internos
    initSmoothScrolling();
    
    // Animación de entrada para las cards
    initScrollAnimations();
    
    // Manejo del formulario de newsletter
    initNewsletterForm();
    
    // Efecto parallax suave para burbujas
    initBubbleParallax();
});

/**
 * Navegación suave para enlaces internos
 */
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

/**
 * Animaciones de entrada al hacer scroll
 */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observar elementos que queremos animar
    const animatedElements = document.querySelectorAll('.post-card, .widget');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Agregar clase CSS para la animación
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

/**
 * Manejo del formulario de newsletter
 */
function initNewsletterForm() {
    const form = document.querySelector('.newsletter-form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const input = this.querySelector('.newsletter-input');
            const email = input.value.trim();
            
            if (validateEmail(email)) {
                // Simular envío exitoso
                showNotification('¡Gracias por suscribirte! 🎉', 'success');
                input.value = '';
            } else {
                showNotification('Por favor, ingresa un email válido.', 'error');
            }
        });
    }
}

/**
 * Validar formato de email
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Mostrar notificación temporal
 */
function showNotification(message, type = 'info') {
    // Remover notificación existente si hay
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Estilos de la notificación
    Object.assign(notification.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        padding: '15px 25px',
        borderRadius: '12px',
        color: 'white',
        fontWeight: '600',
        zIndex: '9999',
        transform: 'translateY(100px)',
        opacity: '0',
        transition: 'all 0.4s ease',
        boxShadow: '0 5px 20px rgba(0, 0, 0, 0.2)'
    });
    
    // Color según tipo
    if (type === 'success') {
        notification.style.background = 'linear-gradient(135deg, #56ab2f, #a8e063)';
    } else if (type === 'error') {
        notification.style.background = 'linear-gradient(135deg, #ff416c, #ff4b2b)';
    } else {
        notification.style.background = 'linear-gradient(135deg, #00b4db, #0083b0)';
    }
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateY(0)';
        notification.style.opacity = '1';
    }, 100);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.transform = 'translateY(100px)';
        notification.style.opacity = '0';
        
        setTimeout(() => {
            notification.remove();
        }, 400);
    }, 3000);
}

/**
 * Efecto parallax suave para las burbujas del hero
 */
function initBubbleParallax() {
    const bubbles = document.querySelectorAll('.bubble');
    
    if (bubbles.length === 0) return;
    
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                
                bubbles.forEach((bubble, index) => {
                    const speed = 0.3 + (index * 0.1);
                    const yPos = scrolled * speed;
                    bubble.style.transform = `translateY(${-yPos}px)`;
                });
                
                ticking = false;
            });
            
            ticking = true;
        }
    });
}

/**
 * Función para agregar nuevos posts dinámicamente
 * (Útil para futuras expansiones)
 */
function addPost(title, excerpt, category, date, imageEmoji = '🌟') {
    const postsSection = document.querySelector('.posts-section');
    
    if (!postsSection) return;
    
    const postHTML = `
        <article class="post-card">
            <div class="post-image">
                <div class="post-image-placeholder">${imageEmoji}</div>
            </div>
            <div class="post-content">
                <span class="post-category">${category}</span>
                <h4 class="post-title">${title}</h4>
                <p class="post-excerpt">${excerpt}</p>
                <div class="post-meta">
                    <span class="post-date">📅 ${date}</span>
                    <a href="#" class="read-more">Leer más →</a>
                </div>
            </div>
        </article>
    `;
    
    postsSection.insertAdjacentHTML('beforeend', postHTML);
}

// Exponer función para uso externo
window.FrutigerBlog = {
    addPost,
    showNotification
};
