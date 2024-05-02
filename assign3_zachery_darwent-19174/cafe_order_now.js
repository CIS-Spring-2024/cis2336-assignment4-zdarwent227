function toggleMenu(menuId) {
    var menu = document.getElementById(menuId);
    if (menu.style.display === "none" || menu.style.display === "") {
        menu.style.display = "block";
    } else {
        menu.style.display = "none";
    }
}

const menuData = {
    entrees: [
        { name: "Chicken Fettuccine Alfredo", image: "entree_page_pasta.jpeg", price: 10, quantity: 10 },
        { name: "Salmon with Asparagus", image: "menu_salmon.jpeg", price: 15, quantity: 8 },
        { name: "Beer Cheese Soup", image: "entree_page_soup.jpeg", price: 8, quantity: 4 },
    ],
    desserts: [
        { name: "French Toast", image: "entree_page_frenchtoast.jpg", price: 5, quantity: 5 },
        { name: "Apple Cobbler", image: "dessert_page_pie.jpeg", price: 7, quantity: 7 },
        { name: "Vanilla Ice Cream", image: "menu_Desert.jpeg", price: 4, quantity: 9 }
    ],
    snacks: [
        { name: "Chocolate Chip Cookie", image: "dessert_page_cookies.jpeg", price: 2, quantity: 15 },
        { name: "Protein Bar", image: "drink_page_proteinbar.jpeg", price: 3, quantity: 13 }
    ]
};

const cart = []; // Initialize an empty cart

// Function to generate the list of meals
function generateMenu(category) {
    const menuContainer = document.getElementById('menu-container');
    menuContainer.innerHTML = ''; 

    const meals = menuData[category];
    if (meals) {
        meals.forEach(meal => {
            const mealElement = document.createElement('div');
            mealElement.classList.add('meal');
            mealElement.dataset.name = meal.name; 
            mealElement.innerHTML = `
                <img src="${meal.image}" alt="${meal.name}" class="menu-image">
                <p>${meal.name}</p>
                <p>Price: $${meal.price}</p>
                <div class="quantity-controls">
                    <button class="minus-btn" onclick="decrementQuantity('${meal.name}')">-</button>
                    <input type="number" class="quantity-input" id="quantity-${meal.name}" value="1" min="1" max="${meal.quantity}">
                    <button class="plus-btn" onclick="incrementQuantity('${meal.name}')">+</button>
                </div>
                <button class="add-to-cart-btn" onclick="addToCart('${meal.name}', ${meal.price})">Add to Cart</button>
                <p class="quantity">Quantity Left: ${meal.quantity}</p>
            `;
            menuContainer.appendChild(mealElement);
        });
    }
}

// Function to add item to cart
function addToCart(name, price) {
    const input = document.getElementById(`quantity-${name}`);
    const quantity = parseInt(input.value);

    if (quantity > 0) {
        const menuItem = menuData.entrees.find(item => item.name === name) || 
                         menuData.desserts.find(item => item.name === name) || 
                         menuData.snacks.find(item => item.name === name);
                     
        if (menuItem && menuItem.quantity >= quantity) {
            const existingItemIndex = cart.findIndex(item => item.name === name);
            if (existingItemIndex !== -1) {
                cart[existingItemIndex].quantity += quantity;
            } else {
                cart.push({ name, price, quantity });
            }
            menuItem.quantity -= quantity; 
            updateCart();
            updateQuantityDisplay(name, menuItem.quantity); 
        } else {
            alert("Sorry, this item is out of stock or you've exceeded the available quantity.");
        }
    } else {
        alert("Please enter a valid quantity.");
    }
}

// Function to toggle cart visibility
function toggleCart() {
    const cartElement = document.getElementById('cart');
    cartElement.style.display = cartElement.style.display === 'none' ? 'block' : 'none';
}

// Event listeners for menu category clicks
document.getElementById('entreesBtn').addEventListener('click', () => {
    generateMenu('entrees');
});

document.getElementById('dessertsBtn').addEventListener('click', () => {
    generateMenu('desserts');
});

document.getElementById('snacksBtn').addEventListener('click', () => {
    generateMenu('snacks');
});

function updateQuantityDisplay(name, quantity) {
    const quantityElement = document.querySelector(`.meal[data-name="${name}"] .quantity`);
    if (quantityElement) {
        quantityElement.textContent = `Quantity Left: ${quantity}`;
    }
}

// Function to clear cart
function clearCart() {
    cart.forEach(item => {
        const menuItem = menuData.entrees.find(menuItem => menuItem.name === item.name) || 
                         menuData.desserts.find(menuItem => menuItem.name === item.name) || 
                         menuData.snacks.find(menuItem => menuItem.name === item.name);
        if (menuItem) {
            menuItem.quantity += item.quantity; 
            updateQuantityDisplay(item.name, menuItem.quantity); 
        }
    });
    
    cart.length = 0; 
    updateCart(); 
}

function updateCart() {
    const cartItemsElement = document.getElementById('cart-items');
    cartItemsElement.innerHTML = '';

    if (cart.length === 0) {
        cartItemsElement.innerHTML = '<p>Your cart is empty</p>';
    } else {
        const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        cart.forEach(item => {
            cartItemsElement.innerHTML += `
                <p>${item.name} - $${item.price} - Quantity: ${item.quantity}</p>
            `;
        });
        cartItemsElement.innerHTML += `<p>Total: $${total}</p>`;
    }
}

function incrementQuantity(mealName) {
    const input = document.getElementById(`quantity-${mealName}`);
    const maxQuantity = parseInt(input.getAttribute('max'));
    let newValue = parseInt(input.value) + 1;
    if (newValue > maxQuantity) {
        newValue = maxQuantity;
    }
    input.value = newValue;
}

// Function to decrement quantity
function decrementQuantity(mealName) {
    const input = document.getElementById(`quantity-${mealName}`);
    let newValue = parseInt(input.value) - 1;
    if (newValue < 1) {
        newValue = 1;
    }
    input.value = newValue;
}

// Function to submit the order
document.getElementById('submit-order-form').addEventListener('submit', function(event) {
    event.preventDefault(); 
    
    // Serialize form data
    const formData = new FormData(this);
    const formDataObject = {};
    formData.forEach(function(value, key) {
        formDataObject[key] = value;
    });
    
    // Add cart items to form data
    formDataObject.cart = cart;
    
    // Send a POST request to the backend
    fetch('/order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataObject),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data); // Log the response from the server
        
        // Clear the cart and reset the form after submitting the order
        clearCart();
        this.reset();
        
        // Show an alert to inform the user that the order is being processed
        alert("Your order is being processed! Expect an email soon to enter payment information! Go Cougs!");
    })
    .catch(error => {
        console.error('Error:', error);
        // Handle errors if any
    });
});
