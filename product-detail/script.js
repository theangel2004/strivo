document.addEventListener('DOMContentLoaded', function() {
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id') || '6'; // Default to product 6 if not specified
    
    // Image gallery functionality
    const mainImage = document.getElementById('main-product-image');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            // Update main image
            mainImage.src = this.getAttribute('data-image');
            mainImage.alt = this.querySelector('img').alt;
            
            // Update active state
            thumbnails.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Add animation effect
            mainImage.classList.add('zoom-in');
            setTimeout(() => {
                mainImage.classList.remove('zoom-in');
            }, 300);
        });
    });
    
    // Size selection functionality
    const sizeButtons = document.querySelectorAll('.size-btn');
    let selectedSize = null;
    
    sizeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Toggle selected state
            sizeButtons.forEach(btn => btn.classList.remove('selected'));
            this.classList.add('selected');
            selectedSize = this.textContent;
        });
    });
    
    // Add to cart functionality
    const addToCartButton = document.querySelector('.add-to-cart');
    
    addToCartButton.addEventListener('click', function() {
        if (!selectedSize) {
            // Show error message if no size selected
            alert('Por favor selecciona una talla antes de agregar al carrito');
            return;
        }
        
        // Get product info
        const productName = document.querySelector('.product-info h1').textContent;
        const productPrice = document.querySelector('.product-price').textContent;
        const productImage = document.getElementById('main-product-image').src;
        
        // Create cart item object
        const cartItem = {
            id: productId,
            name: productName,
            price: productPrice,
            size: selectedSize,
            image: productImage,
            quantity: 1
        };
        
        // Save to localStorage
        let cartItems = localStorage.getItem('cartItems') ? 
            JSON.parse(localStorage.getItem('cartItems')) : [];
            
        // Check if item already exists in cart
        const existingItemIndex = cartItems.findIndex(item => 
            item.id === cartItem.id && item.size === cartItem.size);
            
        if (existingItemIndex > -1) {
            // Update quantity if item exists
            cartItems[existingItemIndex].quantity += 1;
        } else {
            // Add new item
            cartItems.push(cartItem);
        }
        
        // Save updated cart
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        
        // Show success message
        showAddedToCartMessage();
        
        // Redirect to cart page after short delay
        setTimeout(() => {
            window.location.href = '../cart/carr.html';
        }, 1000);
    });
    
    // Related products functionality
    const relatedCards = document.querySelectorAll('.related-card');
    relatedCards.forEach(card => {
        card.addEventListener('click', function() {
            // In a real app, this would navigate to the product detail page
            // For demo, we'll just show a message
            showToast('Cambiando a producto relacionado...');
            
            // Simulate page transition
            setTimeout(() => {
                // Reload the same page for demo purposes
                window.location.reload();
            }, 1000);
        });
    });
    
    // Size guide functionality
    const sizeGuideLink = document.querySelector('.size-guide');
    sizeGuideLink.addEventListener('click', function(e) {
        e.preventDefault();
        
        // In a real app, this would open a size guide modal
        // For demo, we'll just show a message
        showToast('Guía de tallas abierta');
        
        // Create and show modal
        const modal = document.createElement('div');
        modal.className = 'size-guide-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h2>Guía de Tallas</h2>
                <table>
                    <tr>
                        <th>EU</th>
                        <th>US</th>
                        <th>UK</th>
                        <th>CM</th>
                    </tr>
                    <tr>
                        <td>38</td>
                        <td>6</td>
                        <td>5.5</td>
                        <td>24</td>
                    </tr>
                    <tr>
                        <td>39</td>
                        <td>7</td>
                        <td>6.5</td>
                        <td>24.5</td>
                    </tr>
                    <tr>
                        <td>40</td>
                        <td>8</td>
                        <td>7.5</td>
                        <td>25</td>
                    </tr>
                    <tr>
                        <td>41</td>
                        <td>9</td>
                        <td>8.5</td>
                        <td>26</td>
                    </tr>
                    <tr>
                        <td>42</td>
                        <td>10</td>
                        <td>9.5</td>
                        <td>27</td>
                    </tr>
                </table>
                <p>Para obtener la mejor ajuste, mide tu pie y consulta esta tabla.</p>
            </div>
        `;
        
        // Apply styles to modal
        Object.assign(modal.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: '1000',
            opacity: '0',
            transition: 'opacity 0.3s ease'
        });
        
        // Apply styles to modal content
        const modalContent = modal.querySelector('.modal-content');
        Object.assign(modalContent.style, {
            backgroundColor: '#fff',
            padding: '30px',
            borderRadius: '8px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
        });
        
        // Style the table
        const table = modal.querySelector('table');
        Object.assign(table.style, {
            width: '100%',
            borderCollapse: 'collapse',
            marginBottom: '20px'
        });
        
        // Style table cells
        const cells = modal.querySelectorAll('th, td');
        cells.forEach(cell => {
            Object.assign(cell.style, {
                border: '1px solid #ddd',
                padding: '10px',
                textAlign: 'center'
            });
        });
        
        // Add modal to body
        document.body.appendChild(modal);
        
        // Show modal with animation
        setTimeout(() => {
            modal.style.opacity = '1';
        }, 10);
        
        // Handle close button
        const closeButton = modal.querySelector('.close-modal');
        closeButton.style.cursor = 'pointer';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '10px';
        closeButton.style.right = '15px';
        closeButton.style.fontSize = '24px';
        
        closeButton.addEventListener('click', function() {
            modal.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(modal);
            }, 300);
        });
        
        // Close on outside click
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.opacity = '0';
                setTimeout(() => {
                    document.body.removeChild(modal);
                }, 300);
            }
        });
    });
    
    // Helper function to show added to cart message
    function showAddedToCartMessage() {
        const message = document.createElement('div');
        message.className = 'cart-message';
        message.innerHTML = `
            <div class="cart-message-content">
                <i class="fas fa-check-circle"></i>
                <p>¡Producto agregado al carrito!</p>
                <div class="progress-bar"><div class="progress"></div></div>
            </div>
        `;
        
        // Style the message
        Object.assign(message.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '15px',
            borderRadius: '4px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            zIndex: '1000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });
        
        // Style the message content
        const content = message.querySelector('.cart-message-content');
        Object.assign(content.style, {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        });
        
        // Style the icon
        const icon = message.querySelector('i');
        Object.assign(icon.style, {
            fontSize: '24px',
            marginBottom: '10px'
        });
        
        // Style the progress bar
        const progressBar = message.querySelector('.progress-bar');
        Object.assign(progressBar.style, {
            width: '100%',
            height: '4px',
            backgroundColor: 'rgba(255,255,255,0.3)',
            marginTop: '10px',
            overflow: 'hidden'
        });
        
        const progress = message.querySelector('.progress');
        Object.assign(progress.style, {
            height: '100%',
            width: '100%',
            backgroundColor: 'white',
            animation: 'progress 1s linear'
        });
        
        // Create animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes progress {
                0% { width: 100%; }
                100% { width: 0%; }
            }
        `;
        document.head.appendChild(style);
        
        // Add to document and animate
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.style.transform = 'translateX(0)';
        }, 10);
        
        setTimeout(() => {
            message.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(message);
            }, 300);
        }, 1000);
    }
    
    // Helper function to show toast notification
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