const faker = require('faker');
const mongojs = require("mongojs");
const db = mongojs(
    `mongodb+srv://admin:NpOiThTwPfvCVHpz@cluster0.t4zok.mongodb.net/blazedb?retryWrites=true&w=majority`,
    ['customer'],
    { ssl: true }
)

const insertCustomer = (customer) => {
    return new Promise((resolve, reject) => {
        db.customer.insert(customer, (err, doc) => {
            if (err) reject(err)
            resolve(doc)
        })
    })
}

const exists = (email) => {
    return new Promise((resolve, reject) => {
        db.customer.findOne({ email },
            (err, doc) => {
                if (err) reject(err)
                resolve(doc)
            }
        )
    })
}

const main = async () => {
    for (let i = 0; i < 1000; i++) {
        let exist = true
        let customer
        while (exist) {
            const firstName = faker.name.firstName();
            const lastName = faker.name.lastName();
            const email = faker.internet.email();
            const phoneNumber = faker.phone.phoneNumber()
            const existCustomer = await exists(email)
            customer = { firstName, lastName, email, phoneNumber };
            exist = !!existCustomer
        }
        console.log(customer)
        await insertCustomer(customer)
        console.log(i)
    }
    console.log("Fin")
}

main()