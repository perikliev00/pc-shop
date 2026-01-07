const path = require('path');
const User = require('../../models/User');
const {
  addItemToSessionCart,
  removeItemFromSessionCart,
  setSessionCart,
  getSessionCart,
  normalizePrice,
} = require('../../utils/cartSession');

exports.postCart = async (req, res, next) => {
  try {
    const productId = req.body.productId;
    const productTitle = req.body.productTitle;
    const productPrice = normalizePrice(req.body.price);

    if (!productTitle) {
      return res.redirect('/cart');
    }

    addItemToSessionCart(req, productId, productTitle, productPrice);

    if (req.session.user && req.session.user._id) {
      const user = await User.findById(req.session.user._id);
      if (user) {
        const updatedUser = await user.addToCart({ _id: productId, title: productTitle, price: productPrice });
        setSessionCart(req, updatedUser.cart.items);
      }
    }

    return res.redirect('/cart');
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getCart = (req, res, next) => {
  try {
    const filePath = path.join(__dirname, '../../public/views', 'cart.html');
    res.sendFile(filePath, err => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const productTitle = req.body.productTitle;
    if (!productTitle) {
      return res.json({ success: true, cart: getSessionCart(req) });
    }

    removeItemFromSessionCart(req, productTitle);

    if (req.session.user && req.session.user._id) {
      const user = await User.findById(req.session.user._id);
      if (user) {
        await user.removeFromCart(productTitle);
        setSessionCart(req, user.cart.items);
      }
    }

    return res.json({ success: true, cart: getSessionCart(req) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};