
const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    orderId:{
        type: String,
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    orderQuantity:{
        type: Number,
        required: true
    },
    orderPrice:{
        type: Number,
        required:true   
    },
    customerName:{
        type: String,
        required:true   
    }
});

module.exports = mongoose.model('Order', orderSchema);