document.addEventListener('DOMContentLoaded', function() {
    // Hero image animation
    const heroImage = document.querySelector('.hero-content img');
    if (heroImage) {
        setTimeout(() => {
            heroImage.style.transform = 'scale(1.05)';
        }, 300);
    }

    // Add hover effect to product cards
    const productCards = document.querySelectorAll('.category-card');
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.querySelector('img').style.transform = 'scale(1.05)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.querySelector('img').style.transform = 'scale(1)';
        });
    });

    // Handle navigation to product categories
    const categoryLinks = document.querySelectorAll('.category-card, .main-menu a');
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (!this.href.includes('index.html')) return;
            
            // Simulate loading transition
            e.preventDefault();
            document.body.style.opacity = '0.7';
            
            setTimeout(() => {
                window.location.href = this.href;
            }, 300);
        });
    });
    
    // Show notification when hovering cart icon
    const cartIcon = document.querySelector('.fa-shopping-cart');
    if (cartIcon) {
        const cartItems = localStorage.getItem('cartItems') ? 
            JSON.parse(localStorage.getItem('cartItems')).length : 0;
            
        if (cartItems > 0) {
            const notification = document.createElement('span');
            notification.classList.add('cart-notification');
            notification.textContent = cartItems;
            notification.style.position = 'absolute';
            notification.style.top = '-5px';
            notification.style.right = '-5px';
            notification.style.background = '#ff0000';
            notification.style.color = 'white';
            notification.style.borderRadius = '50%';
            notification.style.width = '18px';
            notification.style.height = '18px';
            notification.style.fontSize = '12px';
            notification.style.display = 'flex';
            notification.style.alignItems = 'center';
            notification.style.justifyContent = 'center';
            
            cartIcon.parentElement.style.position = 'relative';
            cartIcon.parentElement.appendChild(notification);
        }
    }
});