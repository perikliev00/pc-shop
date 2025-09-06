const path = require('path');
const jwt = require('jsonwebtoken');
const User = require('../../models/User'); 

    exports.postCart = async (req, res, next) => {
        try {
          const productTitle = req.body.productTitle;
          const productPrice = req.body.price;
          const product = { title: productTitle, price: productPrice };
          console.log('Adding product to cart:', productTitle, productPrice);
          console.log('Session data:', req.session);
          console.log('User in session:', req.session.user);
          
          // Check if user is logged in
          if (req.session && req.session.user && req.session.user._id) {
            // Logged-in user - add to database
            const user = await User.findById(req.session.user._id);
            if (!user) {
              return res.status(404).json({ message: 'User not found' });
            }
            await user.addToCart(product);
          } else {
            // Guest user - add to session
            console.log('Processing as guest user');
            if (!req.session.guestCart) {
              req.session.guestCart = { items: [] };
              console.log('Created new guest cart');
            }
            
            const cartProductIndex = req.session.guestCart.items.findIndex(cp => 
              cp.title === product.title
            );
            
            let newQuantity = 1;
            const updatedCartItems = [...req.session.guestCart.items];
            
            if (cartProductIndex >= 0) {
              newQuantity = req.session.guestCart.items[cartProductIndex].quantity + 1;
              updatedCartItems[cartProductIndex].quantity = newQuantity;
              console.log('Updated existing item quantity to:', newQuantity);
            } else {
              updatedCartItems.push({
                title: product.title,
                quantity: newQuantity,
                price: product.price
              });
              console.log('Added new item to guest cart');
            }
            
            req.session.guestCart = { items: updatedCartItems };
            console.log('Guest cart after update:', req.session.guestCart);
            
            // Save the session to ensure it's persisted
            req.session.save((err) => {
              if (err) {
                console.error('Error saving session:', err);
              } else {
                console.log('Session saved successfully');
              }
            });
          }
      
          return res.redirect('/cart');
      
        } catch (err) {
          console.error('Error in postCart:', err);
          // For guest users, still redirect to cart even if there's an error
          if (err.message && err.message.includes('Cannot read properties of undefined')) {
            return res.redirect('/cart');
          }
          res.status(500).json({ message: 'Server error', error: err.message });
        }
      };

exports.getCart = (req, res, next) => {
  try {
    const filePath = path.join(__dirname, '../../public/views', 'cart.html');
    res.sendFile(filePath, (err) => {
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
      console.log('Deleting product from cart:', productTitle);
  
      // Check if user is logged in
      if (req.session && req.session.user && req.session.user._id) {
        // Logged-in user - remove from database
        const user = await User.findById(req.session.user._id);
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        await user.removeFromCart(productTitle);
      } else {
        // Guest user - remove from session
        if (!req.session.guestCart) {
          return res.json({ success: true, message: 'Cart is already empty' });
        }
        
        req.session.guestCart.items = req.session.guestCart.items.filter(item => 
          item.title !== productTitle
        );
      }
  
      // Return JSON response instead of redirecting
      return res.json({ success: true, message: 'Product removed from cart' });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };