# Space Force Virtual Portal

![Space Force Logo](client/public/logo-dark.png)

## Overview
The Space Force Virtual Portal is a visitor management system designed for secure military facilities. It streamlines visitor check-in, appointment scheduling, and pass management through an intuitive digital kiosk interface. The system enables visitors to self-register and schedule appointments while providing base personnel with administrative oversight.

## Core Functionality

### Visitor Management
- **Self-service kiosk** for visitor check-in
- **ID scanning** via barcode/QR code
- **Appointment scheduling** with calendar integration
- **Pass generation** for different access types (Golf Pass, Visitor Pass, Vet Card, Contractor)
- **Status tracking** (Scheduled, Checked In, Serving, Served, Cancelled)

### Administrative Features
- **User management** for personnel and visitors
- **Appointment oversight** and status updates
- **Multi-step workflow** for visitor processing

## Architecture

### Backend Technologies
- **.NET 7**: Cross-platform framework for building web applications
- **ASP.NET Core Web API**: RESTful API development framework
- **Entity Framework Core**: ORM for database operations with migrations
- **PostgreSQL**: Relational database management system
- **JWT Authentication**: Token-based security for API access
- **Serilog**: Structured logging provider

### Frontend Technologies
- **Remix.js**: React-based web framework with server-side rendering
- **React**: Component-based UI library for interactive interfaces
- **TypeScript**: Typed JavaScript for enhanced developer experience
- **Tailwind CSS**: Utility-first CSS framework for styling
- **ZXing**: Barcode scanning library integration
- **React Router**: Client-side routing within the application

### DevOps & Infrastructure
- **Docker**: Containerization for consistent deployment
- **Docker Compose**: Multi-container orchestration for local development

## Project Structure

### Backend (`SpaceForce.VisitorManagement`)
- **SpaceForce.VisitorManagement.Api**
  - **Controllers**
    - `AppointmentsController.cs`: Manages appointments (create, get by user, update status)
    - `UserController.cs`: User management operations (create, get all, update)
    - `WeatherForecastController.cs`: Test/sample controller
  - **Program.cs**: Application configuration and service setup
  - **appsettings.json**: Environment configuration including database and JWT settings
  
- **SpaceForce.VisitorManagement.Data**
  - **DbContexts**
    - `SfDbContext.cs`: Entity Framework database context with entity configurations
  - **Models**
    - **Enumerations**
      - `SfPassType.cs`: Pass type enum (GolfPass, VisitorPass, VetCard, Contractor)
      - `SfStatus.cs`: Status tracking enum (Scheduled, CheckedIn, Serving, Served, Cancelled)
    - `SfAppointment.cs`: Appointment entity with user, pass type and status
    - `SfUser.cs`: User entity with personal information
    - `SfEntityBase.cs`: Base entity with ID and timestamps
    - `SfPivotBase.cs`: Base class with timestamp properties
  - **Migrations**: Database schema evolution
  - **Seeds**: Initial database data population

### Frontend (`client`)
- **Components**
  - `Barcode.tsx`: Appointment barcode generator for check-in
  - `Calendar.tsx`: Date and timeslot selection component
  - `KioskLayout.tsx`: Layout template with header, footer and progress indicator
  - `ProgressSteps.tsx`: Step visualization for multi-step processes
  - `ServiceCard.tsx`: Selectable card component for service options
- **Routes**
  - `kiosk._index.tsx`: Initial kiosk screen with DBIDS information
  - `kiosk.service.tsx`: User information collection and service selection
  - `kiosk.schedule.tsx`: Appointment date and time scheduling
  - `kiosk.review.tsx`: Appointment information review
  - `kiosk.confirmation.tsx`: Booking confirmation with barcode
  - `kiosk.scanner.tsx`: ID scanner interface
  - `signin.tsx`: Staff authentication screen
- **Styles**
  - `theme.css`: Custom theme variables and color palette
  - `tailwind.css`: Tailwind utility customization

## Database Schema
- **Users Table**: Stores visitor information
  - `Id` (GUID)
  - `FirstName`, `LastName`
  - `Email`, `PhoneNo`
  - Timestamps (`DateCreated`, `DateModified`)
  
- **Appointments Table**: Manages visit scheduling
  - `Id` (GUID)
  - `UserId` (Foreign key to Users)
  - `PassTypeId`
  - `Date` (Appointment datetime)
  - `PassType` (Enum)
  - `Status` (Enum)
  - Timestamps (`DateCreated`, `DateModified`)

## Getting Started

### Prerequisites
- Docker and Docker Compose
- .NET 7.0+ SDK (for local development)
- Node.js 18+ and npm (for frontend development)
- PostgreSQL (for local database)

### Running with Docker
```bash
docker-compose up
```

This will start both the frontend and backend services, along with a PostgreSQL instance. The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Local Development

#### Backend
```bash
cd SpaceForce.VisitorManagement
dotnet restore
dotnet build
dotnet run --project SpaceForce.VisitorManagement.Api
```

#### Frontend
```bash
cd client
npm install
npm run dev
```

## Application Flow

### Visitor Experience
1. Visitor approaches kiosk and selects if they have a DBIDS card
2. Enters personal information and selects required pass type
3. Chooses appointment date and time from available slots
4. Reviews appointment details for accuracy
5. Receives confirmation with digital pass/barcode

## API Endpoints

### Users
- `GET /api/user`: Retrieve all users
- `POST /api/user`: Create new user
- `PUT /api/user/userId/{userId}`: Update user information

### Appointments
- `GET /api/appointments/userId/{userId}`: Get appointments for a specific user
- `POST /api/appointments/userid/{userId}/date/{date}`: Create new appointment
- `PUT /api/appointments/{appointmentId}/status/{status}`: Update appointment status

## Current Limitations & Future Enhancements
- Frontend currently uses mock data without API integration
- Authentication/authorization system needs implementation for staff portal
- Admin dashboard for appointment management to be developed
- Reporting and analytics features planned
- Mobile responsiveness improvements needed

## License
Proprietary software for Space Force use only.

---

*Space Force Virtual Portal - Streamlining secure facility access management*