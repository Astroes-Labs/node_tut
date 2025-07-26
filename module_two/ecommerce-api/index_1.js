// index.js
const express = require('express');
const app = express();
const port = 3000;


// Enable JSON parsing
app.use(express.json());

// Mock product data
const products = [
  { id: 1, name: 'Laptop', price: 999, description: 'High-performance laptop' },
  { id: 2, name: 'Smartphone', price: 699, description: 'Latest smartphone model' },
];

// GET all products
app.get('/products', (req, res) => {
  res.json(products);
});

// GET product by ID
app.get('/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

app.post('/test', (req, res) => { 
  console.log('Received body:', req.body);
  res.json({ received: req.body });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});