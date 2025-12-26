// Initialize cart from localStorage (if it exists)
let cart = JSON.parse(localStorage.getItem('wakiliCart')) || [];

// --- LANDING PAGE FUNCTIONS ---

// Function to add a new drink card to the store (Admin feature)
function addNewDrink() {
    const nameInput = document.getElementById('newDrinkName');
    const priceInput = document.getElementById('newDrinkPrice');
    const name = nameInput.value.trim();
    const price = priceInput.value.trim();

    if (name === "" || price === "") {
        alert("Please enter both a drink name and its price.");
        return;
    }

    const grid = document.getElementById('mainGrid');
    const uniqueId = `qty-${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;

    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <div class="card-body">
            <button class="delete-btn" onclick="this.closest('.card').remove()">×</button>
            <h3>${name}</h3>
            <p class="price">₦${parseInt(price).toLocaleString()}</p>
            <input type="number" id="${uniqueId}" value="1" min="1">
            <button onclick="addToOrder('${name.replace(/'/g, "\\'")}', ${price}, '${uniqueId}')">
                Add to Order
            </button>
        </div>
    `;
    grid.appendChild(card);
    nameInput.value = "";
    priceInput.value = "";
}

// Function to add items to the list without leaving the page
function addToOrder(name, price, qtyId) {
    const qtyInput = document.getElementById(qtyId);
    const qty = parseInt(qtyInput.value);

    if (qty < 1) return alert("Please enter a valid quantity");

    // Check if drink is already in the cart
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.qty += qty;
    } else {
        cart.push({ name, price, qty });
    }

    // Save the list to browser memory
    localStorage.setItem('wakiliCart', JSON.stringify(cart));
    
    // Update the button text or alert to show it worked
    alert(`${qty} x ${name} added to order!`);
    updateCartCounter();
}

function updateCartCounter() {
    const countSpan = document.getElementById('cart-count');
    if (countSpan) {
        const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
        countSpan.innerText = totalItems;
    }
}

function clearOrder() {
    cart = [];
    localStorage.removeItem('wakiliCart');
    updateCartCounter();
    alert("Order cleared!");
}

function generateFinalReceipt() {
    if (cart.length === 0) {
        alert("Your order is empty!");
        return;
    }
    window.location.href = 'index.html';
}

// --- RECEIPT PAGE FUNCTIONS (Runs on index.html) ---

window.onload = function() {
    updateCartCounter();

    const itemsList = document.getElementById('items-list');
    
    // If we are on the receipt page
    if (itemsList) {
        const savedCart = JSON.parse(localStorage.getItem('wakiliCart'));
        
        if (!savedCart || savedCart.length === 0) {
            itemsList.innerHTML = "<tr><td colspan='4'>No items in order</td></tr>";
            return;
        }

        let grandTotal = 0;
        itemsList.innerHTML = ""; // Clear the table

        savedCart.forEach(item => {
            const total = item.price * item.qty;
            grandTotal += total;

            itemsList.innerHTML += `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.qty}</td>
                    <td>₦${item.price.toLocaleString()}</td>
                    <td>₦${total.toLocaleString()}</td>
                </tr>
            `;
        });

        // Set Date and Receipt Number
        document.getElementById('currentDate').innerText = new Date().toLocaleDateString();
        document.getElementById('receiptNum').innerText = Math.floor(Math.random() * 90000) + 10000;

        // Update Totals
        document.getElementById('subtotal').innerText = '₦' + grandTotal.toLocaleString();
        document.getElementById('grandTotal').innerText = '₦' + grandTotal.toLocaleString();
    }
}