# Auction System

A full-stack auction management platform for product-based companies, built with **ASP.NET Core Web API** and **React**. This project supports real-time bidding, role-based dashboards, and full CRUD management for auctions, products, users, and branches.

---

## 🚀 Project Overview

This system allows:
- **Admins** to manage users, branches, and view system stats
- **Staff** to manage products and auctions
- **Customers** to view and bid on live auctions
- Real-time bid validation and live time display for all users

---

## ✨ Features

- **User Authentication** (mock, role-based)
- **CRUD for Auctions, Products, Users, Branches**
- **Live Bidding** with validation (must be higher than base price/highest bid)
- **Role-based Dashboards** (Admin, Staff, Customer)
- **Modern UI** with responsive design and modals
- **Delete Management** for all entities
- **Live Current Time Bar** (shows app/server time and time zone)
- **Time Zone Awareness** for auction start/end
- **Error Handling** and user feedback
- **API built with Entity Framework Core**

---

## 🗂️ Project Structure

```
auction/
├── AuctionApi/                 # Backend API (.NET 9)
│   ├── Controllers/           # API Controllers
│   ├── Data/                 # Database context
│   ├── Models/               # Entity models
│   ├── Migrations/           # Database migrations
│   └── Program.cs            # Application entry point
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── pages/           # Dashboard components
│   │   ├── services/        # API service
│   │   └── App.jsx          # Main app component
│   └── package.json
└── README.md
```

---

## ⚙️ Setup Instructions

### 1. **Backend (API) Setup**

- **Install .NET 9 SDK**: [Download here](https://dotnet.microsoft.com/download)
- **Install SQL Server** (Express or higher)

**Clone the repo and setup:**
```bash
cd AuctionApi
# Restore packages
 dotnet restore
# Add EF Core tools if needed
 dotnet tool install --global dotnet-ef
# Update the connection string in appsettings.json
# Run migrations and update the database
 dotnet ef database update
# Run the API
 dotnet run
```

The API will be available at `http://localhost:5098` (see terminal output).

### 2. **Frontend (React) Setup**

- **Install Node.js 18+ and npm**

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`

---

## 🛠️ Important Commands

### **Backend (dotnet/EF Core)**
- `dotnet restore` — Restore NuGet packages
- `dotnet build` — Build the API.
- `dotnet run` — Run the API.
- `dotnet ef migrations add <Name>` — Add a new migration
- `dotnet ef database update` — Apply migrations to the database
- `dotnet ef migrations list` — List all migrations
- `dotnet ef migrations remove` — Remove last migration

### **Frontend (npm/Vite)**
- `npm install` — Install dependencies
- `npm run dev` — Start the dev server
- `npm run build` — Build for production
- `npm run lint` — Lint the code

---

## 👤 Usage Instructions

### **Login Credentials (Mock Auth)**
- **Admin:** `admin@m.com` (id: 3)
- **Staff:** `staff@m.com` (id: 1)
- **Customer:** `customer@m.com` (id: 2) or any id is fine

### **Dashboards**
- **Admin Dashboard:** Manage users, branches, view stats, delete entities
- **Staff Dashboard:** Manage products, auctions, view bids, delete entities
- **Customer Dashboard:** View live auctions, place bids, see current time

### **Bidding**
- First bid must be **greater than the product's base price**
- Subsequent bids must be **greater than the current highest bid**
- Bids outside auction time or with invalid user/auction are rejected

### **Time Zone**
- The app displays the current time and time zone at the top of each dashboard
- Auction start/end times are compared in UTC (be aware of your local time)

---

## 📚 API Endpoints Summary

### **Users**
- `GET /api/users` — List users
- `POST /api/users` — Create user
- `DELETE /api/users/{id}` — Delete user

### **Auctions**
- `GET /api/auctions` — List all auctions
- `GET /api/auctions/active` — List active auctions
- `POST /api/auctions` — Create auction
- `DELETE /api/auctions/{id}` — Delete auction

### **Products**
- `GET /api/products` — List products
- `POST /api/products` — Create product
- `DELETE /api/products/{id}` — Delete product

### **Branches**
- `GET /api/branches` — List branches
- `POST /api/branches` — Create branch
- `DELETE /api/branches/{id}` — Delete branch

### **Bids**
- `GET /api/bids` — List all bids
- `POST /api/bids` — Place a bid

---

## 🗑️ Data Management
- **Delete** any auction, product, user, or branch from the respective dashboard
- Confirm before deleting; lists refresh automatically

---

## 🕒 Time & Bid Validation Notes
- **Current time** is always visible at the top of each dashboard
- **First bid** must be higher than base price
- **All bids** must be higher than the current highest bid
- **Auction must be active** (start time ≤ now ≤ end time, status = "active")
- **Time zone**: All times are compared in UTC; UI shows your local time

---

## 🐞 Troubleshooting
- **Auction not visible?** Check start time, end time, and status (must be "active" and within time window)
- **Bid not accepted?** Must be higher than base price/highest bid, and auction must be active
- **Foreign key errors?** Make sure userId and auctionId exist
- **Time zone confusion?** Check the current time bar in the app
- **Database errors?** Check connection string and run migrations

---

## 🤝 Contributing
1. Fork the repo and clone it
2. Create a feature branch
3. Make your changes and test
4. Submit a pull request

---

## 📄 License
This project is for educational and demonstration purposes. 
