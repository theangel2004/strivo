document.addEventListener('DOMContentLoaded', function() {
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id') || '6'; // Default to product 6 if not specified
    
    // Image gallery functionality
    const mainImage = document.getElementById('main-product-image');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            // Update main image with smooth transition
            mainImage.style.opacity = '0';
            setTimeout(() => {
                mainImage.src = this.getAttribute('data-image');
                mainImage.alt = this.querySelector('img').alt;
                mainImage.style.opacity = '1';
            }, 200);
            
            // Update active state
            thumbnails.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Size selection functionality
    const sizeButtons = document.querySelectorAll('.size-btn');
    let selectedSize = null;
    
    sizeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Toggle selected state with visual feedback
            sizeButtons.forEach(btn => {
                btn.classList.remove('selected');
                btn.style.backgroundColor = '';
                btn.style.color = '';
            });
            this.classList.add('selected');
            this.style.backgroundColor = '#000';
            this.style.color = '#fff';
            selectedSize = this.textContent;
        });
    });
    
    // Add to cart functionality
    const addToCartButton = document.querySelector('.add-to-cart');
    
    addToCartButton.addEventListener('click', function() {
        if (!selectedSize) {
            showToast('Por favor selecciona una talla antes de agregar al carrito', 'error');
            return;
        }
        
        // Get product info
        const productName = document.querySelector('.product-info h1').textContent;
        const productPrice = document.querySelector('.product-price').textContent;
        const productImage = document.getElementById('main-product-image').src;
        const productCategory = document.querySelector('.product-category').textContent;
        
        // Create cart item object
        const cartItem = {
            id: productId,
            name: productName,
            price: productPrice,
            size: selectedSize,
            image: productImage,
            category: productCategory,
            quantity: 1,
            addedAt: new Date().toISOString()
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
        
        // Update cart notification in all pages
        localStorage.setItem('cartUpdated', Date.now());
        
        // Redirect to cart page after short delay
        setTimeout(() => {
            window.location.href = '../cart/carr.html';
        }, 1500);
    });
    
    // Related products functionality
    const relatedCards = document.querySelectorAll('.related-card');
    relatedCards.forEach(card => {
        card.addEventListener('click', function() {
            const relatedProductId = this.getAttribute('data-id');
            window.location.href = `detail.html?id=${relatedProductId}`;
        });
        
        // Add hover effect
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });
    
    // Size guide functionality
    const sizeGuideLink = document.querySelector('.size-guide');
    sizeGuideLink.addEventListener('click', function(e) {
        e.preventDefault();
        showSizeGuideModal();
    });
    
    // Helper function to show size guide modal
    function showSizeGuideModal() {
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
                <p>Para obtener el mejor ajuste, mide tu pie y consulta esta tabla.</p>
                <div class="measure-guide">
                    <h3>Cómo medir tu pie:</h3>
                    <ol>
                        <li>Coloca tu pie sobre una hoja de papel</li>
                        <li>Marca el punto más largo (talón a punta)</li>
                        <li>Mide la distancia en centímetros</li>
                        <li>Compara con nuestra tabla de tallas</li>
                    </ol>
                </div>
            </div>
        `;
        
        // Add modal to body
        document.body.appendChild(modal);
        
        // Close modal when clicking outside or on close button
        modal.addEventListener('click', function(e) {
            if (e.target === modal || e.target.classList.contains('close-modal')) {
                modal.style.opacity = '0';
                setTimeout(() => {
                    document.body.removeChild(modal);
                }, 300);
            }
        });
    }
    
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
        
        // Add to document
        document.body.appendChild(message);
        
        // Remove message after animation
        setTimeout(() => {
            message.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(message);
            }, 300);
        }, 2000);
    }
    
    // Helper function to show toast notification
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        // Add to document
        document.body.appendChild(toast);
        
        // Remove toast after delay
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }
    
    // Listen for cart updates from other tabs
    window.addEventListener('storage', function(e) {
        if (e.key === 'cartUpdated') {
            // Refresh cart notification if needed
        }
    });
    
    // Initialize product details based on ID
    function initProductDetails() {
        // In a real app, you would fetch product details from an API
        // based on the productId and update the page accordingly
        console.log(`Loading details for product ${productId}`);
    }
    
    initProductDetails();
});