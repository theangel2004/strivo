document.addEventListener('DOMContentLoaded', function() {
    // Load cart items from localStorage
    const cartItemsContainer = document.getElementById('cart-items-container');
    const subtotalAmount = document.getElementById('subtotal-amount');
    const shippingAmount = document.getElementById('shipping-amount');
    const totalAmount = document.getElementById('total-amount');
    const checkoutBtn = document.getElementById('checkout-btn');
    const modal = document.getElementById('checkout-modal');
    const closeModal = document.querySelector('.close-modal');
    const checkoutForm = document.getElementById('checkout-form');
    
    // Get cart items from localStorage
    let cartItems = localStorage.getItem('cartItems') ? 
        JSON.parse(localStorage.getItem('cartItems')) : [];
    
    // Display cart items
    function displayCartItems() {
        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 30px 0;">
                        <p>Tu carrito está vacío</p>
                        <a href="../products/index.html" style="display: inline-block; margin-top: 15px; color: #000; text-decoration: underline;">
                            Continuar comprando
                        </a>
                    </td>
                </tr>
            `;
            updateCartSummary();
            return;
        }
        
        let cartHTML = '';
        
        cartItems.forEach((item, index) => {
            const price = parseFloat(item.price.replace(/[^\d]/g, '')) / 100;
            const subtotal = price * item.quantity;
            
            cartHTML += `
                <tr data-index="${index}">
                    <td>
                        <div class="product-info">
                            <div class="product-image">
                                <img src="${item.image}" alt="${item.name}">
                            </div>
                            <div class="product-details">
                                <h3>${item.name}</h3>
                                <p class="size">Talla: ${item.size}</p>
                            </div>
                        </div>
                    </td>
                    <td>$ ${price.toLocaleString()}</td>
                    <td>
                        <div class="quantity-selector">
                            <button class="quantity-btn minus" data-index="${index}">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn plus" data-index="${index}">+</button>
                        </div>
                    </td>
                    <td>$ ${subtotal.toLocaleString()}</td>
                    <td>
                        <button class="remove-item" data-index="${index}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
        
        cartItemsContainer.innerHTML = cartHTML;
        
        // Add event listeners to buttons
        const minusButtons = document.querySelectorAll('.quantity-btn.minus');
        const plusButtons = document.querySelectorAll('.quantity-btn.plus');
        const removeButtons = document.querySelectorAll('.remove-item');
        
        minusButtons.forEach(button => {
            button.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                updateQuantity(index, -1);
            });
        });
        
        plusButtons.forEach(button => {
            button.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                updateQuantity(index, 1);
            });
        });
        
        removeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                removeItem(index);
            });
        });
        
        updateCartSummary();
    }
    
    // Update item quantity
    function updateQuantity(index, change) {
        cartItems[index].quantity += change;
        
        // Make sure quantity doesn't go below 1
        if (cartItems[index].quantity < 1) {
            cartItems[index].quantity = 1;
        }
        
        // Save updated cart
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        
        // Update display
        displayCartItems();
    }
    
    // Remove item from cart
    function removeItem(index) {
        // Animation effect
        const itemRow = document.querySelector(`tr[data-index="${index}"]`);
        itemRow.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        itemRow.style.opacity = '0';
        itemRow.style.transform = 'translateX(20px)';
        
        setTimeout(() => {
            // Remove item from array
            cartItems.splice(index, 1);
            
            // Save updated cart
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            
            // Update display
            displayCartItems();
        }, 300);
    }
    
    // Update cart summary
    function updateCartSummary() {
        let subtotal = 0;
        let shipping = 0;
        
        cartItems.forEach(item => {
            const price = parseFloat(item.price.replace(/[^\d]/g, '')) / 100;
            subtotal += price * item.quantity;
        });
        
        // Free shipping for orders over 100.000
        if (subtotal < 100) {
            shipping = 5;
            document.querySelector('.free-shipping-message').style.display = 'none';
        } else {
            document.querySelector('.free-shipping-message').style.display = 'block';
        }
        
        const total = subtotal + shipping;
        
        subtotalAmount.textContent = `$ ${subtotal.toLocaleString()}`;
        shippingAmount.textContent = shipping > 0 ? `$ ${shipping.toLocaleString()}` : 'GRATIS';
        totalAmount.textContent = `$ ${total.toLocaleString()}`;
        
        // Disable checkout button if cart is empty
        if (cartItems.length === 0) {
            checkoutBtn.disabled = true;
            checkoutBtn.style.opacity = '0.5';
            checkoutBtn.style.cursor = 'not-allowed';
        } else {
            checkoutBtn.disabled = false;
            checkoutBtn.style.opacity = '1';
            checkoutBtn.style.cursor = 'pointer';
        }
    }
    
    // Checkout button event
    checkoutBtn.addEventListener('click', function() {
        if (cartItems.length === 0) return;
        
        // Show checkout modal
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    });
    
    // Close modal
    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Enable scrolling
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Enable scrolling
        }
    });
    
    // Handle checkout form submission
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show loading indicator
        const submitBtn = document.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Procesando...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Clear cart
            localStorage.removeItem('cartItems');
            
            // Show success message
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.innerHTML = `
                <div class="success-content">
                    <i class="fas fa-check-circle"></i>
                    <h2>¡Compra exitosa!</h2>
                    <p>Tu pedido ha sido procesado correctamente.</p>
                    <p>Recibirás un correo con los detalles de tu compra.</p>
                    <button id="continue-shopping">Continuar comprando</button>
                </div>
            `;
            
            // Style the message
            Object.assign(successMessage.style, {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0,0,0,0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: '1000'
            });
            
            Object.assign(successMessage.querySelector('.success-content').style, {
                backgroundColor: '#fff',
                padding: '40px',
                borderRadius: '8px',
                textAlign: 'center',
                maxWidth: '500px'
            });
            
            Object.assign(successMessage.querySelector('i').style, {
                fontSize: '60px',
                color: '#4CAF50',
                marginBottom: '20px'
            });
            
            Object.assign(successMessage.querySelector('h2').style, {
                marginBottom: '15px'
            });
            
            Object.assign(successMessage.querySelector('p').style, {
                marginBottom: '10px',
                color: '#666'
            });
            
            Object.assign(successMessage.querySelector('button').style, {
                marginTop: '20px',
                padding: '12px 25px',
                backgroundColor: '#000',
                color: '#fff',
                border: 'none',
                borderRadius: '30px',
                cursor: 'pointer',
                fontSize: '16px'
            });
            
            // Add to document
            document.body.appendChild(successMessage);
            
            // Continue shopping button
            document.getElementById('continue-shopping').addEventListener('click', function() {
                document.body.removeChild(successMessage);
                window.location.href = '../home/index.html';
            });
            
            // Reset form
            checkoutForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            // Update cart display
            cartItems = [];
            displayCartItems();
        }, 2000);
    });
    
    // Initialize promo code functionality
    const promoButton = document.querySelector('.promo-input button');
    const promoInput = document.querySelector('.promo-input input');
    
    promoButton.addEventListener('click', function() {
        if (!promoInput.value) {
            alert('Por favor ingresa un código promocional');
            return;
        }
        
        if (promoInput.value.toUpperCase() === 'STRIVO10') {
            // Apply 10% discount
            alert('¡Código promocional aplicado! 10% de descuento');
            // In a real app, you would recalculate the total here
            promoInput.value = '';
        } else {
            alert('Código promocional inválido');
        }
    });
    
    // Initialize calculate shipping functionality
    const calculateBtn = document.querySelector('.calculate-btn');
    
    calculateBtn.addEventListener('click', function() {
        // In a real app, this would open a modal to calculate shipping
        alert('Función de cálculo de envío');
    });
    
    // Initialize recommended products
    const recommendedProducts = document.querySelectorAll('.recommended-product');
    recommendedProducts.forEach(product => {
        product.addEventListener('click', function() {
            // In a real app, this would navigate to the product detail page
            window.location.href = '../products/index.html';
        });
    });
    
    // Display cart items on page load
    displayCartItems();
});