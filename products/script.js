document.addEventListener('DOMContentLoaded', function() {
    // Get URL parameters to filter products
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    
    // Update breadcrumb based on category
    if (category) {
        updateBreadcrumb(category);
    }
    
    // Handle product card clicks to navigate to product detail
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            
            // Navigate to product detail page with the product ID
            window.location.href = `../product-detail/detail.html?id=${productId}`;
        });
        
        // Add hover animation
        const productImage = this.querySelector('img');
        if (productImage) {
            card.addEventListener('mouseenter', function() {
                productImage.style.transform = 'scale(1.05)';
                productImage.style.transition = 'transform 0.3s ease';
            });
            
            card.addEventListener('mouseleave', function() {
                productImage.style.transform = 'scale(1)';
            });
        }
    });
    
    // Filter functionality
    const filterLinks = document.querySelectorAll('.filter-group ul li a');
    filterLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the filter type and value
            const filterGroup = this.closest('.filter-group');
            const filterType = filterGroup ? filterGroup.querySelector('h3').textContent.toLowerCase() : '';
            const filterValue = this.textContent.toLowerCase();
            
            // Apply visual selected state
            filterLinks.forEach(l => {
                l.style.fontWeight = 'normal';
                l.style.color = '';
            });
            this.style.fontWeight = 'bold';
            this.style.color = '#000';
            
            // In a real app, you would filter products here
            console.log(`Filter applied: ${filterType} - ${filterValue}`);
            
            // Show a toast notification
            showToast(`Filtro aplicado: ${filterValue}`);
        });
    });
    
    // Function to update breadcrumb based on category
    function updateBreadcrumb(category) {
        const breadcrumb = document.querySelector('.breadcrumb');
        if (!breadcrumb) return;
        
        let breadcrumbHTML = '<a href="../index.html">HOME</a> / ';
        
        switch(category) {
            case 'deportes':
                breadcrumbHTML += '<span class="current">DEPORTES</span>';
                break;
            case 'mujer':
                breadcrumbHTML += '<span class="current">MUJER</span>';
                break;
            case 'hombre':
                breadcrumbHTML += '<a href="product.html?category=hombre">HOMBRE</a> / ';
                breadcrumbHTML += '<span class="current">TODOS LOS PRODUCTOS</span>';
                break;
            case 'running':
                breadcrumbHTML += '<a href="product.html?category=hombre">HOMBRE</a> / ';
                breadcrumbHTML += '<span class="current">RUNNING</span>';
                break;
            case 'tenis':
                breadcrumbHTML += '<a href="product.html?category=hombre">HOMBRE</a> / ';
                breadcrumbHTML += '<span class="current">TENIS</span>';
                break;
            case 'futbol':
                breadcrumbHTML += '<a href="product.html?category=hombre">HOMBRE</a> / ';
                breadcrumbHTML += '<a href="product.html?category=tenis">TENIS</a> / ';
                breadcrumbHTML += '<span class="current">FÚTBOL</span>';
                break;
            case 'descuentos':
                breadcrumbHTML += '<span class="current">DESCUENTOS</span>';
                break;
            default:
                breadcrumbHTML += '<span class="current">PRODUCTOS</span>';
        }
        
        breadcrumb.innerHTML = breadcrumbHTML;
    }
    
    // Function to show toast notification
    function showToast(message) {
        // Remove existing toast if any
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }
        
        // Create toast element
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        
        // Style the toast
        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '4px',
            zIndex: '1000',
            opacity: '0',
            transition: 'opacity 0.3s ease, transform 0.3s ease',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            fontSize: '14px'
        });
        
        // Add to document
        document.body.appendChild(toast);
        
        // Show with animation
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(-50%) translateY(-10px)';
        }, 10);
        
        // Hide after 3 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(10px)';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }

    // Initialize cart notification
    updateCartNotification();
    
    // Function to update cart notification
    function updateCartNotification() {
        const cartIcon = document.querySelector('.fa-shopping-cart');
        if (!cartIcon) return;
        
        // Remove existing notification
        const existingNotification = cartIcon.parentElement.querySelector('.cart-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Get cart items count
        const cartItems = localStorage.getItem('cartItems') 
            ? JSON.parse(localStorage.getItem('cartItems')).length 
            : 0;
        
        if (cartItems > 0) {
            const notification = document.createElement('span');
            notification.className = 'cart-notification';
            notification.textContent = cartItems > 9 ? '9+' : cartItems;
            
            // Style the notification
            Object.assign(notification.style, {
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                backgroundColor: '#ff0000',
                color: 'white',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold'
            });
            
            cartIcon.parentElement.style.position = 'relative';
            cartIcon.parentElement.appendChild(notification);
        }
    }
});