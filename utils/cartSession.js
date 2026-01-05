'use strict';

function normalizePrice(value) {
  if (value === undefined || value === null) {
    return 0;
  }
  const parsed = parseFloat(String(value).replace(/[^0-9.-]/g, ''));
  if (!Number.isFinite(parsed)) {
    return 0;
  }
  return parseFloat(parsed.toFixed(2));
}

function toPlainItem(item = {}) {
  return {
    title: item.title,
    price: normalizePrice(item.price),
    quantity: item.quantity && item.quantity > 0 ? item.quantity : 1
  };
}

function ensureSessionCart(req) {
  if (!req.session.cart) {
    req.session.cart = [];
  }
  return req.session.cart;
}

function setSessionCart(req, items = []) {
  const plainItems = items.map(toPlainItem);
  req.session.cart = plainItems;
  if (req.session.user) {
    req.session.user.cart = { items: plainItems };
  }
  return plainItems;
}

function addItemToSessionCart(req, title, price) {
  const cart = ensureSessionCart(req);
  const normalizedPrice = normalizePrice(price);
  const existing = cart.find(item => item.title === title);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ title, price: normalizedPrice, quantity: 1 });
  }
  return cart;
}

function removeItemFromSessionCart(req, title) {
  if (!req.session.cart) {
    req.session.cart = [];
    return req.session.cart;
  }
  req.session.cart = req.session.cart.filter(item => item.title !== title);
  if (req.session.user && req.session.user.cart) {
    req.session.user.cart.items = req.session.cart;
  }
  return req.session.cart;
}

function getSessionCart(req) {
  return req.session.cart || [];
}

module.exports = {
  normalizePrice,
  setSessionCart,
  addItemToSessionCart,
  removeItemFromSessionCart,
  getSessionCart,
};




