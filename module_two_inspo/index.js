//index.js
const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const app = express();
const port = 3000;

// Enable JSON parsing
app.use(express.json());

// Import initial data
let products = require('./data/products');
let students = require('./data/students');

// File paths
const PRODUCTS_FILE = path.resolve('./data/products.json');
const STUDENTS_FILE = path.resolve('./data/students.json');

// Read data from JSON file or initialize with default data
async function readData(filePath, defaultData) {
  try {
    const fileData = await fs.readFile(filePath, 'utf8');
    const parsed = JSON.parse(fileData);
    console.log(`Read data from ${path.basename(filePath)}: ${parsed}`);
    return parsed;
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log(`${path.basename(filePath)} does not exist, initializing with default data`);
      await writeData(filePath, defaultData);
      return defaultData;
    }
    console.error(`Error reading ${path.basename(filePath)}:`, err);
    throw err;
  }
}

// Save data to JSON file
async function writeData(filePath, data) {
  try {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    console.log(`Saved data to ${path.basename(filePath)}`);
    return true;
  } catch (err) {
    console.error(`Error saving ${path.basename(filePath)}:`, err);
    throw err;
  }
}

// Load data on startup
async function initializeData() {
  try {
    products = await readData(PRODUCTS_FILE, products);
    students = await readData(STUDENTS_FILE, students);
  } catch (err) {
    console.error('Failed to initialize data:', err);
    // Continue with in-memory data
  }
}

// Initialize data and start server
initializeData().then(() => {
  // Middleware to log requests and request body for POST and PUT
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
      const filteredProducts = products.filter(p => p.category && p.category.toLowerCase() === category.toLowerCase());
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
  app.post('/api/products', async (req, res) => {
    const { name, price, description, category } = req.body;
    if (!name || !price || !description) {
      return res.status(400).json({ message: 'Name, price, and description are required' });
    }
    const newProduct = {
      id: products.length + 1,
      name,
      price,
      description,
      category: category || 'Uncategorized'
    };
    products.push(newProduct);
    await writeData(PRODUCTS_FILE, products);
    res.status(201).json(newProduct);
  });

  // PUT update product
  app.put('/api/products/:id', async (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const { name, price, description, category } = req.body;
    if (!name || !price || !description) {
      return res.status(400).json({ message: 'Name, price, and description are required' });
    }
    product.name = name;
    product.price = price;
    product.description = description;
    product.category = category || product.category || 'Uncategorized';
    await writeData(PRODUCTS_FILE, products);
    res.json(product);
  });

  // DELETE product
  app.delete('/api/products/:id', async (req, res) => {
    const index = products.findIndex(p => p.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ message: 'Product not found' });
    products.splice(index, 1);
    await writeData(PRODUCTS_FILE, products);
    res.status(204).send();
  });

  // GET all students with optional grade filter
  app.get('/api/students', (req, res) => {
    const grade = req.query.grade;
    if (grade) {
      const filteredStudents = students.filter(p => p.grade && p.grade.toLowerCase() === grade.toLowerCase());
      return res.json(filteredStudents);
    }
    res.json(students);
  });

  // GET student by studentID
  app.get('/api/students/:id', (req, res) => {
    const student = students.find(p => p.studentID === req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  });

  // POST new student
  app.post('/api/students', async (req, res) => {
    const { name, grade, studentID } = req.body;
    if (!name || !grade || !studentID) {
      return res.status(400).json({ message: 'Name, grade, and studentID are required' });
    }
    if (students.find(s => s.studentID === studentID)) {
      return res.status(400).json({ message: 'StudentID must be unique' });
    }
    const newStudent = { id: students.length + 1, name, grade, studentID };
    students.push(newStudent);
    await writeData(STUDENTS_FILE, students);
    res.status(201).json(newStudent);
  });

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
  });

  // Start the server
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}).catch(err => {
  console.error('Failed to initialize server:', err);
  process.exit(1);
});