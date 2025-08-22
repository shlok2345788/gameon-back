const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/gameon')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Order Schema (same as in server.js)
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

// Product Schema (same as in server.js)
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

async function createTestOrder() {
  try {
    // Get the first product from the database
    const product = await Product.findOne();
    if (!product) {
      console.log('No products found. Please run seedProducts.js first.');
      process.exit(1);
    }

    console.log('Found product:', product.name);

    // Calculate discounted price
    const discountedPrice = Math.round(product.price * (1 - product.discount / 100));

    // Create a test order
    const testOrder = new Order({
      items: [{
        productId: product._id,
        quantity: 2,
        price: discountedPrice,
        name: product.name,
        size: 'L'
      }],
      total: discountedPrice * 2,
      shippingAddress: {
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        mobile: '9876543210',
        address: '123 Main Street, Apartment 4B',
        city: 'Mumbai',
        postalCode: '400001',
        country: 'India'
      },
      paymentAmount: discountedPrice * 2,
      status: 'Pending'
    });

    await testOrder.save();
    console.log('Test order created successfully!');
    console.log('Order ID:', testOrder._id);
    console.log('Total amount:', testOrder.total);
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating test order:', error);
    process.exit(1);
  }
}

createTestOrder();