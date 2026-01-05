// section.js
document.addEventListener('DOMContentLoaded', () => {
  // 1) Hamburger menu toggle
  const navToggle = document.getElementById('navToggle');
  const navbar = document.getElementById('navbar');
  if (navToggle && navbar) {
    navToggle.addEventListener('click', () => {
      navbar.classList.toggle('open');
    });
  }

  // 2) Определяме началната страница (параметър page от URL)
  const initialPage = getPageFromURL();
  fetchPage(initialPage);

  // 3) При натискане на бутоните Back/Forward в браузъра
  window.addEventListener('popstate', () => {
    const page = getPageFromURL();
    fetchPage(page);
  });
});

/**
 * Проверява window.location.pathname
 * и връща съответния API маршрут:
 *  - "/cpu" → "/api/cpus"
 *  - "/ram" → "/api/ram"
 *  - (можете да добавите /cooling, /storage и т.н.)
 *  - Всичко друго → "/api/home"
 */
function getBackendEndpoint() {
  const path = window.location.pathname; // напр. "/cpu", "/ram"...

  // Нагласяте спрямо вашите реални маршрути
  if (path === '/cpu') {
    return '/api/cpus';
  } else if (path === '/ram') {
    return '/api/ram';
  } else if (path === '/cores') {
    return '/api/cores';
  } else if (path === '/cooling') {
    return '/api/cooling';
  } else if (path === '/graphics-card') {
    return '/api/graphics-card';
  } else if (path === '/other-pc-parts') {
    return '/api/other-pc-parts';
  } else if (path === '/storage') {
    return '/api/storage';
  } else if (path === '/power-supply') {
    return '/api/power-supply';
  } else if (path === '/pc-cases') {
    return '/api/pc-cases';
  }

  // Ако не се разпознае нито един път, извикваме "/api/home"
  return '/api/home';
}

/**
 * Чете ?page=N от URL; ако липсва или не е число, връща 1.
 */
function getPageFromURL() {
  const params = new URLSearchParams(window.location.search);
  const pageParam = parseInt(params.get('page'), 10);
  return isNaN(pageParam) ? 1 : pageParam;
}

/**
 * Обновява URL-а (?page=N), без да презарежда цялата страница.
 */
function updateURL(page) {
  const params = new URLSearchParams(window.location.search);
  params.set('page', page);
  window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`);
}

/**
 * Извлича данни от сървъра (правилния API) и ги визуализира.
 */
function fetchPage(page = 1) {
  // Обновяваме URL-а
  updateURL(page);

  // Определяме кой ендпойнт да извикаме
  const endpoint = getBackendEndpoint();

  // Извършваме fetch
  fetch(`${endpoint}?page=${page}`)
    .then((res) => {
      if (!res.ok) {
        return res.text().then((text) => {
          throw new Error(`Fetch error (${res.status}): ${text}`);
        });
      }
      return res.json();
    })
    .then((data) => {
      // Skip updating hero text - keep the static text from HTML
      // const heroTitle = document.querySelector('.hero h1');
      // const heroDesc = document.querySelector('.hero p');
      // if (heroTitle && data['description-title']) heroTitle.textContent = data['description-title'];
      // if (heroDesc && data.description) heroDesc.textContent = data.description;

      // 2) Продукти
      renderProducts(data.products);

      // 3) Пагинация
      renderPagination(data);
    })
    .catch(err => {
      console.error('Error fetching data:', err);
    });
}

/**
 * Рендира списъка с продукти в #cards
 * Създава <div class="card">, вкл. <img>, <h2>, <p>, 2 бутона и т.н.
 */
function renderProducts(products) {
  const cardsContainer = document.getElementById('cards');
  if (!cardsContainer) return;

  cardsContainer.innerHTML = '';

  if (!products || products.length === 0) {
    cardsContainer.innerHTML = '<p>No products found.</p>';
    return;
  }

  products.forEach(prod => {
    const title = prod.productTitle || 'No Title';
    const description = prod.productDescription || 'No description available.';
    const imageUrl = prod.productImage || 'https://via.placeholder.com/400x250';

    // 1) card wrapper
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';

    // 2) image
    const img = document.createElement('img');
    img.className = 'card-img';
    img.src = imageUrl;
    img.alt = title;
    img.loading = 'lazy'; // Лениvo зареждане
    cardDiv.appendChild(img);

    // 3) title
    const h2 = document.createElement('h2');
    h2.textContent = title;
    cardDiv.appendChild(h2);

    // 4) description
    const p = document.createElement('p');
    p.textContent = description;
    cardDiv.appendChild(p);

    // 5) buttons container
    const btnContainer = document.createElement('div');
    btnContainer.className = 'card-buttons';

    // 5a) Details button
    const detailsBtn = document.createElement('button');
    detailsBtn.className = 'details-btn';
    detailsBtn.textContent = 'Details';
    // detailsBtn.addEventListener('click', () => { ... });

    // 5b) Add to cart button
    const cartBtn = document.createElement('button');
    cartBtn.className = 'cart-btn';
    cartBtn.textContent = 'Add to Cart';
    // cartBtn.addEventListener('click', () => { ... });

    // добавяме бутоните в контейнера
    btnContainer.appendChild(detailsBtn);
    btnContainer.appendChild(cartBtn);
    cardDiv.appendChild(btnContainer);

    // Накрая добавяме .card в #cards
    cardsContainer.appendChild(cardDiv);
  });
}

/**
 * Рендира пагинацията в #pagination (предишна/следваща страница).
 */
function renderPagination(data) {
  const paginationContainer = document.getElementById('pagination');
  if (!paginationContainer) return;

  paginationContainer.innerHTML = '';

  // Previous
  if (data.hasPreviousPage) {
    const prevLink = document.createElement('a');
    prevLink.href = '#cards';
    prevLink.textContent = '«';
    prevLink.addEventListener('click', (e) => {
      e.preventDefault();
      fetchPage(data.previousPage);
    });
    paginationContainer.appendChild(prevLink);
  }

  // Current page
  const currentPageLink = document.createElement('a');
  currentPageLink.href = '#cards';
  currentPageLink.classList.add('active');
  currentPageLink.textContent = data.currentPage;
  paginationContainer.appendChild(currentPageLink);

  // Next
  if (data.hasNextPage) {
    const nextLink = document.createElement('a');
    nextLink.href = '#cards';
    nextLink.textContent = '»';
    nextLink.addEventListener('click', (e) => {
      e.preventDefault();
      fetchPage(data.nextPage);
    });
    paginationContainer.appendChild(nextLink);
  }
}
