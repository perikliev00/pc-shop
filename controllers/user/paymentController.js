// controllers/user/paymentController.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const User = require('../../models/User');

exports.processCheckout = async (req, res) => {
  try {
    // 1) Get user from DB (or from JWT userId)
    const userId = req.user.userId; // set by JWT middleware
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    // 2) Calculate total from cart items
    let totalAmount = 0;
    user.cart.items.forEach((item) => {
      totalAmount += item.price * item.quantity;
    });

    // 3) Create Stripe Payment Intent (amount in cents, multiply by 100)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100),
      currency: 'usd',
      payment_method_types: ['card'], // or whatever you need
    });

    // 4) Send clientSecret to the frontend for card processing
    res.json({
      clientSecret: paymentIntent.client_secret,
      amount: totalAmount,
    });
  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.confirmOrder = async (req, res) => {
  try {
    // Called after payment is confirmed on the frontend or via Stripe webhook
    // Let's assume user ID is in JWT
    const userId = req.user.userId;
    const user = await User.findById(userId);

    // Clear cart or do your order finalization
    const orderAmount = user.cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    // Optionally store an "Order" in the DB here
    user.clearCart(); // clear cart
    await user.save();

    //  Send email with SendGrid
    const msg = {
      to: user.email,
      from: 'no-reply@yourdomain.com',
      subject: 'Order Confirmation',
      text: `Thank you for your order of $${orderAmount}.`,
      html: `<strong>Thank you for your order of $${orderAmount}.</strong>`,
    };
    await sgMail.send(msg);

    res.json({ message: 'Order confirmed and email sent.' });
  } catch (err) {
    console.error('Error confirming order:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};
