const express = require("express");
const mongojs = require("mongojs");
const bodyParser = require("body-parser");
var app = express();
const db = mongojs(
    `mongodb+srv://admin:NpOiThTwPfvCVHpz@cluster0.t4zok.mongodb.net/blazedb?retryWrites=true&w=majority`,
    ['customer'],
    { ssl: true }
)

app.set("port", (process.env.PORT || 4000));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.listen(app.get("port"), function () {
    console.log("Listo puerto 4000");
});

app.post("/add", function (req, res) {
    const { firstName, lastName, email, phoneNumber } = req.body
    const customer = { firstName, lastName, email, phoneNumber };
    db.customer.insert(customer, (err, doc) => {
        if (err) console.log(err)
        res.send(doc);
    })
})

app.get("/", function (req, res) {
    db.customer.find({},
        (err, doc) => {
            if (err) console.log(err)
            res.send(doc)
        }
    )
})

app.put("/update/:customerId", function (req, res) {
    const { firstName, lastName, email, phoneNumber } = req.body
    const customer = { firstName, lastName, email, phoneNumber };
    const customerId = req.params.customerId
    db.customer.findAndModify({
        query: { _id: mongojs.ObjectId(customerId) },
        update: { $set: customer },
        new: true
    }, (err, doc, lastErrorObject) => {
        if (err) console.log(err)
        res.send(doc)
    })
})