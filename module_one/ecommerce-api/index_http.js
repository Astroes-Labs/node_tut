//index_http.js

//Using the HTTP module to create a simple server

const http = require('http');
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Welcome to my e-commerce store! Its hosted without ExpressJs');
});
server.listen(3000, () => console.log('Server running at http://localhost:3000'));