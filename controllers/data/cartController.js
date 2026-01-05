const User = require('../../models/User');
const { setSessionCart, getSessionCart } = require('../../utils/cartSession');




exports.getCart = async (req, res, next) => {
  try {
    if (req.session.isLoggedIn && req.session.user && req.session.user._id) {
      const user = await User.findById(req.session.user._id);
      if (user) {
        const items = user.cart?.items || [];
        setSessionCart(req, items);
        return res.json({ cart: getSessionCart(req) });
      }
    }

    return res.json({ cart: getSessionCart(req) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

