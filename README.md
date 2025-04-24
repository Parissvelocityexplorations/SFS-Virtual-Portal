<p align="center">
  <img src="https://cdn-icons-png.flaticon.com/512/8926/8926796.png" width="100" />
</p>
<p align="center">
    <h1 align="center">SFS VIRTUAL PORTAL</h1>
</p>
<p align="center">
    <em>Streamlining Visitor Management at Space Force Bases</em>
</p>
<p align="center">
	<img src="https://img.shields.io/badge/license-MIT-blue?style=flat&color=0080ff" alt="license">
	<img src="https://img.shields.io/github/last-commit/parissyoungblood/sfs-virtual-portal?style=flat&logo=git&logoColor=white&color=0080ff" alt="last-commit">
	<img src="https://img.shields.io/badge/.NET-8.0-blue?style=flat&color=0080ff" alt="dotnet">
	<img src="https://img.shields.io/badge/PostgreSQL-4169E1.svg?style=flat&logo=PostgreSQL&logoColor=white" alt="PostgreSQL">
<p>
<p align="center">
		<em>Powered by the tools and frameworks below.</em>
</p>
<p align="center">
	<img src="https://img.shields.io/badge/.NET-512BD4.svg?style=flat&logo=dotnet&logoColor=white" alt=".NET">
	<img src="https://img.shields.io/badge/React-61DAFB.svg?style=flat&logo=React&logoColor=black" alt="React">
	<img src="https://img.shields.io/badge/PostgreSQL-4169E1.svg?style=flat&logo=PostgreSQL&logoColor=white" alt="PostgreSQL">
    <br>
	<img src="https://img.shields.io/badge/Swagger-85EA2D.svg?style=flat&logo=Swagger&logoColor=black" alt="Swagger">
	<img src="https://img.shields.io/badge/Tailwind%20CSS-06B6D4.svg?style=flat&logo=Tailwind-CSS&logoColor=white" alt="Tailwind CSS">
	<img src="https://img.shields.io/badge/Serilog-9C27B0.svg?style=flat&logo=Serilog&logoColor=white" alt="Serilog">
</p>

---

## 🚀 Quick Links

> - [Overview](#-overview)
> - [Features](#-features)
> - [Project Structure](#-project-structure)
> - [Technology Stack](#-technology-stack)
> - [Getting Started](#-getting-started)
>   - [Prerequisites](#prerequisites)
>   - [Installation](#installation)
> - [API Documentation](#-api-documentation)
> - [Contributing](#-contributing)
> - [License](#-license)

---

## 🔍 Overview

The SFS Virtual Portal is a digital visitor kiosk system tailored for Space Force Base operations. It modernizes the visitor experience by integrating secure pass management, appointment scheduling, and biometric check-ins—all through an accessible web interface.

---

## ✨ Features

- **Digital Pass Management**: Create, manage, and scan visitor passes
- **Visitor Registration**: Real-time tracking of individuals entering the base
- **Appointment Scheduling**: Admin and visitor portals for efficient scheduling
- **DBIDS Integration**: Secure validation of visitor credentials
- **QR Check-In System**: Seamless access with scannable codes
- **Role-Based Access**: Admin, staff, and visitor user roles

---

## 📁 Project Structure

```
sfs-virtual-portal/
├── client/                   # Frontend React application
└── SpaceForce.VisitorManagement/  # .NET backend project
    ├── Controllers/          # API endpoints
    ├── Models/               # Entity models
    ├── Services/             # Business logic
    ├── Data/                 # DB context and migrations
    └── Configuration/        # App settings and policies
```

---

## 🔧 Technology Stack

### Backend (Server)

- **Framework**: .NET 8.0
- **Database**: PostgreSQL
- **ORM**: Entity Framework Core
- **Authentication**: JWT Bearer
- **API Docs**: Swagger / OpenAPI
- **Logging**: Serilog

### Frontend (Client)

- **Framework**: React 18
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **State**: Zustand
- **Build Tool**: Vite

---

## 🛠 Getting Started

### Prerequisites

- Node.js v18+
- .NET 8 SDK
- PostgreSQL
- EF Core CLI
- Docker & Docker Compose (optional for containerized setup)

---

### 🔧 Traditional Setup

#### Backend Setup

```sh
cd SpaceForce.VisitorManagement
dotnet restore
dotnet run
```

#### Database Setup

1. Ensure PostgreSQL is running
2. Update your `appsettings.json` with the correct connection string
3. Run database migrations:

```sh
dotnet ef database update
```

#### Frontend Setup

```sh
cd client
npm install
npm run dev
```

---

### 🐳 Dockerized Setup

1. Clone the repository:

```sh
git clone https://github.com/parissyoungblood/sfs-virtual-portal.git
cd sfs-virtual-portal
```

2. Configure your environment variables:

- Copy `.env.example` to `.env` and update values
- Ensure DB connection info matches Docker services

3. Build and run the containers:

```sh
docker-compose up --build
```

4. Access the app:
- Frontend: [http://localhost:3001](http://localhost:3001)
- Swagger API: [http://localhost:5288/swagger](http://localhost:5288/swagger)

---

## 📚 API Documentation

The Swagger documentation for the API is accessible at:

- Local: `http://localhost:5288/swagger`
- Dev: `https://dev-api.example.com/swagger`

Includes:
- Authentication & JWT validation
- Visitor and appointment CRUD
- DBIDS validation endpoints
- Error codes and logging schemas

---

## 🤝 Contributing

Contributions are welcome! To get started:

1. Fork this repo
2. Create a branch (`git checkout -b feature/my-feature`)
3. Commit changes (`git commit -m 'Add cool feature'`)
4. Push to GitHub (`git push origin feature/my-feature`)
5. Open a Pull Request 🚀

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

[**Return to Top**](#-quick-links)
