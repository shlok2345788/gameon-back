const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

// GET /shop - Get all products
router.get('/shop', async (req, res) => {
  try {
    const products = await Product.find({ category: 'jersey' });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// GET /product/:id - Get single product
router.get('/product/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Error fetching product' });
  }
});

// GET /accessories - Get accessories
router.get('/accessories', async (req, res) => {
  try {
    const accessories = await Product.find({ category: { $in: ['shoes', 'watch'] } });
    res.json(accessories);
  } catch (error) {
    console.error('Error fetching accessories:', error);
    res.status(500).json({ message: 'Error fetching accessories' });
  }
});

// GET /products - Get all products (for admin)
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
});

module.exports = router;
