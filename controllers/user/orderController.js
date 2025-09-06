const path = require('path');
const unifiedOrderController = require('../data/unifiedOrderController');

exports.getOrderDetails = async (req, res, next) => {
    try {
        const filePath = path.join(__dirname, '../../public/views', 'order-details.html');
        res.sendFile(filePath, (err) => {
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
            }
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}

// Use unified order creation for both logged-in and guest users
exports.postOrder = async (req, res, next) => {
    try {
        return await unifiedOrderController.createOrder(req, res);
    } catch (err) {
        console.error('Error in postOrder:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Server error', 
            error: err.message 
        });
    }
}