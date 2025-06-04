document.addEventListener('DOMContentLoaded', function() {
    // Hero image animation
    const heroImage = document.querySelector('.hero-content img');
    if (heroImage) {
        setTimeout(() => {
            heroImage.style.transform = 'scale(1.05)';
        }, 300);
    }

    // Add hover effect to product cards
    const productCards = document.querySelectorAll('.category-card, .product-card');
    productCards.forEach(card => {
        const img = card.querySelector('img');
        if (img) {
            card.addEventListener('mouseenter', function() {
                img.style.transform = 'scale(1.05)';
                img.style.transition = 'transform 0.3s ease';
            });
            
            card.addEventListener('mouseleave', function() {
                img.style.transform = 'scale(1)';
            });
        }
    });

    // Handle navigation to product categories
    const categoryLinks = document.querySelectorAll('.category-card, .main-menu a, .btn');
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Solo prevenir comportamiento por defecto para enlaces internos
            if (this.href && this.href.includes(window.location.hostname)) {
                e.preventDefault();
                
                // Simulate loading transition
                document.body.style.opacity = '0.7';
                document.body.style.transition = 'opacity 0.3s ease';
                
                setTimeout(() => {
                    window.location.href = this.href;
                }, 300);
            }
        });
    });
    
    // Cart notification system
    const updateCartNotification = () => {
        const cartIcon = document.querySelector('.fa-shopping-cart');
        if (cartIcon) {
            // Eliminar notificación existente si hay
            const existingNotification = cartIcon.parentElement.querySelector('.cart-notification');
            if (existingNotification) {
                cartIcon.parentElement.removeChild(existingNotification);
            }
            
            // Obtener items del carrito
            const cartItems = localStorage.getItem('cartItems') ? 
                JSON.parse(localStorage.getItem('cartItems')).length : 0;
                
            if (cartItems > 0) {
                const notification = document.createElement('span');
                notification.classList.add('cart-notification');
                notification.textContent = cartItems;
                
                // Estilos para la notificación
                Object.assign(notification.style, {
                    position: 'absolute',
                    top: '-5px',
                    right: '-5px',
                    background: '#ff0000',
                    color: 'white',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'none'
                });
                
                cartIcon.parentElement.style.position = 'relative';
                cartIcon.parentElement.appendChild(notification);
            }
        }
    };

    // Actualizar notificación al cargar
    updateCartNotification();
    
    // Escuchar cambios en el carrito (útil si hay múltiples pestañas)
    window.addEventListener('storage', function(e) {
        if (e.key === 'cartItems') {
            updateCartNotification();
        }
    });

    // Efecto hover para botones de categorías
    const categoryButtons = document.querySelectorAll('.main-menu > li > a');
    categoryButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.color = '#000';
        });
        
        button.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.color = '';
            }
        });
    });
});