const mongoose = require('mongoose');
const Product = require('./models/Product');

mongoose.connect('mongodb://localhost:27017/auth-system', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log('MongoDB connected');

  const products = [
    // Jerseys
    { id: 1, name: 'Germany Black Iconic Pre Match 2025/26 Official', price: 2, discount: 2, image: 'jersey1.jpg', sizes: ['S', 'M', 'L', 'XL'], category: 'jerseys' },
    { id: 2, name: 'Italia X Versace Black Premium Kit 2024/25', price: 3, discount: 3, image: 'jersey2.jpg', sizes: ['M', 'L', 'XL'], category: 'jerseys' },
    { id: 3, name: 'Real Madrid White and Gold Premium Kit 2025/26', price: 3, discount: 2, image: 'jersey3.jpg', sizes: ['S', 'M', 'L'], category: 'jerseys' },
    { id: 4, name: 'Italia X Versace White Premium Kit 2024/25', price: 9999, discount: 6999, image: 'jersey4.jpg', sizes: ['M', 'L', 'XL'], category: 'jerseys' },
    { id: 5, name: 'Barcelona Red Special Edition Premium 2025/26', price: 9999, discount: 7999, image: 'jersey1.jpg', sizes: ['S', 'M', 'L', 'XL'], category: 'jerseys' },
    { id: 6, name: 'Spain Red Premium Kit 2025/26', price: 9500, discount: 7499, image: 'jersey2.jpg', sizes: ['M', 'L', 'XL'], category: 'jerseys' },
    { id: 7, name: 'France Blue Elite Kit 2025/26', price: 9999, discount: 6999, image: 'jersey3.jpg', sizes: ['S', 'M', 'L'], category: 'jerseys' },
    { id: 8, name: 'Brazil Yellow Classic Kit 2025/26', price: 9999, discount: 6999, image: 'jersey4.jpg', sizes: ['M', 'L', 'XL'], category: 'jerseys' },
    { id: 9, name: 'Argentina Sky Blue Premium Kit 2025/26', price: 9999, discount: 7999, image: 'jersey1.jpg', sizes: ['S', 'M', 'L', 'XL'], category: 'jerseys' },
    { id: 10, name: 'Portugal Green Special Edition 2025/26', price: 9500, discount: 7499, image: 'jersey2.jpg', sizes: ['M', 'L', 'XL'], category: 'jerseys' },
    { id: 11, name: 'England White Premium Kit 2025/26', price: 9999, discount: 6999, image: 'jersey3.jpg', sizes: ['S', 'M', 'L'], category: 'jerseys' },
    { id: 12, name: 'Netherlands Orange Elite Kit 2025/26', price: 9999, discount: 7999, image: 'jersey4.jpg', sizes: ['M', 'L', 'XL'], category: 'jerseys' },
    { id: 13, name: 'Italy Blue Classic Kit 2025/26', price: 9500, discount: 7499, image: 'jersey1.jpg', sizes: ['S', 'M', 'L', 'XL'], category: 'jerseys' },
    { id: 14, name: 'Germany White Premium Kit 2025/26', price: 9999, discount: 6999, image: 'jersey2.jpg', sizes: ['M', 'L', 'XL'], category: 'jerseys' },
    { id: 15, name: 'Belgium Red Special Edition 2025/26', price: 9999, discount: 7999, image: 'jersey3.jpg', sizes: ['S', 'M', 'L'], category: 'jerseys' },
    // Shoes
    { id: 101, name: 'Nike Air Zoom Pegasus 2025', price: 12999, discount: 9999, image: 'shoes1.jpg', sizes: ['7', '8', '9', '10'], category: 'shoes' },
    { id: 102, name: 'Adidas Ultraboost 2025', price: 14999, discount: 11999, image: 'shoes2.jpg', sizes: ['8', '9', '10'], category: 'shoes' },
    { id: 103, name: 'Puma Velocity Nitro 2025', price: 11999, discount: 8999, image: 'shoes3.jpg', sizes: ['7', '8', '9'], category: 'shoes' },
    { id: 104, name: 'Asics Gel-Kayano 31', price: 15999, discount: 12999, image: 'shoes4.jpg', sizes: ['8', '9', '10'], category: 'shoes' },
    { id: 105, name: 'Under Armour HOVR Sonic 7', price: 13999, discount: 10999, image: 'shoes5.jpg', sizes: ['7', '8', '9', '10'], category: 'shoes' },
    // Watches
    { id: 201, name: 'Garmin Forerunner 965', price: 49999, discount: 44999, image: 'watch1.jpg', sizes: ['One Size'], category: 'watches' },
    { id: 202, name: 'Apple Watch Ultra 2', price: 89999, discount: 79999, image: 'watch2.jpg', sizes: ['One Size'], category: 'watches' },
    { id: 203, name: 'Samsung Galaxy Watch 7', price: 34999, discount: 29999, image: 'watch3.jpg', sizes: ['One Size'], category: 'watches' },
    { id: 204, name: 'Fitbit Versa 5', price: 24999, discount: 19999, image: 'watch4.jpg', sizes: ['One Size'], category: 'watches' },
  ];

  await Product.deleteMany({}); // Clear existing products
  await Product.insertMany(products);
  console.log('Products seeded');
  mongoose.connection.close();
}).catch(err => console.error('Error:', err));