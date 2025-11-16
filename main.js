document.addEventListener("DOMContentLoaded", function() {

  const menu = {
    starters: [
      { name: "French Fries", price: 7, image: "fries no logo.png"},
      { name: "Curly Fries", price: 10, image: "curly fries no logo.png"},
      { name: "N's Fries", price: 20, image: "N fries.png"},
      { name: "Mozzarella Sticks", price: 15, image: "mozzarella s.png"},
    ],
    burgersb: [
      { name: "N's Burger", price: 25, image: "N burger.png" },
      { name: "Single Cheeseburger", price: 24, image: "cheeseburger.png" },
      { name: "Double N's Burger", price: 30, image: "NB d.png" },
      { name: "Double Cheeseburger", price: 29, image: "CH d.png"},
    ],
    sauces: [
      { name: "N's Sauce", price: 2, image: "N s.png"},
      { name: "Ketchup", price: 2, image: "ket S.png"},
      { name: "Mustard", price: 2, image: "must S.png"},
      { name: "Honey Mustard", price: 2, image: "hm S.png"},
    ],
    drinks: [
      { name: "Water", price: 5, image: "water.png" },
      { name: "Vanilla Milkshake", price: 10, image: "MS v.png"},
      { name: "Diet Coke", price: 7, image: "DIET c.png"},
      { name: "7 UP", price: 7, image: "7up.png"},
    ]
  };
  let cart = [];
  let currentCategory = "starters"; 
  const menuContainer = document.getElementById("menu-container");
  const categoryButtons = document.getElementById("category-buttons");
  const cartItemCount = document.getElementById("cart-item-count");
  const menuHeaderTitle = document.getElementById("menu-header-title");
  const cartModal = document.getElementById("cartModal");
  const modalCartBody = document.getElementById("modal-cart-body");
  const modalFooter = document.getElementById("modal-footer");
  const finishOrderBtn = document.getElementById("finish-order-btn");
  const contactPageWrapper = document.getElementById("contact-page-wrapper");
  const sendButton = document.getElementById("send-button");
  const contactForm = document.getElementById("contact-form");
  function displayMenuItems(category) {
    currentCategory = category;
    if (categoryButtons) {
        const allButtons = categoryButtons.querySelectorAll('.btn');
        allButtons.forEach(btn => btn.classList.remove('active'));
        const activeButton = document.getElementById(category + '-btn');
        if (activeButton) {
            activeButton.classList.add('active');
        }
    }
    const categoryName = document.getElementById(category + '-btn') ? document.getElementById(category + '-btn').textContent : "Menu";
    if (menuHeaderTitle) menuHeaderTitle.textContent = categoryName;
    if (menuContainer) {
      menuContainer.innerHTML = "";
      const itemsToDisplay = menu[category];
      if (!itemsToDisplay) return;
      for (const item of itemsToDisplay) {
        const itemHtml = `
          <div class="card">
            <img src="${item.image}" class="card-img-top" alt="${item.name}">
            <div class="card-body">
              <h5 class="card-title">${item.name}</h5>
              <p class="card-text">${item.price} SAR</p>
              <button class="btn btn-add-to-cart" data-name="${item.name}" data-price="${item.price}">
                Add to Cart
              </button>
            </div>
          </div>
        `;
        menuContainer.innerHTML += itemHtml;
      }
    }
  }
  function generateBillHtml() {
    if (cart.length === 0) {
      return "<p>Your cart is empty.</p>";
    }
    let billHtml = '<ul class="list-group list-group-flush">';
    let totalPrice = 0;
    for (const item of cart) {
      const itemTotal = item.price * item.quantity;
      totalPrice += itemTotal;
      billHtml += `
        <li class="list-group-item d-flex justify-content-between align-items-center">
          <div>
            <strong>${item.name}</strong><br><small>${item.price} SAR</small>
          </div>
          <div class="cart-item-controls">
            <button class="btn-quantity btn-decrement" data-name="${item.name}">-</button>
            <span class="item-quantity">${item.quantity}</span>
            <button class="btn-quantity btn-increment" data-name="${item.name}">+</button>
          </div>
        </li>
      `;
    }
    billHtml += `
      <li class="list-group-item d-flex justify-content-between align-items-center active" style="margin-top: 15px;">
        <strong>Total</strong>
        <strong>${totalPrice} SAR</strong>
      </li>
    `;
    billHtml += "</ul>"; 
    return billHtml;
  }
  function updateCartSummary() {
    let totalItems = 0;
    for (const item of cart) {
      totalItems += item.quantity;
    }
    if (cartItemCount) cartItemCount.textContent = totalItems;
    if (modalCartBody) {
        const billHtml = generateBillHtml();
        modalCartBody.innerHTML = billHtml;
    }
    if (finishOrderBtn) {
        if (cart.length === 0) {
            finishOrderBtn.style.display = 'none';
        } else {
            finishOrderBtn.style.display = 'inline-block';
        }
    }
  }
  function incrementItem(itemName) {
    let itemInCart = cart.find(item => item.name === itemName);
    if (itemInCart) {
      itemInCart.quantity++;
    }
    updateCartSummary();
  }
  function decrementItem(itemName) {
    let itemInCart = cart.find(item => item.name === itemName);
    if (itemInCart) {
      itemInCart.quantity--;
      
      if (itemInCart.quantity <= 0) {
        cart = cart.filter(item => item.name !== itemName);
      }
    }
    updateCartSummary();
  }
  function addItemToCart(itemName, itemPrice) {
    let itemInCart = cart.find(item => item.name === itemName);
    if (itemInCart) {
      itemInCart.quantity++;
    } else {
      cart.push({ name: itemName, price: itemPrice, quantity: 1 });
    }
    updateCartSummary();
  }
  if (menuContainer && categoryButtons) {
    categoryButtons.addEventListener("click", function(event) {
        const button = event.target.closest('.btn');
        if (button && button.id.endsWith('-btn')) {
            const category = button.id.replace('-btn', '');
            displayMenuItems(category);
        }
    });
    menuContainer.addEventListener("click", function(event) {
        if (event.target.classList.contains("btn-add-to-cart")) {
            const itemName = event.target.dataset.name;
            const itemPrice = parseInt(event.target.dataset.price);
            addItemToCart(itemName, itemPrice);
        }
    });
    displayMenuItems("starters");
  }
  if (cartModal) {  
      if (finishOrderBtn) {
          finishOrderBtn.addEventListener("click", function() {
              if (modalCartBody && modalFooter) {
                  modalCartBody.innerHTML = '<h3 class="text-center text-dark">Your order is being prepared, please proceed to pay at the counter.</h3>';
                  modalFooter.style.display = 'none';
              }
              cart = [];
              if (cartItemCount) cartItemCount.textContent = 0;
          });
      }
      cartModal.addEventListener('show.bs.modal', function() {
          if (modalFooter) modalFooter.style.display = 'flex';
          updateCartSummary();
      });
      if (modalCartBody) {
          modalCartBody.addEventListener("click", function(event) {
              const target = event.target;
              if (target.classList.contains("btn-increment")) {
                  const name = target.dataset.name;
                  incrementItem(name);
              }
              if (target.classList.contains("btn-decrement")) {
                  const name = target.dataset.name;
                  decrementItem(name);
              }
          });
      }
  }
  updateCartSummary();
});