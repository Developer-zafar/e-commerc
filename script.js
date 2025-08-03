document.addEventListener("DOMContentLoaded", function () {
  // Navbar Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('show');
    });
  }

  // AOS Initialization (Single for All Pages)
  AOS.init({
    duration: 900,
    once: true,
    easing: 'ease-in-out'
  });

  // ---------- PAGE-SPECIFIC LOGIC ----------

  // Add to Cart Page
  if (document.querySelector('.add-to-cart')) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    document.querySelectorAll('.add-to-cart').forEach(button => {
      button.addEventListener('click', () => {
        const product = {
          id: button.dataset.id,
          name: button.dataset.name,
          price: parseFloat(button.dataset.price),
          quantity: 1
        };
        const existingProduct = cart.find(item => item.id === product.id);
        if (existingProduct) {
          existingProduct.quantity++;
        } else {
          cart.push(product);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        button.classList.add('added');
        setTimeout(() => button.classList.remove('added'), 500);
        alert(`${product.name} added to cart!`);
      });
    });
  }

  // Cart Page
  if (document.getElementById('cart-items')) {
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartTable = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    function updateCart() {
      cartTable.innerHTML = '';
      let total = 0;
      if (cartItems.length === 0) {
        cartTable.innerHTML = `<tr><td colspan="5" style="text-align:center;">Your cart is empty</td></tr>`;
      }
      cartItems.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        cartTable.innerHTML += `
          <tr data-aos="fade-right" data-aos-delay="${index * 100}">
            <td>${item.name}</td>
            <td>$${item.price}</td>
            <td>${item.quantity}</td>
            <td>$${itemTotal.toFixed(2)}</td>
            <td><button class="btn remove-item" data-id="${item.id}">Remove</button></td>
          </tr>
        `;
      });
      cartTotal.textContent = total.toFixed(2);
      document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
          const id = e.target.dataset.id;
          cartItems = cartItems.filter(item => item.id !== id);
          localStorage.setItem('cart', JSON.stringify(cartItems));
          updateCart();
        });
      });
    }
    updateCart();
  }

  // Contact Page
  if (document.getElementById('contact-form')) {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('contact-status');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      status.textContent = "✅ Your message has been sent!";
      status.style.color = "green";
      status.style.fontWeight = "600";
      status.style.marginTop = "10px";
      form.reset();
    });
  }

  // Checkout Page
  if (document.getElementById('checkout-form')) {
    const orderItemsList = document.getElementById('order-items');
    const orderTotal = document.getElementById('order-total');
    const status = document.getElementById('checkout-status');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let total = 0;

    if (cart.length === 0) {
      orderItemsList.innerHTML = "<li>Your cart is empty</li>";
    } else {
      cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        orderItemsList.innerHTML += `<li>${item.name} - $${item.price} x ${item.quantity}</li>`;
      });
    }
    orderTotal.textContent = total.toFixed(2);

    document.getElementById('checkout-form').addEventListener('submit', (e) => {
      e.preventDefault();
      if (cart.length === 0) {
        status.textContent = "⚠ Your cart is empty!";
        status.style.color = "red";
        return;
      }
      status.textContent = "✅ Order Placed Successfully!";
      status.style.color = "green";
      status.style.fontWeight = "600";
      status.style.marginTop = "10px";
      localStorage.removeItem('cart');
      cart = [];
      orderItemsList.innerHTML = "<li>Your cart is empty</li>";
      orderTotal.textContent = "0";
    });
  }
});
