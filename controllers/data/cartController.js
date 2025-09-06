const User = require('../../models/User');




exports.getCart = async (req, res, next) => {
  try {
    // Check if user is logged in
    if (req.session && req.session.user && req.session.user._id) {
      // Logged-in user - get cart from database
      const user = await User.findById(req.session.user._id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (!user.cart || !user.cart.items || user.cart.items.length === 0) {
        return res.json({ cart: [], isGuest: false });
      }

      res.json({ cart: user.cart.items, isGuest: false });
    } else {
      // Guest user - get cart from session
      const guestCart = req.session.guestCart || { items: [] };
      res.json({ cart: guestCart.items, isGuest: true });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

