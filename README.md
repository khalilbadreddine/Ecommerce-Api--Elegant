# 🛍️ Elegant E-Commerce API

A robust and scalable RESTful API built with Node.js and Express.js to power the Elegant E-Commerce platform.

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

## 📑 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [Database Schema](#database-schema)
- [Error Handling](#error-handling)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- 🔐 JWT Authentication & Authorization
- 👤 User Management
- 🛒 Shopping Cart Operations
- 💝 Wishlist Management
- 📦 Product Management
- 🔍 Advanced Product Search & Filtering
- 📝 Order Processing
- 💳 Payment Integration
- 📧 Email Notifications
- 🔄 Real-time Stock Updates

## 🛠️ Tech Stack

- **Runtime Environment:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** Bcrypt
- **Input Validation:** Express-validator
- **File Upload:** Multer
- **Email Service:** Nodemailer
- **Payment Processing:** Stripe
- **Documentation:** Swagger/OpenAPI

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn
- Git

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/elegant-api.git
cd elegant-api
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env
\`\`\`

4. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

### Environment Variables

Create a \`.env\` file in the root directory with the following variables:

\`\`\`env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret
EMAIL_SERVICE=your_email_service
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
\`\`\`

## 📚 API Documentation

### Base URL
\`\`\`
http://localhost:5000/api/v1
\`\`\`

### Main Endpoints

#### Authentication
- POST /auth/register - Register new user
- POST /auth/login - User login
- POST /auth/forgot-password - Password reset request
- PUT /auth/reset-password - Reset password

#### Users
- GET /users/profile - Get user profile
- PUT /users/profile - Update user profile
- DELETE /users/profile - Delete user account

#### Products
- GET /products - Get all products
- GET /products/:id - Get single product
- POST /products - Create product (Admin)
- PUT /products/:id - Update product (Admin)
- DELETE /products/:id - Delete product (Admin)

#### Cart
- GET /cart - Get user's cart
- POST /cart - Add item to cart
- PUT /cart/:itemId - Update cart item
- DELETE /cart/:itemId - Remove item from cart

#### Wishlist
- GET /wishlist - Get user's wishlist
- POST /wishlist - Add item to wishlist
- DELETE /wishlist/:itemId - Remove item from wishlist

#### Orders
- GET /orders - Get user's orders
- POST /orders - Create new order
- GET /orders/:id - Get order details

## 🔒 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

\`\`\`
Authorization: Bearer <your_jwt_token>
\`\`\`

## 🗄️ Database Schema

### User Schema
\`\`\`javascript
{
  name: String,
  email: String,
  password: String,
  role: String,
  cart: [CartItem],
  wishlist: [WishlistItem],
  orders: [Order]
}
\`\`\`

### Product Schema
\`\`\`javascript
{
  title: String,
  description: String,
  price: Number,
  images: [String],
  category: String,
  stock: Number,
  ratings: [Rating]
}
\`\`\`

## ❌ Error Handling

The API uses consistent error response format:

\`\`\`javascript
{
  status: "error",
  code: 404,
  message: "Resource not found",
  details: {}
}
\`\`\`

## 🧪 Testing

Run tests using:

\`\`\`bash
npm test
\`\`\`

## 🌐 Deployment

1. Build the project:
\`\`\`bash
npm run build
\`\`\`

2. Start production server:
\`\`\`bash
npm start
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support

For support, email support@elegant.com or join our Slack channel.

## 🙏 Acknowledgments

- Express.js Documentation
- MongoDB Documentation
- Node.js Best Practices
