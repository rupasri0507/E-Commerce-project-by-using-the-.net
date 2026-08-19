# DevStore — Full-Stack E-Commerce Web Application

A clean, production-grade, full-stack e-commerce application built with **ASP.NET Core .NET 8 Web API**, **Entity Framework Core (SQLite / SQL Server)**, and **React 18 (Vite)**. Created as a self-directed project to demonstrate modern .NET/C# backend architecture and responsive React frontend development.

---

## 🌐 Live Deployments

| Component | Platform | Live URL |
|---|---|---|
| **Frontend Web App** | Vercel | [https://e-commerce-lilac-three-17.vercel.app](https://e-commerce-lilac-three-17.vercel.app) |
| **Backend Web API** | Render | [https://ecommerce-api-kbqb.onrender.com](https://ecommerce-api-kbqb.onrender.com) |
| **Swagger / OpenAPI UI** | Render | [https://ecommerce-api-kbqb.onrender.com/swagger](https://ecommerce-api-kbqb.onrender.com/swagger) |
| **API Health Check** | Render | [https://ecommerce-api-kbqb.onrender.com/api/health](https://ecommerce-api-kbqb.onrender.com/api/health) |
| **Source Code** | GitHub | [rupasri0507/E-Commerce-project-by-using-the-.net](https://github.com/rupasri0507/E-Commerce-project-by-using-the-.net) |

---

## 🛠️ Tech Stack

### Backend
- **Framework:** ASP.NET Core Web API (.NET 8, C#)
- **Database & ORM:** Entity Framework Core 8 (Code-First with Migrations)
- **Databases:** SQLite (local development & container) / SQL Server (enterprise ready)
- **Security:** `BCrypt.Net-Next` for password hashing with cryptographic salts
- **Documentation:** Swagger / OpenAPI UI via Swashbuckle
- **Deployment:** Multi-stage Docker container deployed on Render

### Frontend
- **Framework:** React 18 + Vite
- **Styling:** Vanilla CSS (Custom Design System with Dark Theme & Glassmorphism)
- **State Management:** React Context API (`CartContext`, `AuthContext`) with LocalStorage persistence
- **Icons:** `lucide-react`
- **HTTP Client:** Centralized `fetch` API Client with error normalization
- **Deployment:** Vercel SPA deployment with automated rewrite rules

---

## 📁 Repository Structure

```
/
├── backend/                         # ASP.NET Core Web API (.NET 8)
│   ├── Controllers/
│   │   ├── ProductsController.cs    # GET all, GET by ID, POST, PUT, DELETE
│   │   ├── UsersController.cs       # Register (BCrypt), Login, GetById
│   │   └── OrdersController.cs      # Create order, get by user/ID
│   ├── Data/
│   │   ├── AppDbContext.cs          # EF Core DbContext with Fluent API mappings
│   │   └── DbInitializer.cs        # Seeds 8 products & demo customer
│   ├── DTOs/
│   │   ├── ProductDtos.cs           # Request/response DTOs for products
│   │   ├── UserDtos.cs              # User registration/login DTOs
│   │   └── OrderDtos.cs             # Checkout payload and order response DTOs
│   ├── Migrations/                  # EF Core code-first migration files
│   ├── Models/
│   │   ├── Product.cs               # Product entity model
│   │   ├── User.cs                  # User entity model
│   │   ├── Order.cs                 # Purchase order entity model
│   │   └── OrderItem.cs             # Line item junction model
│   ├── Dockerfile                   # Multi-stage container build for Render
│   ├── appsettings.json            # Database connection strings & CORS config
│   ├── Program.cs                  # DI, CORS, Swagger, Database seeder
│   └── Backend.csproj
├── frontend/                        # React 18 + Vite SPA
│   ├── src/
│   │   ├── api/apiClient.js        # Centralized HTTP API client
│   │   ├── context/
│   │   │   ├── AuthContext.jsx     # Global authentication state
│   │   │   └── CartContext.jsx     # Global shopping cart & toast queue
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Sticky glassmorphic navbar with search & cart badge
│   │   │   ├── Footer.jsx           # Tech stack summary footer
│   │   │   ├── ProductCard.jsx      # Product grid card with stock indicators
│   │   │   ├── Toast.jsx            # Dynamic alert notifications
│   │   │   └── LoadingSpinner.jsx   # Animated loading state
│   │   ├── pages/
│   │   │   ├── ProductListPage.jsx  # Hero banner, catalog grid & sorting
│   │   │   ├── ProductDetailPage.jsx# Product specs, gallery & quantity selector
│   │   │   ├── CartPage.jsx         # Cart items table & live summary breakdown
│   │   │   ├── CheckoutPage.jsx     # Checkout form & order submission
│   │   │   ├── OrderConfirmationPage.jsx # Visual receipt with order ID
│   │   │   ├── OrdersHistoryPage.jsx# Customer order records
│   │   │   └── AuthModal.jsx        # Login & registration modal with quick demo autofill
│   │   ├── App.jsx                 # View state management & layout
│   │   ├── main.jsx                # React DOM entry point
│   │   └── index.css               # Complete stylesheet and CSS custom properties
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── vercel.json                      # Vercel configuration for SPA routing & build
├── .gitignore
└── README.md
```

---

## 💻 Running Locally

### Prerequisites
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js (v18+)](https://nodejs.org/) and npm

### 1. Run the Backend API
```bash
cd backend
dotnet run --urls "http://localhost:5000"
```
The API will:
- Auto-initialize the database (`ecommerce.db`)
- Seed 8 sample tech products and 1 demo user
- Serve the API at `http://localhost:5000`
- Serve Swagger UI at `http://localhost:5000/swagger`

### 2. Run the React Frontend
In a separate terminal:
```bash
cd frontend
npm install
npm run dev
```
Open **`http://localhost:5173`** in your browser.

---

## 📡 API Endpoints Reference

| Method | Endpoint | Description | Status Codes |
|---|---|---|---|
| `GET` | `/api/products` | Retrieve catalog products (with optional `?search=` filter) | `200 OK` |
| `GET` | `/api/products/{id}` | Retrieve single product details | `200 OK`, `404 Not Found` |
| `POST` | `/api/products` | Create a new catalog product | `201 Created`, `400 Bad Request` |
| `PUT` | `/api/products/{id}` | Update product details | `200 OK`, `400 Bad Request`, `404 Not Found` |
| `DELETE` | `/api/products/{id}` | Delete product from catalog | `200 OK`, `404 Not Found` |
| `POST` | `/api/users/register` | Register customer account with BCrypt password hashing | `201 Created`, `400 Bad Request` |
| `POST` | `/api/users/login` | Authenticate customer with email and password | `200 OK`, `401 Unauthorized` |
| `GET` | `/api/users/{id}` | Retrieve user profile (excluding password hash) | `200 OK`, `404 Not Found` |
| `POST` | `/api/orders` | Create order, validate stock, compute server-side totals | `201 Created`, `400 Bad Request` |
| `GET` | `/api/orders/{id}` | Retrieve order details with line items | `200 OK`, `404 Not Found` |
| `GET` | `/api/orders/user/{userId}` | Retrieve all order history for a customer | `200 OK` |
| `GET` | `/api/health` | Service health status | `200 OK` |

---

## 🔒 Security & Data Integrity Highlights

1. **Server-Side Price & Total Calculation:** The frontend never sends price or total sums to the Orders API. Total amount is calculated exclusively on the backend by querying active product records from the database.
2. **Atomic Order Transactions:** Inserting the `Order` and all child `OrderItem` entities happens within a single `SaveChangesAsync()` call, ensuring all items and stock deductions succeed or rollback together.
3. **Password Security:** Passwords are never stored in plaintext. `BCrypt.Net-Next` generates salted, computationally expensive hashes to protect against rainbow table and brute-force attacks.
4. **Data Transfer Objects (DTOs):** Prevent over-posting attacks and prevent sensitive entity fields (like `PasswordHash`) from leaking to the client.
5. **CORS Whitelisting:** Configured in `Program.cs` to allow communication from `http://localhost:5173` and `https://e-commerce-lilac-three-17.vercel.app`.

---

## 👤 Demo Credentials

For quick testing or presentation:
- **Email:** `alex.morgan@example.com`
- **Password:** `password123`

*(You can also use the **"Quick-fill Demo Account"** button inside the Sign In modal on the frontend).*

---

## 🎓 Learning Goals & Technical Competencies

This project was built to practice:
- Designing modular, scalable ASP.NET Core Web APIs using the minimal hosting model in .NET 8.
- Utilizing Entity Framework Core code-first migrations, Fluent API relationships, and asynchronous querying.
- Building stateful React single-page applications with clean separation between UI components, context providers, and centralized API clients.
- Containerizing .NET applications with Docker and deploying modern multi-cloud architectures (Render + Vercel).
