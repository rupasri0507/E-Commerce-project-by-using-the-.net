# DevStore — Full-Stack E-Commerce Web Application

A clean, interview-ready full-stack e-commerce application built with **ASP.NET Core .NET 8 Web API**, **Entity Framework Core (SQLite/SQL Server)**, and **React + Vite**. Created as a self-directed learning project to demonstrate production-grade .NET/C# and React skills.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend API | ASP.NET Core Web API (.NET 8, C#) |
| ORM / Database | Entity Framework Core 8, SQLite (dev) / SQL Server (prod) |
| Password Security | BCrypt.Net-Next |
| API Docs | Swagger / OpenAPI (Swashbuckle) |
| Frontend | React 18 + Vite |
| Styling | Vanilla CSS (custom design system) |
| HTTP Client | Native `fetch` API |
| State | React Context API (Cart + Auth) |

---

## Project Structure

```
/
├── backend/                         # ASP.NET Core Web API
│   ├── Controllers/
│   │   ├── ProductsController.cs    # CRUD for products
│   │   ├── UsersController.cs       # Register, Login, GetById
│   │   └── OrdersController.cs      # Create order, get by user/id
│   ├── Data/
│   │   ├── AppDbContext.cs          # EF Core DbContext
│   │   └── DbInitializer.cs        # Database seeder (8 products)
│   ├── DTOs/
│   │   ├── ProductDtos.cs
│   │   ├── UserDtos.cs
│   │   └── OrderDtos.cs
│   ├── Migrations/                  # EF Core code-first migrations
│   ├── Models/
│   │   ├── Product.cs
│   │   ├── User.cs
│   │   ├── Order.cs
│   │   └── OrderItem.cs
│   ├── appsettings.json            # Connection strings & config
│   ├── Program.cs                  # DI, CORS, Swagger, startup
│   └── Backend.csproj
├── frontend/                        # React + Vite SPA
│   ├── src/
│   │   ├── api/apiClient.js        # Centralized fetch API client
│   │   ├── context/
│   │   │   ├── AuthContext.jsx     # Login/register/logout state
│   │   │   └── CartContext.jsx     # Cart items, totals, toasts
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── Toast.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   ├── pages/
│   │   │   ├── ProductListPage.jsx
│   │   │   ├── ProductDetailPage.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── CheckoutPage.jsx
│   │   │   ├── OrderConfirmationPage.jsx
│   │   │   ├── OrdersHistoryPage.jsx
│   │   │   └── AuthModal.jsx
│   │   ├── App.jsx                 # Page routing & layout
│   │   ├── main.jsx                # React entry point
│   │   └── index.css               # Complete design system CSS
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

---

## How to Run Locally

### Prerequisites
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 18+](https://nodejs.org/) and npm

### 1. Run the Backend API

```bash
cd backend
dotnet run --urls "http://localhost:5000"
```

The API will:
- Create the SQLite database (`ecommerce.db`) automatically on first run
- Seed 8 sample products and 1 demo user
- Serve Swagger UI at **http://localhost:5000/swagger**

### 2. Run the Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at **http://localhost:5173**

---

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/products` | List all products (optional `?search=`) |
| GET | `/api/products/{id}` | Get product by ID |
| POST | `/api/products` | Create product |
| PUT | `/api/products/{id}` | Update product |
| DELETE | `/api/products/{id}` | Delete product |
| POST | `/api/users/register` | Register new user (BCrypt hashed) |
| POST | `/api/users/login` | Authenticate user |
| GET | `/api/users/{id}` | Get user by ID |
| POST | `/api/orders` | Create order (validates stock, calculates total) |
| GET | `/api/orders/{id}` | Get order by ID with items |
| GET | `/api/orders/user/{userId}` | Get all orders for a user |
| GET | `/api/health` | API health check |

---

## Database Configuration

The app defaults to **SQLite** for zero-setup local development.

To switch to **SQL Server**, update `appsettings.json`:
```json
{
  "DatabaseProvider": "SqlServer",
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER;Database=EcommerceDb;Trusted_Connection=True;"
  }
}
```

Then run EF Core migrations:
```bash
dotnet ef migrations add InitialCreate --project backend/Backend.csproj
dotnet ef database update --project backend/Backend.csproj
```

---

## Demo Account

A seed user is created automatically:
- **Email:** `alex.morgan@example.com`
- **Password:** `password123`

---

## Learning Notes

This was a self-directed project to apply and demonstrate:
- **C# & .NET 8** — Controllers, dependency injection, middleware pipeline
- **Entity Framework Core** — Code-first models, migrations, DbContext, relationships, seeding
- **RESTful API Design** — Proper HTTP verbs, status codes (200/201/400/404/500), DTO pattern
- **React** — Functional components, Context API, hooks (useState, useEffect)
- **Full-stack data flow** — React `fetch` → ASP.NET Core → EF Core → SQLite/SQL Server
