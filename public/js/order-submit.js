document.addEventListener("DOMContentLoaded", async () => {
    const orderForm = document.getElementById("orderForm");
    const orderItemsContainer = document.getElementById("orderItems");
    const orderTotalElement = document.getElementById("orderTotal");
    const userTypeElement = document.getElementById("userType");

    // Load order details
    await loadOrderDetails();

    if (orderForm) {
        orderForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            
            const formData = new FormData(orderForm);
            const orderData = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                address: formData.get('address'),
                postalCode: formData.get('postcode'),
                notes: formData.get('notes')
            };

            try {
                const response = await fetch('/api/order', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(orderData)
                });

                const result = await response.json();

                if (result.success) {
                    alert("Order created successfully! Order ID: " + result.orderId);
                    window.location.href = '/';
                } else {
                    alert("Error creating order: " + result.message);
                }
            } catch (error) {
                console.error('Error submitting order:', error);
                alert("Error creating order. Please try again.");
            }
        });
    }

    async function loadOrderDetails() {
        try {
            const response = await fetch('/api/order-details', {
                method: 'GET',
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to load order details');
            }

            const data = await response.json();

            if (data.success) {
                renderOrderItems(data.items);
                updateOrderTotal(data.totalPrice);
                updateUserType(data.isGuest);
            } else {
                orderItemsContainer.innerHTML = '<p>No items in cart</p>';
                orderTotalElement.textContent = '0.00';
            }
        } catch (error) {
            console.error('Error loading order details:', error);
            orderItemsContainer.innerHTML = '<p>Error loading order details</p>';
        }
    }

    function renderOrderItems(items) {
        if (!items || items.length === 0) {
            orderItemsContainer.innerHTML = '<p>No items in cart</p>';
            return;
        }

        orderItemsContainer.innerHTML = '';
        items.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'order-item';
            itemDiv.innerHTML = `
                <div class="item-details">
                    <h4>${item.title}</h4>
                    <p>Price: $${item.price} x ${item.quantity}</p>
                    <p>Subtotal: $${(item.price * item.quantity).toFixed(2)}</p>
                </div>
            `;
            orderItemsContainer.appendChild(itemDiv);
        });
    }

    function updateOrderTotal(total) {
        if (orderTotalElement) {
            orderTotalElement.textContent = total.toFixed(2);
        }
    }

    function updateUserType(isGuest) {
        if (userTypeElement) {
            userTypeElement.textContent = isGuest ? 'Guest Checkout' : 'Logged In User';
        }
    }
});