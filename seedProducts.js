const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const sampleJerseys = [
  { id: 1, name: "Manchester United Home Jersey 2024", price: 2500, discount: 10, image: "jersey1.jpg", sizes: ["S","M","L","XL","XXL"], category: "jersey" },
  { id: 2, name: "Real Madrid Away Jersey 2024", price: 2800, discount: 15, image: "jersey2.jpg", sizes: ["S","M","L","XL","XXL"], category: "jersey" },
  { id: 3, name: "Barcelona Home Jersey 2024", price: 2600, discount: 12, image: "jersey3.jpg", sizes: ["S","M","L","XL","XXL"], category: "jersey" },
  { id: 4, name: "Liverpool FC Home Jersey 2024", price: 2400, discount: 8,  image: "jersey4.jpg", sizes: ["S","M","L","XL","XXL"], category: "jersey" },
];

const sampleAccessories = [
  { id: 101, name: "Nike Football Boots", price: 4500, discount: 25, image: "shoes1.jpg", sizes: ["6","7","8","9","10","11","12"], category: "shoes" },
  { id: 102, name: "Adidas Predator Boots", price: 5200, discount: 18, image: "shoes2.jpg", sizes: ["6","7","8","9","10","11","12"], category: "shoes" },
  { id: 103, name: "Puma Future Boots", price: 3800, discount: 20, image: "shoes3.jpg", sizes: ["6","7","8","9","10","11","12"], category: "shoes" },
  { id: 104, name: "Sports Watch - Digital", price: 1800, discount: 30, image: "watch1.jpg", sizes: ["One Size"], category: "watch" },
  { id: 105, name: "Fitness Tracker Watch", price: 3200, discount: 22, image: "watch2.jpg", sizes: ["One Size"], category: "watch" },
];

async function seedProducts() {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      console.error('MONGO_URI is not set.');
      process.exit(1);
    }

    await mongoose.connect(uri);
    console.log('Connected to MongoDB for seeding');

    await Product.deleteMany({});
    console.log('Cleared existing products');

    await Product.insertMany(sampleJerseys);
    console.log('Added sample jerseys');

    await Product.insertMany(sampleAccessories);
    console.log('Added sample accessories');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedProducts();