//e_index.js
const express = require('express');
const app = express();
const port = 3000;

//Mock product data 
const products = require('./data/products');

//GET welcome endpoint
app.get('/', (req,res) => {
    res.send('Welcome to my e-commerce API!');
});

//GET /products endpoint
app.get('/products', (req, res) =>{
    res.json(products); //Return products as JSON data
});

//GET /products/id endpoint for a specific product 
app.get('/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

//Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});