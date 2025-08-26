const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());

// CORS configuration for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://gameson.vercel.app',
        'https://gameson-git-main-shlok2345788.vercel.app',
        'https://gameson-shlok2345788.vercel.app',
        'https://gameon-website.vercel.app',
        'https://game-frotend-phi.vercel.app'
      ] 
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Product Schema
const productSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, required: true },
  image: { type: String },
  sizes: [{ type: String, required: true }],
  category: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Product = mongoose.model('Product', productSchema);

// Order Schema (simplified for guest checkout)
const orderSchema = new mongoose.Schema({
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    name: { type: String, required: true },
    size: { type: String, required: true }
  }],
  total: { type: Number, required: true },
  shippingAddress: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  paymentAmount: { type: Number, required: true },
  paymentScreenshot: { type: String, required: false },
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model('Order', orderSchema);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verify email configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email configuration error:', error);
  } else {
    console.log('✅ Email server is ready to send messages');
  }
});

// API Routes

// Get all jerseys
app.get('/api/shop', async (req, res) => {
  try {
    const products = await Product.find({ category: 'jersey' });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// Get all products (for admin)
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// Get single product
app.get('/api/product/:id', async (req, res) => {
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

// Get accessories
app.get('/api/accessories', async (req, res) => {
  try {
    const accessories = await Product.find({ category: { $in: ['shoes', 'watch'] } });
    res.json(accessories);
  } catch (error) {
    console.error('Error fetching accessories:', error);
    res.status(500).json({ message: 'Error fetching accessories' });
  }
});

// Create order (guest checkout)
app.post('/api/orders', upload.single('paymentScreenshot'), async (req, res) => {
  try {
    const { items, total, shippingAddress, paymentAmount } = req.body;
    
    const order = new Order({
      items: JSON.parse(items),
      total: Number(total),
      shippingAddress: JSON.parse(shippingAddress),
      paymentAmount: Number(paymentAmount),
      paymentScreenshot: req.file ? req.file.filename : null,
    });

    await order.save();
    res.status(201).json({ message: 'Order placed successfully', orderId: order._id });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error placing order', error: error.message });
  }
});

// Get orders (for admin or order tracking)
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().populate('items.productId').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// Update order status (for admin)
app.put('/api/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order status updated successfully', order });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Error updating order status' });
  }
});

// Add product (for admin)
app.post('/api/products', upload.single('image'), async (req, res) => {
  try {
    const { name, price, discount, category, sizes } = req.body;
    
    // Auto-generate unique id
    const lastProduct = await Product.findOne().sort({ id: -1 });
    const nextId = lastProduct ? lastProduct.id + 1 : 1;
    
    const product = new Product({
      id: nextId,
      name,
      price: Number(price),
      discount: Number(discount),
      category,
      sizes: sizes.split(',').map(s => s.trim()),
      image: req.file ? req.file.filename : undefined,
    });
    
    await product.save();
    res.status(201).json({ message: 'Product added successfully', product });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Error adding product', error: error.message });
  }
});

// Send OTP email endpoint
app.post('/api/send-email-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    const mailOptions = {
      from: {
        name: 'GameOn Store',
        address: process.env.EMAIL_USER
      },
      to: email,
      subject: '🏆 GameOn - Email Verification OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f0f0f; color: #fff; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%); padding: 30px; text-align: center; border-bottom: 2px solid #4ade80;">
            <h1 style="color: #4ade80; margin: 0; font-size: 2rem; text-shadow: 0 0 10px rgba(74, 222, 128, 0.3);">
              🏆 GameOn Store
            </h1>
            <p style="color: #aaa; margin: 10px 0 0 0; font-size: 1.1rem;">Your Sports Equipment Destination</p>
          </div>
          
          <div style="padding: 30px;">
            <h2 style="color: #4ade80; margin-bottom: 20px;">Email Verification Required</h2>
            <p style="color: #ccc; font-size: 1.1rem; line-height: 1.6; margin-bottom: 25px;">
              Thank you for choosing GameOn! To complete your order, please verify your email address using the OTP below:
            </p>
            
            <div style="background: #1a1a1a; border: 2px solid #4ade80; border-radius: 12px; padding: 25px; text-align: center; margin: 25px 0;">
              <p style="color: #aaa; margin: 0 0 10px 0; font-size: 0.9rem;">Your Verification Code:</p>
              <h1 style="color: #4ade80; font-size: 2.5rem; margin: 0; letter-spacing: 8px; font-weight: bold; text-shadow: 0 0 10px rgba(74, 222, 128, 0.3);">
                ${otp}
              </h1>
            </div>
            
            <div style="background: #1a1a1a; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0;">
              <p style="color: #fbbf24; margin: 0; font-size: 0.9rem;">
                ⚠️ <strong>Important:</strong> This OTP is valid for 10 minutes only. Do not share this code with anyone.
              </p>
            </div>
            
            <p style="color: #aaa; font-size: 0.9rem; line-height: 1.5; margin-top: 25px;">
              If you didn't request this verification, please ignore this email. Your account security is important to us.
            </p>
          </div>
          
          <div style="background: #1a1a1a; padding: 20px; text-align: center; border-top: 1px solid #333;">
            <p style="color: #666; margin: 0; font-size: 0.8rem;">
              © 2024 GameOn Store. All rights reserved.<br>
              Your trusted partner for premium sports equipment.
            </p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    
    console.log(`✅ OTP email sent successfully to: ${email}`);
    res.status(200).json({ 
      message: 'OTP sent successfully',
      email: email
    });

  } catch (error) {
    console.error('❌ Error sending OTP email:', error);
    res.status(500).json({ 
      message: 'Failed to send OTP email',
      error: error.message 
    });
  }
});

// Root API endpoint
app.get('/api', (req, res) => {
  res.json({ 
    message: 'GameOn API is running!',
    endpoints: [
      '/api/shop',
      '/api/products', 
      '/api/product/:id',
      '/api/accessories',
      '/api/orders',
      '/api/health'
    ]
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'GameOn Backend is running!' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 GameOn Backend server is running on port ${PORT}`);
});

module.exports = app