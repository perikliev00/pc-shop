const User = require('../../models/User');
const Order = require('../../models/Order');
const sendOrderConfirmationEmail = require('../../sendEmail/sendEmail');
const { getSessionCart, setSessionCart } = require('../../utils/cartSession');

exports.postOrder = async (req, res, next) => {
  try {
    let user = null;
    if (req.session.user && req.session.user._id) {
      user = await User.findById(req.session.user._id);
    }

    let cartItems = getSessionCart(req);

    if ((!cartItems || cartItems.length === 0) && user && user.cart && user.cart.items) {
      cartItems = user.cart.items.map(item => ({
        title: item.title,
        price: item.price,
        quantity: item.quantity,
      }));
      setSessionCart(req, cartItems);
    }

    if (!cartItems || cartItems.length === 0) {
      return res.redirect('/cart');
    }

    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    const orderDetails = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      postalCode: req.body.postcode,
      notes: req.body.notes,
      items: cartItems,
      totalPrice,
    };

    if (req.session.user) {
      req.session.user.orderDetails = orderDetails;
    } else {
      req.session.orderDetails = orderDetails;
    }

    await Order.create(orderDetails);

    if (user) {
      await user.clearCart();
    }

    setSessionCart(req, []);

    sendOrderConfirmationEmail(orderDetails.email, JSON.stringify(orderDetails));

    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};