# My Store: E-Commerce Website (MEAN Stack)

An online clothing store built as a graduation project for the MEAN stack training (ITI).

The client used to take orders through Facebook Messages, and some orders were lost or forgotten. This website lets customers place orders by themselves, and gives the admins one dashboard to manage every order, product and customer.

> Payment is **Cash on Delivery** only. Colors, sizes, discounts, online payment and shipping-company integration are out of scope for this version (agreed with the client because of the project time).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Angular 22, Bootstrap 5, RxJS, jwt-decode |
| Backend | Node.js, Express 5 |
| Database | MongoDB Atlas, Mongoose |
| Auth | JWT, bcryptjs |
| File upload | multer (local `uploads/` folder) |
| Security | helmet, cors |

---

## Features

### Customer
- Browse products with **search, filters (category, subcategory, price), sorting and pagination**.
- Stock labels: `Only 1 left`, `Only 2 left`, `Only 3 left`, and `Out of Stock` (add-to-cart is disabled).
- **Guest cart** (saved in the browser). When the guest logs in, the cart is **merged** with the account cart.
- **Price change detection** in the cart (`Old price` / `New price`) with an **Accept new price** button. An order cannot be placed with an old price.
- Register with the minimum data (name, email, password). Mobile and address are requested only when ordering.
- Multiple **addresses** (add, update, delete, set default).
- **Checkout**: choose an address, confirm the mobile number, see the shipping cost by governorate.
- **My Orders**: list, details, and cancel while the order is still `pending`.
- **Testimonials**: stars (1 to 5) and text. They appear on the site only after admin approval.
- Dynamic **FAQ**, plus About Us, Contact Us and Policies pages.

### Admin
- **Dashboard counters**: new orders today, pending orders, out-of-stock products, testimonials waiting for review.
- **Products**: add, edit, image upload, activate / deactivate, soft delete.
- **Categories and subcategories**: add, rename, activate / deactivate, soft delete.
- **Orders**: filter by status, view details, change status (only allowed transitions).
- **Testimonials**: approve or reject.
- **FAQ**: add, edit, delete.
- **Shipping**: cost and availability per governorate (27 governorates).
- **Users**: search, block / unblock.
- **Admins**: any admin can create a new admin (all admins have the same permissions).

---

## Project Structure

```
E_commreceGraduation/
├── backend/
│   ├── src/
│   │   ├── config/        # database connection
│   │   ├── models/        # Mongoose schemas
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middlewares/   # auth, upload, error handling
│   │   ├── utils/         # AppError, catchAsync, token
│   │   ├── seeds/         # admin, shipping zones, demo data
│   │   ├── app.js
│   │   └── server.js
│   ├── uploads/           # product images (not committed)
│   └── .env               # not committed
└── frontend/
    └── src/app/
        ├── core/          # models, services, guards, interceptors
        ├── layout/        # customer pages
        ├── dashboard/     # admin pages
        └── shared/        # footer, not-found
```

---

## Getting Started

### Requirements
- Node.js (v20 LTS or newer)
- A MongoDB Atlas cluster (or any MongoDB connection string)
- Angular CLI: `npm install -g @angular/cli`

### 1) Backend

```bash
cd backend
npm install
```

Run the server:

```bash
npm run dev             # http://localhost:3000
```

Health check: `http://localhost:3000/api/health` should return `{"status":"ok"}`.

> Make sure only **one** backend server is running on the port. A second server on the same port makes requests fail with `Cannot POST ...`.

### 2) Frontend

```bash
cd frontend
npm install
ng serve
```

Open `http://localhost:4200`.

The API URL is configured in `frontend/src/environments/env.ts`.

### 3) Demo data (optional)

```bash
cd backend
npm run seed:demo
```

It creates 3 categories, 5 subcategories, 11 products (with different stock levels), 8 orders in different statuses, testimonials and FAQs.

- Register a normal customer account **before** running it, so the demo orders and testimonials are attached to that account.
- To show product images, put `demo-1.jpg` to `demo-10.jpg` inside `backend/uploads/` before running it.
- It **deletes** products, categories, orders, carts, testimonials and FAQs, then recreates them. Users and shipping zones are not touched.

### Test accounts

| Role | Email | Password |
|---|---|---|
| Admin | `admin@shop.com` | `Admin123456` |
| Customer | `ahmed@test.com` | `123456` |

(The customer account is created by registering from the website. Change the admin password before any real use.)

---

## Backend Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start with nodemon |
| `npm start` | Start with node |
| `npm run seed:admin` | Create the first admin |
| `npm run seed:shipping` | Create the 27 shipping zones |
| `npm run seed:demo` | Fill the database with demo data |

---

## API Overview

Base URL: `http://localhost:3000/api`

Responses look like `{ "success": true, "data": { ... } }`, and errors like `{ "success": false, "message": "..." }`.

Protected routes need the header `Authorization: Bearer <token>`.

### Auth
| Method | Path | Access |
|---|---|---|
| POST | `/auth/register` | Public |
| POST | `/auth/login` | Public |
| GET | `/auth/me` | User |
| PATCH | `/auth/me` | User (name, mobile) |

