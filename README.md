# Scentora – Smart Multi-Vendor Online Fragrance Marketplace

Full-stack MERN (MongoDB, Express, React, Node.js) multi-vendor e-commerce marketplace for fragrances and body mists.

## Features

- **Roles**: Admin, Seller, Customer
- **Auth**: JWT-based register/login, role-based access
- **Products**: CRUD with categories (Men/Women), subcategories (Perfumes/Body Mists), fragrance types, image upload (Multer)
- **Cart & Checkout**: Add to cart, update quantity, checkout with shipping address
- **Orders**: Create order, view order history, seller/admin order status updates (Pending → Packed → Shipped → Delivered)
- **Admin**: Approve sellers, view analytics (users, sellers, products, orders, revenue)
- **Seller**: Add/edit/delete products, view orders containing their items, update order status, revenue view

## Tech Stack

- **Frontend**: React 18, Redux Toolkit, React Router, Tailwind CSS, Axios, Vite
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT, bcrypt, Multer

## Setup

### 1. Backend

```bash
cd backend
cp .env.example .env
# Edit .env: set MONGODB_URI, JWT_SECRET, PORT, CLIENT_URL
npm install
npm run seed    # optional: create admin user (admin@scentora.com / admin123) and categories
npm run dev     # runs on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev     # runs on http://localhost:5173
```

### 3. Environment

**backend/.env**

- `PORT=5000`
- `MONGODB_URI=mongodb://localhost:27017/scentora` (or MongoDB Atlas URI)
- `JWT_SECRET=your-secret-key`
- `JWT_EXPIRE=7d`
- `CLIENT_URL=http://localhost:5173`

## API Overview

- **Auth**: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/profile`
- **Products**: `GET/POST /api/products`, `GET/PUT/DELETE /api/products/:id`, `GET /api/products/my` (seller)
- **Categories**: `GET /api/categories`, `POST/PUT/DELETE` (admin)
- **Cart**: `GET/POST /api/cart`, `PUT /api/cart/:itemId`, `DELETE /api/cart/:itemId` (customer)
- **Orders**: `POST /api/orders`, `GET /api/orders/my`, `GET /api/orders/seller`, `GET /api/orders/:id`, `PUT /api/orders/:id/status`
- **Admin**: `GET /api/admin/sellers/pending`, `PUT /api/admin/sellers/:id/approve`, `GET /api/admin/users`, `GET /api/admin/analytics`, `GET /api/admin/orders`

## Project Structure

```
frontend/
  src/
    components/   # Layout, Header, Footer
    pages/       # Home, Products, ProductDetail, Cart, Checkout, Login, Register, dashboards, seller form
    redux/       # store, slices (auth, products, cart, categories, orders)
    services/    # api.js (axios + auth/cart/orders/products/admin)
    utils/       # constants (categories, fragrance types, order statuses)
backend/
  controllers/
  models/        # User, Product, Order, Category, Cart
  routes/
  middleware/    # auth (protect, authorize)
  utils/         # upload (multer)
  uploads/       # product images
```

## Security

- Passwords hashed with bcrypt
- Private routes protected by JWT
- Role checks (Admin, Seller, Customer) on sensitive endpoints
- `.env` for secrets; no secrets in repo

## Deployment

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for step-by-step instructions (MongoDB Atlas + Render + Vercel).  
Quick summary: deploy **backend** to Render, **frontend** to Vercel, **database** on MongoDB Atlas; set `VITE_API_BASE_URL` (frontend) and `CLIENT_URL` (backend) to your live URLs.
