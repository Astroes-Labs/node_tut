//index.js
const express = require('express');
const app = express();
const port = 3000;

// Enable JSON parsing
app.use(express.json());

// Import products data from the products module
const products = require('./data/products');


// Import students data from the products module
const students = require('./data/students');

// Middleware to log requests and log request body for POST and PUT methods
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log('Body:', req.body);
  }
  next();
});

// GET all products with optional category filter
app.get('/api/products', (req, res) => {
  const category = req.query.category;
  if (category) {
    const filteredProducts = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    return res.json(filteredProducts);
  }
  res.json(products);
});

// GET product by ID
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

// POST new product
app.post('/api/products', (req, res) => {
  const { name, price, description } = req.body;
  if (!name || !price || !description) {
    return res.status(400).json({ message: 'Name, price, and description are required' });
  }
  const newProduct = {
    id: products.length + 1,
    name,
    price,
    description,
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// PUT update product
app.put('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ message: 'Product not found' });

  const { name, price, description } = req.body;
  if (!name || !price || !description) {
    return res.status(400).json({ message: 'Name, price, and description are required' });
  }

  product.name = name;
  product.price = price;
  product.description = description;
  res.json(product);
});

// DELETE product
app.delete('/api/products/:id', (req, res) => {
  const index = products.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Product not found' });

  products.splice(index, 1);
  res.status(204).send(); // No content
});

// GET all students
app.get('/api/students', (req, res) => {
  const grade = req.query.grade;
  if (grade) {
    const filteredStudents = students.filter(p => p.grade.toLowerCase() === grade.toLowerCase());
    return res.json(filteredStudents);
  }
  res.json(students);
});


// GET a student data by ID
app.get('/api/students/:id', (req, res) => {
  //const student = students.find(p => p.id === parseInt(req.params.id));
  //uncomment this line and comment the above to retrieve by studentID
  const student = students.find(p => p.studentID === req.params.id);
  if (!student) return res.status(404).json({ message: 'Student not found' });
  res.json(student);
});

//POST new student
app.post('/api/students', (req, res) => {
  const { name, grade, studentID } = req.body;
  if (!name || !grade || !studentID) {
    return res.status(400).json({ message: 'Name, grade, and studentID are required' });
  }
  if (students.find(s => s.studentID === studentID)) {
    return res.status(400).json({ message: 'StudentID must be unique' });
  }
  const newStudent = { id: students.length + 1, name, grade, studentID };
  students.push(newStudent);
  res.status(201).json(newStudent);
});

//Middleware to catch unexpected errors 
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});