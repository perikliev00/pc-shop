module.exports = (req, res, next) => {
  const userCartItems = req.session.user?.cart?.items?.length || 0;
  const sessionCartItems = Array.isArray(req.session.cart) ? req.session.cart.length : 0;

  if (userCartItems > 0 || sessionCartItems > 0) {
    return next();
  }

  return res.redirect('/cart');
};