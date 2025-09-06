const pathParts = window.location.pathname.split('/');
const productId = pathParts[pathParts.length - 1];

const params = new URLSearchParams(window.location.search);
const category = params.get('category') || 'home';

function getProductEndpoint(productId, category) {
  return `/api/productDetails/${productId}/${encodeURIComponent(category)}`;
}

const endpoint = getProductEndpoint(productId, category);
console.log(`Fetching product details from: ${endpoint}`);

fetch(endpoint)
  .then(response => {
    if (!response.ok) {
      throw new Error(`Error fetching product details: ${response.status}`);
    }
    return response.json();
  })
  .then(product => {
    document.getElementById('product-title').textContent = product.productTitle || "No Title";

    // Normalize and encode image URL, ensure leading slash [[memory:6386359]]
    let imageUrl = product.imageUrl || "/images/fallback.svg";
    if (imageUrl) {
      imageUrl = imageUrl.replace(/^\/+/, '');
      imageUrl = '/' + encodeURI(imageUrl);
    }
    const productImg = document.getElementById('product-image');
    productImg.src = imageUrl;
    productImg.alt = product.productTitle || 'Product Image';
    productImg.onerror = () => {
      productImg.onerror = null;
      productImg.src = '/images/fallback.svg';
    };

    document.getElementById('product-description').textContent = product.productDescription || "No description available.";

    // Build specs grid
    const specsList = document.getElementById('specs-grid');
    if (specsList) {
      specsList.innerHTML = "";
      const basicFields = ['_id', 'productTitle', 'productDescription', 'price', 'imageUrl', 'productDetails', '__v', 'id'];
      for (let key in product) {
        if (Object.prototype.hasOwnProperty.call(product, key) && !basicFields.includes(key) && product[key] !== undefined && product[key] !== null && String(product[key]).trim() !== '') {
          const li = document.createElement('li');
          const label = document.createElement('span');
          label.className = 'spec-key';
          label.textContent = key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
          const value = document.createElement('span');
          value.className = 'spec-value';
          value.textContent = String(product[key]);
          li.appendChild(label);
          li.appendChild(value);
          specsList.appendChild(li);
        }
      }
    }

    document.getElementById('product-details').textContent = product.productDetails || "";

    // Update price badge and SR text
    const priceNumber = Number(product.price);
    const formattedPrice = isNaN(priceNumber) ? (product.price || '') : priceNumber.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
    const badge = document.getElementById('price-badge');
    if (badge && formattedPrice) badge.textContent = formattedPrice;
    const srPrice = document.getElementById('product-price');
    if (srPrice && formattedPrice) srPrice.textContent = `Price: ${formattedPrice}`;

    // Prepare cart form
    document.getElementById('cart-product-id').value = productId;
    document.getElementById('cart-product-title').value = product.productTitle || "";
    document.getElementById('cart-product-price').value = product.price || "";
    document.getElementById('cart-category').value = category;
  })
  .catch(err => {
    console.error(err);
    document.getElementById('product-title').textContent = "Error loading product details";
  });

const navToggle = document.getElementById('mobile-nav-toggle');
const navbar = document.getElementById('navbar');
if (navToggle && navbar) {
  navToggle.addEventListener('click', () => {
    navbar.classList.toggle('open');
  });
}
