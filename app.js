const express = require("express");
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const path = require("path");
// const expressValidator = require('express-validator');
// const session = require('express-session');
const app = express();


//load Orders model
const Order = require("./models/order");
const Stock = require("./models/stock");

// dotenv.config({ path: 'config.env'});
const PORT = process.env.PORT || 8080;


//mongoDB configuration
// const db = require('./setup/myurl').mongoURL;
const db = "mongodb+srv://harishmanikbtg:1234@cluster0.e3vpr.mongodb.net/InentorySystem?retryWrites=true&w=majority"

//attempt to connect to database
mongoose
    .connect(db)
    .then(() => console.log(`MongoDB connected successfully.`))
    .catch(err => console.log(err));

// EXPRESS SPECIFIC STUFF
app.use('/static', express.static('static')) // For serving static files

// PUG SPECIFIC STUFF
app.set('view engine', 'pug') // Set the template engine as pug
app.set('views', path.join(__dirname, 'views')) // Set the views directory


// app.use(expressValidator({
//     errorFormatter: function(param, msg, value){
//         var namespace = param.split('.')
//         , root = namespace.shift()
//         , formParam = root;

//         while(namespace.length){
//             formParam += '[' + namespace.shift() + ']';
//         }

//         return {
//             param : formParam,
//             msg : msg,
//             value : value,
//         };
//     }
// }));



//middleware for bodyparser/express
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());



// ENDPOINTS
app.get('/', (req, res) => {
    res.status(200).render('home.pug');
})



app.get('/stock', async (req, res) => {
    try {
        const stocks = await Stock.find();
        res.render('stock', { purch: stocks });
    } catch (err) {
        res.status(404).send({ err: err });
    }
});




app.get('/add-stock', (req, res) => {
    const params = {}
    res.status(200).render('add_stock.pug', params);
})


app.post("/add-stock", async (req, res) => {
    const stockE = await Stock.findOne({ productName: req.body.productName });
    if (stockE) {
        stockE.save();
        res.redirect('/stock');
    } else {
        var mystock = new Stock(req.body);
        mystock.save()
            .then(item => {
                res.redirect('/stock');
            })
            .catch(err => {
                res.send(err);
            });
    }
});



app.get('/order', async (req, res) => {
    try {
        const orders = await Order.find();
        res.render('order', { ord: orders });
    } catch (err) {
        res.status(404).send({ err: err });
    }
})



app.get('/add-order', (req, res) => {
    res.status(200).render('add_order.pug');
})



app.post('/add-order', (req, res) => {
    var myOrder = new Order(req.body);
    myOrder.save()
        .then(item => {
            res.redirect('/order');
        })
        .catch(err => {
            res.send(err);
        });
});



app.get('/order/update-order/:id', (req, res) => {
    Order.findById(req.params.id, (err, order) => {
        res.render('update_order', {
            order: order
        });
    });
});



app.post("/order/update-order/:id", (req, res) => {
    let order = {};
    order.orderId = req.body.orderId;
    order.productName = req.body.productName;
    order.orderQuantity = req.body.orderQuantity;
    order.orderPrice = req.body.orderPrice;
    order.customerName = req.body.customerName;

    let query = { _id: req.params.id };

    Order.findOneAndUpdate(query, order, function (err) {
        if (err) {
            console.log(err);
            return;
        } else {
            res.redirect("/order");
        }
    });
});



app.get('/stock/update-stock/:id', (req, res)=>{
    Stock.findById(req.params.id, (err, stock) => {
        res.render('update_stock', {
            stock: stock 
        });
    });
});



app.post("/stock/update-stock/:id", (req, res)=>{
    let stock = {};
    stock.productName = req.body.productName;
    stock.supplierName = req.body.supplierName;
    stock.supplierContact = req.body.supplierContact;
    stock.stockQuantity = req.body.stockQuantity;
    stock.stockPrice = req.body.stockPrice;

    let query = {_id: req.params.id};

    Stock.findOneAndUpdate(query, stock, function(err){
        if(err) {
            console.log(err);
            return;
        }else{
             res.redirect("/stock");
        }
    });
});





app.get("/order/delete/:id", function (req, res) {
    Order.findByIdAndRemove(req.params.id, (err, order) => {
        if (!err) {
            res.redirect("/order");
        } else {
            console.log(err);
        }
    });
});



app.get("/stock/delete/:id", function (req, res) {
    Stock.findByIdAndRemove(req.params.id, (err, stock) => {
        if (!err) {
            res.redirect("/stock");
        } else {
            console.log(err);
        }
    });
});





// START THE SERVER
app.listen(PORT, () => {
    console.log(`The application started successfully at http://localhost:${PORT}`);
});