### Catalog
| Method | Path | Access |
|---|---|---|
| GET | `/categories` | Public (active only) |
| GET | `/categories/admin/all` | Admin |
| POST, PATCH `/:id`, DELETE `/:id` | `/categories` | Admin |
| GET | `/subcategories?categoryId=` | Public (active only) |
| GET | `/subcategories/admin/all` | Admin |
| POST, PATCH `/:id`, DELETE `/:id` | `/subcategories` | Admin |
| GET | `/products?search=&categoryId=&subcategoryId=&minPrice=&maxPrice=&sort=&page=&limit=` | Public |
| GET | `/products/:slug` | Public |
| GET | `/products/admin/all`, `/products/admin/:id` | Admin |
| POST | `/products` (multipart/form-data) | Admin |
| PATCH | `/products/:id` (multipart/form-data) | Admin |
| PATCH | `/products/:id/toggle-active` | Admin |
| DELETE | `/products/:id` (soft delete) | Admin |

### Cart
| Method | Path | Access |
|---|---|---|
| POST | `/cart/validate` | Public (guest cart prices and stock) |
| GET | `/cart` | User |
| POST | `/cart/items` | User |
| PATCH | `/cart/items/:productId` | User (set quantity) |
| PATCH | `/cart/items/:productId/accept-price` | User |
| DELETE | `/cart/items/:productId` | User |
| DELETE | `/cart` | User (clear) |
| POST | `/cart/merge` | User (merge the guest cart after login) |

### Addresses and Shipping
| Method | Path | Access |
|---|---|---|
| GET, POST | `/addresses` | User |
| PATCH, DELETE | `/addresses/:id` | User |
| PATCH | `/addresses/:id/default` | User |
| GET | `/shipping-zones` | Public |
| PATCH | `/shipping-zones/:id` | Admin |

### Orders
| Method | Path | Access |
|---|---|---|
| POST | `/orders` | User |
| GET | `/orders/my?page=&limit=` | User |
| GET | `/orders/my/:id` | User (own orders only) |
| PATCH | `/orders/my/:id/cancel` | User (only while `pending`) |
| GET | `/orders?status=&page=&limit=` | Admin |
| PATCH | `/orders/:id/status` | Admin |

### Testimonials and FAQ
| Method | Path | Access |
|---|---|---|
| GET | `/testimonials` | Public (approved only) |
| POST | `/testimonials` | User |
| GET | `/testimonials/admin/all?status=` | Admin |
| PATCH | `/testimonials/:id/status` | Admin |
| GET | `/faqs` | Public |
| POST, PATCH `/:id`, DELETE `/:id` | `/faqs` | Admin |

### Admin
| Method | Path | Access |
|---|---|---|
| GET | `/admin/stats` | Admin |
| POST | `/admin/admins` | Admin |
| GET | `/admin/users?search=&page=` | Admin |
| PATCH | `/admin/users/:id/block` | Admin |

---

## Business Rules (Important Design Decisions)

- **Login is required to place an order**, but a guest can add to the cart. The guest cart is merged into the account cart after login.
- **Stock is checked again when the order is created**, using an atomic update (`findOneAndUpdate` with `stock >= quantity` and `$inc`). If two customers buy the last item at the same time, only one succeeds. If one product in the order fails, the stock already deducted is restored.
- **The price is read from the database** at order time, never from the client. If a cart item has an old price, the order is rejected until the customer accepts the new price.
- **Snapshots**: each order stores the address, the mobile number, and the item prices as they were at order time, so later changes do not affect old orders.
- **Soft delete** (`isDeleted`) for products, categories and subcategories, so old orders keep their history. FAQ items are hard deleted.
- **Shipping** is calculated by the governorate of the selected address. If shipping is disabled for that governorate, the order is blocked.
- **Order status flow**:

| From | Allowed next statuses |
|---|---|
| `pending` | `preparing`, `cancelled by admin`, `rejected` |
| `preparing` | `shipped`, `cancelled by admin` |
| `shipped` | `delivered` |
| `delivered` | `received`, `refunded` |
| `received` | `refunded` |

`cancelled by client` is available to the customer while the order is `pending`. Cancelled and rejected orders **restore the stock**. Final statuses cannot be changed.

- **Security**: passwords are hashed with bcrypt, the role can never be set from the register request, blocked users lose access immediately (checked on every request), customers can only see their own orders, and admin routes are protected on the server (not only by the frontend guards).

---

## Known Limitations and Future Work

- No automated tests yet (the API and the UI were tested manually).
- Stock deduction and order creation are not inside one database transaction (they are compensated manually). MongoDB transactions would make it safer.
- No rate limiting on login.
- Images are stored on the server disk. For deployment, move to Cloudinary or similar (the `image` field stays the same).
- The user name in the header is read from the token, so it updates after the next login.
- Out of scope (agreed with the client): online payment, shipping-company integration, colors and sizes, discounts, admin roles and permissions.

---

## Author

Graduation project, MEAN Stack training.
