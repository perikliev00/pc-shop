document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.getElementById('navToggle');
  const navbar = document.getElementById('navbar');
  if (navToggle && navbar) {
    navToggle.addEventListener('click', () => {
      navbar.classList.toggle('open');
    });
  }

  const loginLink = document.querySelector('.login-link');
  const signupLink = document.querySelector('.signup-link');
  const logoutLink = document.querySelector('.logout-link');
  const logoutBtn = document.getElementById('logoutBtn');
  let navMenu = null;
  if (navbar) {
    navMenu = navbar.querySelector('ul');
  }

  async function checkAuth() {
    try {
      const response = await fetch('/session-status', {
        method: 'GET',
        credentials: 'include' 
      });
      const data = await response.json();

      if (data.isLoggedIn) {
        if (loginLink) loginLink.style.display = 'none';
        if (signupLink) signupLink.style.display = 'none';
        if (logoutLink) logoutLink.style.display = 'inline-block';


        if (data.email === 'admin@email.com') {
          const adminLi = document.createElement('li');
          const adminA = document.createElement('a');
          adminA.href = '/admin';
          adminA.textContent = 'Admin Panel';
          adminLi.appendChild(adminA);

          if (navMenu) {
            navMenu.appendChild(adminLi);
          }
        }

      } else {
        if (loginLink) loginLink.style.display = 'inline-block';
        if (signupLink) signupLink.style.display = 'inline-block';
        if (logoutLink) logoutLink.style.display = 'none';
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    }
  }
  checkAuth();

  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      fetch('/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(res => {
          if (res.ok) {
            sessionStorage.removeItem('email');
            sessionStorage.removeItem('loggedIn');
            window.location.href = '/';
          }
        })
        .catch(err => console.error('Logout failed:', err));
    });
  }

  const path = window.location.pathname;
  if (path.startsWith('/login') || path.startsWith('/register')) {
    return;
  }

  window.addEventListener('popstate', () => {
    const page = getPageFromURL();
    fetchPage(page, false);
  });

  const initialPage = getPageFromURL();
  fetchPage(initialPage);

  function getPageFromURL() {
    const params = new URLSearchParams(window.location.search);
    const pageParam = parseInt(params.get('page'), 10);
    return isNaN(pageParam) ? 1 : pageParam;
  }

  function updateURL(page) {
    const params = new URLSearchParams(window.location.search);
    params.set('page', page);
    window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`);
  }


  function fetchPage(page = 1, shouldPushState = true) {
    if (shouldPushState) {
      updateURL(page);
    }
    fetch(`/api/home?page=${page}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => {
        if (!res.ok) throw new Error(`Fetch error: ${res.status}`);
        return res.json();
      })
      .then(data => {
        // Update hero title and description
        const heroTitle = document.querySelector('.hero h1');
        const heroDesc = document.querySelector('.hero p');
        // Only update if API returns different content, keep existing text otherwise
        if (heroTitle && data['description-title']) {
          heroTitle.textContent = data['description-title'];
        }
        if (heroDesc && data.description) {
          heroDesc.textContent = data.description;
        }

        renderProducts(data.products);
        renderPagination(data);
      })
      .catch(err => console.error('Error fetching home-content:', err));
  }

  // Map section titles to SVGs in /images
  function normalizeTitle(title) {
    return String(title || '')
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, ' ');
  }

  const sectionImageMap = {
    'cpu': '/images/section-cpu.svg',
    'cores': '/images/section-cpu.svg',
    'other pc parts': '/images/section-other.svg',
    'graphics card': '/images/section-graphics.svg',
    'ram': '/images/section-ram.svg',
    'storage': '/images/section-storage.svg',
    'power supply': '/images/section-power.svg',
    'cooling systems': '/images/section-cooling.svg',
    'pc cases': '/images/section-case.svg'
  };

  function getSectionImage(title, prod) {
    const explicit = prod && (prod.image || prod.imageUrl);
    if (explicit && typeof explicit === 'string') {
      const prefixed = explicit.startsWith('/') ? explicit : `/${explicit}`;
      return encodeURI(prefixed);
    }
    const key = normalizeTitle(title);
    return sectionImageMap[key] || '/images/placeholder-product.jpg';
  }

  function renderProducts(products) {
    const cardsContainer = document.getElementById('cards');
    if (!cardsContainer) return;
    cardsContainer.innerHTML = '';

    if (!products || products.length === 0) {
      cardsContainer.innerHTML = '<p>No products found.</p>';
      return;
    }

    products.forEach(prod => {
      const title = prod['product-title'] || 'No Title';
      const description = prod['product-description'] || 'No description available.';
      const imageUrl = getSectionImage(title, prod);
      const route = '/' + title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');

      const cardLink = document.createElement('a');
      cardLink.className = 'card';
      cardLink.href = route;
      cardLink.innerHTML = `
        <img class="card-img" src="${imageUrl}" alt="${title}" loading="lazy"/>
        <h2>${title}</h2>
        <p>${description}</p>
      `;
      cardsContainer.appendChild(cardLink);
    });
  }

  function renderPagination(data) {
    const paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) return;
    paginationContainer.innerHTML = '';

    if (data.hasPreviousPage) {
      const prevLink = document.createElement('a');
      prevLink.href = '#cards';
      prevLink.textContent = '«';
      prevLink.addEventListener('click', e => {
        e.preventDefault();
        fetchPage(data.previousPage);
      });
      paginationContainer.appendChild(prevLink);
    }

    const currentPageLink = document.createElement('a');
    currentPageLink.href = '#cards';
    currentPageLink.classList.add('active');
    currentPageLink.textContent = data.currentPage;
    paginationContainer.appendChild(currentPageLink);

    if (data.hasNextPage) {
      const nextLink = document.createElement('a');
      nextLink.href = '#cards';
      nextLink.textContent = '»';
      nextLink.addEventListener('click', e => {
        e.preventDefault();
        fetchPage(data.nextPage);
      });
      paginationContainer.appendChild(nextLink);
    }
  }
});
