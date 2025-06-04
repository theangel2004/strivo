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
            // Special handling for product ID 6 to match the example screenshot
            if (productId === '6') {
                window.location.href = '../product-detail/detail.html?id=6';
            } else {
                window.location.href = '../product-detail/detail.html?id=' + productId;
            }
        });
        
        // Add hover animation
        card.addEventListener('mouseenter', function() {
            this.querySelector('img').style.transform = 'scale(1.05)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.querySelector('img').style.transform = 'scale(1)';
        });
    });
    
    // Filter functionality
    const filterLinks = document.querySelectorAll('.filter-group ul li a');
    filterLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the filter type and value
            const filterType = this.closest('.filter-group').querySelector('h3').textContent.toLowerCase();
            const filterValue = this.textContent.toLowerCase();
            
            // Apply visual selected state
            filterLinks.forEach(l => l.style.fontWeight = 'normal');
            this.style.fontWeight = 'bold';
            
            // Apply filter to products (in a real app, this would filter the products)
            // For demo purposes, we'll just log the filter
            console.log(`Filter applied: ${filterType} - ${filterValue}`);
            
            // Show a toast notification
            showToast(`Filtro aplicado: ${filterValue}`);
        });
    });
    
    // Function to update breadcrumb based on category
    function updateBreadcrumb(category) {
        const breadcrumb = document.querySelector('.breadcrumb');
        if (!breadcrumb) return;
        
        let breadcrumbHTML = '<a href="/index.html">HOME</a> / ';
        
        switch(category) {
            case 'deportes':
                breadcrumbHTML += '<span class="current">DEPORTES</span>';
                break;
            case 'mujer':
                breadcrumbHTML += '<span class="current">MUJER</span>';
                break;
            case 'hombre':
                breadcrumbHTML += '<a href="/product.html?category=hombre">HOMBRE</a> / ';
                breadcrumbHTML += '<span class="current">TODOS LOS PRODUCTOS</span>';
                break;
            case 'running':
                breadcrumbHTML += '<a href="/product.html?category=hombre">HOMBRE</a> / ';
                breadcrumbHTML += '<span class="current">RUNNING</span>';
                break;
            case 'tenis':
                breadcrumbHTML += '<a href="/product.html?category=hombre">HOMBRE</a> / ';
                breadcrumbHTML += '<span class="current">TENIS</span>';
                break;
            case 'futbol':
                breadcrumbHTML += '<a href="/product.html?category=hombre">HOMBRE</a> / ';
                breadcrumbHTML += '<a href="/product.html?category=tenis">TENIS</a> / ';
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
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '4px',
            zIndex: '1000',
            opacity: '0',
            transition: 'opacity 0.3s ease'
        });
        
        // Add to document
        document.body.appendChild(toast);
        
        // Show and hide with animation
        setTimeout(() => {
            toast.style.opacity = '1';
        }, 10);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }
});