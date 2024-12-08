// Load environment variables if necessary
require('dotenv').config();

// Import dependencies
const mongoose = require('mongoose');
const Product = require('./models/Product'); // Adjust the path if necessary
const mockProducts = require('./mockProducts'); // Adjust the path to the mockProducts file

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB connected successfully');
    seedProducts();
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  });

// Function to seed products into the database
const seedProducts = async () => {
  try {
    // Delete existing products to avoid duplicates
    await Product.deleteMany();

    // Transform category names to ObjectIds if your schema requires it
    const transformedProducts = mockProducts.map((product) => ({
      ...product,
      category: new mongoose.Types.ObjectId(), // Replace with actual category IDs if available
    }));

    // Insert mock products into the database
    await Product.insertMany(transformedProducts);

    console.log('Mock products added successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding products:', error.message);
    process.exit(1);
  }
};
