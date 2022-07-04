const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    productName:{
        type: String, 
        required:  true,
    },
    supplierName:{
        type: String,
        required: true,
    },
    supplierContact:{
        type: Number,
        required: true,
    },
    stockQuantity:{
        type: Number,
        required: true
    },
    stockPrice:{
        type:Number,
        required:true
    }
},
{timestamps: true}
);

module.exports = mongoose.model('Stock', stockSchema);

