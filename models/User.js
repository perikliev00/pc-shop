const mongoose = require('mongoose');

const Schema = mongoose.Schema;

    const userSchema = new Schema({
        email: { type: String, required: true },
        password: { type: String, required: true },
        cart: {
            items: [
                {
                    // Store the actual product id so we can later create Orders that require items._id.
                    // Not required to avoid breaking existing user documents that already have cart items.
                    productId: { type: Schema.Types.ObjectId, required: false },
                    title: { type: String, required: true },
                    quantity: { type: Number, required: true },
                    price : {type: Number, required: true},
                }
            ]
        },
        lastActive: { type: Date, default: Date.now }
    }, { collection: 'users' }
)
userSchema.methods.addToCart = function(product) {
    const incomingProductId = product && (product.productId || product._id);
    const cartProductIndex = this.cart.items.findIndex(cp => {
                    if (incomingProductId && cp.productId) {
                        return cp.productId.toString() === incomingProductId.toString();
                    }
                    return cp.title.toString() === product.title.toString();
                })
                let newQuantity= 1;
                const updatedCartItems = [...this.cart.items];

                if(cartProductIndex >=0) {
                    newQuantity=this.cart.items[cartProductIndex].quantity + 1;
                    updatedCartItems[cartProductIndex].quantity = newQuantity;
                    if (!updatedCartItems[cartProductIndex].productId && incomingProductId) {
                        updatedCartItems[cartProductIndex].productId = incomingProductId;
                    }
                } else {
                    updatedCartItems.push({
                        productId: incomingProductId,
                        title: product.title,
                        quantity: newQuantity,
                        price: product.price
                    });
                }
                const updatedCart = {
                    items: updatedCartItems
                };

                this.cart = updatedCart;
                return this.save()
            }
userSchema.methods.clearCart = function(productId) {    
    this.cart = { items: [] };
    return this.save();
}
userSchema.methods.removeFromCart = function(prodTitle) {
    this.cart.items = this.cart.items.filter(i => {
        return i.title !== prodTitle;
    })
    return this.save();
}
module.exports = mongoose.model('User', userSchema);