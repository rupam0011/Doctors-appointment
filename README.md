# 🏥 MediBook — Online Doctor Appointment Booking System

A full-stack MERN application for booking doctor appointments online.

## Tech Stack

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs (password hashing)
- Nodemailer (email verification)
- TypeScript

### Frontend
- Next.js 15 (App Router)
- React 19 + TypeScript
- Tailwind CSS v4
- TanStack Query (React Query)
- Axios
- react-hot-toast

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file (copy from `.env.example`):
```env
PORT=5000
MONGO_URI=mongodb+srv://your_atlas_uri_here
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:3000
```

Start the backend:
```bash
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:3000` and the backend on `http://localhost:5000`.

### 3. Seed Doctors (Admin Only)

1. Register a user with role "admin" (or manually update in MongoDB)
2. Login to get the JWT token
3. Call: `POST http://localhost:5000/api/doctors/seed` with the Bearer token

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register` | Register a new user |
| GET | `/api/verify-email/:token` | Verify email address |
| POST | `/api/login` | Login and get JWT |

### Doctors
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/doctors` | List all doctors (filter by `?specialization=`) |
| GET | `/api/doctors/:id` | Get doctor by ID |
| POST | `/api/doctors/seed` | Seed 5 dummy doctors (Admin only) |

### Appointments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/appointments` | Book appointment (Protected) |
| GET | `/api/my-appointments` | Get user's appointments (Protected) |
| PUT | `/api/appointments/:id/cancel` | Cancel appointment (Protected) |
| GET | `/api/all-appointments` | All appointments (Admin only) |

## Project Structure

```
├── backend/
│   └── src/
│       ├── config/         # Database connection
│       ├── controllers/    # Route handlers
│       ├── middleware/      # Auth middleware
│       ├── models/          # Mongoose schemas
│       ├── routes/          # Express routes
│       ├── utils/           # Helpers (email)
│       └── index.ts         # Server entry point
│
├── frontend/
│   ├── app/                # Next.js pages (App Router)
│   ├── components/         # Reusable React components
│   ├── hooks/              # TanStack Query hooks
│   ├── providers/          # Context providers
│   ├── services/           # API service layer
│   └── types/              # TypeScript interfaces
```
