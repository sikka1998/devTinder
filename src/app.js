const express = require('express');
const app = express();
const { authAdmin, authUser } = require('./middlewares/auth');

// app.use('/about', [(req, res, next) => {
//     //res.send('Hello from About Us page!');
//     next();
// },
// (req, res, next) => {
//     console.log('About Us page visited');
//     // res.send('Hello from About Us page - 1st middleware!');
//     next();
// },
// (req, res, next) => {
//     console.log('About Us page visited - 2nd middleware');
//     // res.send('Hello from About Us page - 2nd middleware!');
// }]);

app.use('/admin', authAdmin, (req, res, next) => {
    res.send('Hello from Admin page!');
});

app.use('/user', authUser);

app.get("/user", (req, res) => {
    res.send({
        firstName: "Mohamed",
        lastName: "Sikkander",
        age: 27,
    })
})

app.post("/user", (req, res) => {
    res.send({
        response_status: "success",
        message: "User is registered successfully",
    });
});

app.put("/user", (req, res) => {
    res.send({
        response_status: "success",
        message: "User is updated successfully",
    });
});

app.delete("/user", (req, res) => {
    throw new Error("User is not deleted");
    // res.send({
    //     response_status: "success",
    //     message: "User is deleted successfully",
    // });
});

app.use("/", (err, req, res, next) => {
    if(err){
        res.status(500).send({
            message: "Something went wrong",
        })
    }
})

app.listen(7777, () => {
    console.log('Server is successfully running on port 7777');
})