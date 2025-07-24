//async.js

/* Create a script async.js that uses the fs module to:Write a JSON object (e.g., { "store": "My E-Commerce", "products": 5 }) to a file store.json.
Read and parse the file, then log the number of products (e.g., 5).

Use callbacks or convert to promises/async-await for practice. */



const fs = require('fs').promises;

async function manageStore() {
  const data = { store: 'My E-Commerce', products: 5 };
  await fs.writeFile('store.json', JSON.stringify(data));
  const fileData = await fs.readFile('store.json', 'utf8');
  const parsed = JSON.parse(fileData);
  console.log('Products:', parsed.products);
}

manageStore().catch(err => console.error(err));