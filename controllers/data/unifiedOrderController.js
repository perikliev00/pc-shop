const User = require('../../models/User');
const Order = require('../../models/Order');
const mongoose = require('mongoose');
const sendOrderConfirmationEmail = require('../../sendEmail/sendEmail');

// Helper function to get cart data for order processing
async function getCartDataForOrder(req) {
  if (req.session && req.session.user && req.session.user._id) {
    // Logged-in user - get cart from database
    const user = await User.findById(req.session.user._id);
    if (!user) {
      throw new Error('User not found');
    }
    return {
      items: user.cart.items || [],
      isGuest: false,
      userId: user._id
    };
  } else {
    // Guest user - get cart from session
    const guestCart = req.session.guestCart || { items: [] };
    return {
      items: guestCart.items || [],
      isGuest: true,
      userId: null
    };
  }
}

// Helper function to clear cart after order
async function clearCartAfterOrder(req) {
  if (req.session && req.session.user && req.session.user._id) {
    // Logged-in user - clear from database
    const user = await User.findById(req.session.user._id);
    if (user) {
      await user.clearCart();
      await user.save();
    }
  } else {
    // Guest user - clear from session
    req.session.guestCart = { items: [] };
  }
}

// Create order for both logged-in and guest users
exports.createOrder = async (req, res) => {
  try {
    const { name, email, phone, address, postalCode, notes } = req.body;
    
    // Validate required fields
    if (!name || !email || !phone || !address || !postalCode) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please fill in all required fields' 
      });
    }

    // Get cart data
    const cartData = await getCartDataForOrder(req);
    
    if (!cartData.items || cartData.items.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cart is empty' 
      });
    }

    // Calculate total price
    const totalPrice = cartData.items.reduce((total, item) => total + (item.price * item.quantity), 0);

    // Prepare items with proper _id for database storage
    const orderItems = cartData.items.map(item => ({
      title: item.title,
      quantity: item.quantity,
      price: parseFloat(item.price),
      _id: item._id || new mongoose.Types.ObjectId() // Generate ObjectId if not present
    }));

    // Create order details
    const orderDetails = {
      name,
      email,
      phone,
      address,
      postalCode,
      notes: notes || '',
      items: orderItems,
      totalPrice,
      isGuest: cartData.isGuest,
      userId: cartData.userId,
      orderDate: new Date(),
      status: 'pending'
    };

    // Save order to database
    const order = await Order.create(orderDetails);

    // Clear cart after successful order
    await clearCartAfterOrder(req);

    // Send confirmation email
    try {
      await sendOrderConfirmationEmail(email, JSON.stringify(orderDetails));
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
      // Don't fail the order if email fails
    }

    console.log('Order created successfully:', order._id);
    
    return res.json({ 
      success: true, 
      message: 'Order placed successfully!',
      orderId: order._id,
      isGuest: cartData.isGuest
    });

  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: err.message 
    });
  }
};

// Get order details for display
exports.getOrderDetails = async (req, res) => {
  try {
    const cartData = await getCartDataForOrder(req);
    
    if (!cartData.items || cartData.items.length === 0) {
      return res.json({ 
        success: false, 
        message: 'Cart is empty',
        items: [],
        totalPrice: 0,
        isGuest: cartData.isGuest
      });
    }

    const totalPrice = cartData.items.reduce((total, item) => total + (item.price * item.quantity), 0);

    return res.json({
      success: true,
      items: cartData.items,
      totalPrice,
      isGuest: cartData.isGuest
    });

  } catch (err) {
    console.error('Error getting order details:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: err.message 
    });
  }
};
