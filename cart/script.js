document.addEventListener('DOMContentLoaded', function() {
    const cartItemsContainer = document.getElementById('cart-items-container');
    const subtotalAmount = document.getElementById('subtotal-amount');
    const shippingAmount = document.getElementById('shipping-amount');
    const totalAmount = document.getElementById('total-amount');
    const checkoutBtn = document.getElementById('checkout-btn');
    const modal = document.getElementById('checkout-modal');
    const closeModal = document.querySelector('.close-modal');
    const checkoutForm = document.getElementById('checkout-form');

    let cartItems = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [];

    function displayCartItems() {
        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 30px 0;">
                        <p>Tu carrito está vacío</p>
                        <a href="/product.html" style="display: inline-block; margin-top: 15px; color: #000; text-decoration: underline;">
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

        document.querySelectorAll('.quantity-btn.minus').forEach(button => {
            button.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                updateQuantity(index, -1);
            });
        });

        document.querySelectorAll('.quantity-btn.plus').forEach(button => {
            button.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                updateQuantity(index, 1);
            });
        });

        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                removeItem(index);
            });
        });

        updateCartSummary();
    }

    function updateQuantity(index, change) {
        cartItems[index].quantity += change;
        if (cartItems[index].quantity < 1) cartItems[index].quantity = 1;
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        displayCartItems();
    }

    function removeItem(index) {
        const itemRow = document.querySelector(`tr[data-index="${index}"]`);
        itemRow.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        itemRow.style.opacity = '0';
        itemRow.style.transform = 'translateX(20px)';

        setTimeout(() => {
            cartItems.splice(index, 1);
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            displayCartItems();
        }, 300);
    }

    function updateCartSummary() {
        let subtotal = 0;
        cartItems.forEach(item => {
            const price = parseFloat(item.price.replace(/[^\d]/g, '')) / 100;
            subtotal += price * item.quantity;
        });

        let shipping = subtotal < 100 ? 5 : 0;
        const total = subtotal + shipping;

        subtotalAmount.textContent = `$ ${subtotal.toLocaleString()}`;
        shippingAmount.textContent = shipping ? `$ ${shipping.toLocaleString()}` : 'GRATIS';
        totalAmount.textContent = `$ ${total.toLocaleString()}`;

        const freeShippingMsg = document.querySelector('.free-shipping-message');
        if (freeShippingMsg) {
            freeShippingMsg.style.display = subtotal >= 100 ? 'block' : 'none';
        }

        checkoutBtn.disabled = cartItems.length === 0;
        checkoutBtn.style.opacity = cartItems.length === 0 ? '0.5' : '1';
        checkoutBtn.style.cursor = cartItems.length === 0 ? 'not-allowed' : 'pointer';
    }

    checkoutBtn.addEventListener('click', () => {
        if (cartItems.length > 0) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    });

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const submitBtn = document.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Procesando...';
        submitBtn.disabled = true;

        setTimeout(() => {
            localStorage.removeItem('cartItems');
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';

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

            document.body.appendChild(successMessage);

            document.getElementById('continue-shopping').addEventListener('click', () => {
                document.body.removeChild(successMessage);
                window.location.href = '/index.html';
            });

            checkoutForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            cartItems = [];
            displayCartItems();
        }, 2000);
    });

    const promoButton = document.querySelector('.promo-input button');
    const promoInput = document.querySelector('.promo-input input');

    promoButton.addEventListener('click', () => {
        const code = promoInput.value.trim().toUpperCase();
        if (!code) {
            alert('Por favor ingresa un código promocional');
        } else if (code === 'STRIVO10') {
            alert('¡Código promocional aplicado! 10% de descuento');
            promoInput.value = '';
        } else {
            alert('Código promocional inválido');
        }
    });

    const calculateBtn = document.querySelector('.calculate-btn');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', () => {
            alert('Función de cálculo de envío');
        });
    }

    document.querySelectorAll('.recommended-product').forEach(product => {
        product.addEventListener('click', () => {
            window.location.href = '/product.html';
        });
    });

    displayCartItems();
});
