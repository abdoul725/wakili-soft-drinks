// --- LANDING PAGE FUNCTIONS ---

/**
 * Adds a new drink card to the store grid dynamically.
 */
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
    
    // Create a unique ID based on the name to avoid conflicts
    const uniqueId = `qty-${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;

    // Create the card element
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <div class="card-body">
            <button class="delete-btn" onclick="this.closest('.card').remove()">×</button>
            <h3>${name}</h3>
            <p class="price">₦${parseInt(price).toLocaleString()}</p>
            <input type="number" id="${uniqueId}" value="1" min="1">
            <button onclick="generateReceipt('${name.replace(/'/g, "\\'")}', ${price}, '${uniqueId}')">
                Select & Get Receipt
            </button>
        </div>
    `;

    grid.appendChild(card);

    // Clear inputs after adding
    nameInput.value = "";
    priceInput.value = "";
}

/**
 * Redirects to the receipt page (index.html) with data in the URL.
 */
function generateReceipt(name, price, qtyId) {
    const qtyInput = document.getElementById(qtyId);
    if (!qtyInput) return;
    
    const qty = qtyInput.value;
    
    // encodeURIComponent handles spaces and special characters safely in the URL
    window.location.href = `index.html?item=${encodeURIComponent(name)}&price=${price}&qty=${qty}`;
}


// --- RECEIPT PAGE FUNCTIONS ---

window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Check if we are on the receipt page by looking for the 'item' parameter
    if (urlParams.has('item')) {
        const item = decodeURIComponent(urlParams.get('item'));
        const price = parseFloat(urlParams.get('price'));
        const qty = parseInt(urlParams.get('qty'));
        const total = price * qty;

        // Set Date and Random Receipt Number
        const dateEl = document.getElementById('currentDate');
        const numEl = document.getElementById('receiptNum');
        
        if (dateEl) dateEl.innerText = new Date().toLocaleDateString();
        if (numEl) numEl.innerText = Math.floor(Math.random() * 90000) + 10000;

        // Update Table Body
        const itemsList = document.getElementById('items-list');
        if (itemsList) {
            itemsList.innerHTML = `
                <tr>
                    <td>${item}</td>
                    <td>${qty}</td>
                    <td>₦${price.toLocaleString()}</td>
                    <td>₦${total.toLocaleString()}</td>
                </tr>
            `;
        }

        // Update Total Displays
        const subtotalEl = document.getElementById('subtotal');
        const grandTotalEl = document.getElementById('grandTotal');
        
        if (subtotalEl) subtotalEl.innerText = '₦' + total.toLocaleString();
        if (grandTotalEl) grandTotalEl.innerText = '₦' + total.toLocaleString();
    }
}