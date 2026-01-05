module.exports = (req, res, next) => {
  const hasSessionCart = Array.isArray(req.session.cart) && req.session.cart.length > 0;
  if (req.session.isLoggedIn || hasSessionCart) {
    return next();
  }
  return res.redirect('/cart');
};