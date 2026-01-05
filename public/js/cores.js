document.addEventListener('DOMContentLoaded', () => {
    // 1) Hamburger menu toggle
    const navToggle = document.getElementById('navToggle');
    const navbar = document.getElementById('navbar');
  
    navToggle.addEventListener('click', () => {
      navbar.classList.toggle('open');
    });
  
    // 2) Determine initial page from URL & fetch
    const initialPage = getPageFromURL();
    fetchPage(initialPage);
  
    // 3) Handle browser Back/Forward navigation
    window.addEventListener('popstate', () => {
      const page = getPageFromURL();
      fetchPage(page);
    });
  });
  
  /**
   * Определя кой бекенд маршрут да извика.
   * Ако URL пътят е '/cpu' → '/api/cpus', иначе → '/api/home'.
   */
  function getBackendEndpoint() {
    const path = window.location.pathname; // напр. "/cpu" или "/"
  
    if (path === '/cores') {
      return '/api/cores'; 
    }
    // Може да добавите: if (path === '/gpu') return '/api/gpus';
    return '/api/home';
  }
  
  /**
   * Чете ?page=N от URL. Ако го няма или не е валидно – връща 1.
   */
  function getPageFromURL() {
    const params = new URLSearchParams(window.location.search);
    const pageParam = parseInt(params.get('page'), 10);
    return isNaN(pageParam) ? 1 : pageParam;
  }
  
  /**
   * Обновява URL-а (?page=N) без презареждане на цялата страница.
   */
  function updateURL(page) {
    const params = new URLSearchParams(window.location.search);
    params.set('page', page);
    window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`);
  }
  
  /**
   * Извлича данни от сървъра и ги визуализира.
   */
  function fetchPage(page = 1) {
    updateURL(page);
  
    // Пример: ако сме на "/cpu", ще извика "/api/cpus?page=1"
    const endpoint = getBackendEndpoint(); 
  
    fetch(`${endpoint}?page=${page}`)
      .then((res) => {
        // Проверяваме дали отговорът е OK (2xx)
        if (!res.ok) {
          return res.text().then((text) => {
            throw new Error(`Fetch error (status ${res.status}): ${text}`);
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
        console.error('Error fetching home-content:', err);
      });
  }
  
  /**
   * Рендираме списък с продукти в #cards
   */
  function renderProducts(products) {
    const cardsContainer = document.getElementById('cards');
    cardsContainer.innerHTML = '';
  
    if (!products || products.length === 0) {
      cardsContainer.innerHTML = '<p>No products found.</p>';
      return;
    }
  
    products.forEach(prod => {
      const title = prod['productTitle'] || 'No Title';
      const description = prod['productDescription'] || 'No description available.';
  
      // Генерираме линк, примерно "/cpu" от "CPU", но тук просто пример:
      const route = '/' + title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
  
      const cardLink = document.createElement('a');
      cardLink.className = 'card';
      cardLink.href = route;
      cardLink.innerHTML = `
        <h2>${title}</h2>
        <p>${description}</p>
      `;
      cardsContainer.appendChild(cardLink);
    });
  }
  
  /**
   * Рендираме пагинация (предишна/следваща страница).
   */
  function renderPagination(data) {
    const paginationContainer = document.getElementById('pagination');
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