//index.js
const express = require('express');
const app = express();
const port = 3000;

//Mock product data 
const products = [
    { id: 1, name: 'Laptop', price: 999.99 },
    { id: 2, name: 'Smartphone', price: 499.99 },
    { id: 3, name: 'Tablet', price: 299.99 },
    { id: 4, name: 'Smartwatch', price: 199.99 },
    { id: 5, name: 'Headphones', price: 99.99 }
];

//GET /products endpoint
app.get('/products', (req, res) =>{
    res.json(products); //Return products as JSON data
});

//Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});