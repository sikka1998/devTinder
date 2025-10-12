const express = require('express');
const app = express();

app.use('/about', (req, res) => {
    res.send('Hello from About Us page!');
})

app.use('/', (req, res) => {
    res.send('Hello from Server!');
})

app.listen(7777, () => {
    console.log('Server is successfully running on port 7777');
})