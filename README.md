# RFQ Marketplace SaaS

A modern, full-stack **Request for Quotation (RFQ) Marketplace** that connects buyers and suppliers through a structured procurement workflow.

The platform allows buyers to create RFQs, suppliers to submit quotations, users to communicate through real-time chat, and administrators to manage the entire marketplace.

---

## 🚀 Features

### 👤 Authentication & Users

- User registration
- Email OTP verification
- Secure login
- JWT authentication
- Role-based access control
- Buyer account
- Supplier account
- Admin account
- User activation/deactivation
- Role management
- Secure logout

### 🛒 Buyer Features

- Buyer dashboard
- Create RFQs
- View created RFQs
- View RFQ details
- Receive supplier quotations
- Compare supplier quotations
- Accept/reject quotations
- Communicate with suppliers
- Real-time messaging
- Notifications
- Procurement activity management

### 🏭 Supplier Features

- Supplier dashboard
- Browse available RFQs
- View RFQ requirements
- Submit quotations
- Update quotation information
- Track quotation status
- Communicate with buyers
- Real-time chat
- Notifications

### 💬 Real-Time Chat

- Buyer ↔ Supplier messaging
- Socket.IO powered communication
- Real-time message delivery
- Online connection status
- Message timestamps
- Conversation management
- Role-based chat access
- Automatic socket authentication

### 🔔 Notifications

- Real-time notifications
- RFQ notifications
- Quotation notifications
- Chat notifications
- Notification read/unread status
- Notification center

### 🛡️ Admin Panel

- Admin dashboard
- Manage users
- Manage user roles
- Activate/deactivate users
- View RFQs
- View quotations
- Monitor marketplace activity
- Manage platform data

### 📱 Responsive UI

The frontend is designed to work across:

- Desktop
- Laptop
- Tablet
- Mobile
- Small-screen devices

### 🎨 UI

- Responsive layouts
- React Icons
- Toast notifications
- Modern dashboard components
- Reusable UI components
- Responsive tables
- Mobile-friendly navigation
- Loading states
- Error handling

---

# 🏗️ Technology Stack

## Frontend

- React.js
- Vite
- React Router DOM
- Axios
- Socket.IO Client
- React Icons
- React Toastify / Toast Context
- CSS
- Responsive Design

## Backend

- Node.js
- Express.js
- Sequelize ORM
- MySQL
- JWT
- bcrypt
- Socket.IO
- CORS
- Helmet
- dotenv

## Database

- MySQL
- Sequelize ORM

## Communication

- REST API
- WebSocket
- Socket.IO

---

# 📁 Project Structure

```text
rfq-marketplace-saas/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── sockets/
│   │
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── .gitignore
└── README.md

🔄 RFQ Workflow
Buyer
  │
  ├── Register
  │
  ├── Verify Email / OTP
  │
  ├── Login
  │
  ├── Create RFQ
  │
  ▼
RFQ Marketplace
  │
  ▼
Supplier
  │
  ├── View RFQ
  │
  ├── Submit Quotation
  │
  ▼
Buyer
  │
  ├── Review Quotations
  ├── Compare Offers
  ├── Chat with Supplier
  └── Accept / Reject
  │
  ▼
Notification + Real-Time Communication

🔐 Authentication

The application uses JWT-based authentication.

Authentication flow:
Register
   ↓
Email OTP
   ↓
OTP Verification
   ↓
JWT Token
   ↓
Authenticated Dashboard


💬 Real-Time Architecture

Socket.IO is used for real-time communication.

Buyer Browser
      │
      │ Socket.IO
      ▼
   Node.js
   Socket.IO
      │
      ├───────────────┐
      ▼               ▼
Supplier Browser   Notifications

⚙️ Installation
1. Clone Repository

git clone https://github.com/YOUR_USERNAME/rfq-marketplace-saas.git
👥 User Roles

The application supports three primary roles.

BUYER

Buyers can:

Create RFQs
Manage RFQs
Receive quotations
Review quotations
Accept/reject quotations
Chat with suppliers
Receive notifications
SUPPLIER

Suppliers can:

Browse RFQs
Submit quotations
Manage quotations
Chat with buyers
Receive notifications
ADMIN

Administrators can:

Manage users
Manage roles
Manage account status
View RFQs
View quotations
Monitor marketplace activity
🔌 API Structure

Main API groups:

/api/auth
/api/rfqs
/api/quotations
/api/chat
/api/admin
/api/test
/api/health

Example:

POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/register/verify-otp

GET    /api/rfqs
POST   /api/rfqs

GET    /api/quotations/rfq/:rfqId
POST   /api/quotations

GET    /api/chat
POST   /api/chat

GET    /api/admin/users
PATCH  /api/admin/users/:id/status
PATCH  /api/admin/users/:id/role

Actual available endpoints may vary according to the backend route configuration.

🔔 Notification System

Notifications can be generated for important marketplace events such as:

New RFQ
New quotation
Quotation accepted
Quotation rejected
New message
Account updates

Users can access notifications through the notification module.

📱 Responsive Design

The UI supports responsive layouts for:

Desktop       1200px+
Laptop        992px+
Tablet        768px+
Mobile        576px+
Small Mobile  <576px

Tables, navigation, cards, forms, dashboards and chat interfaces are designed to adapt to smaller screens.

🧪 Testing

Run the frontend:

npm run dev

Run the backend:

npm run dev

Test:

Authentication
Registration
OTP verification
Login
Logout
RFQ creation
Quotation submission
Quotation management
Buyer/Supplier chat
Socket connection
Notifications
Admin management
Responsive UI
🔒 Security

The application includes:

JWT authentication
Password hashing
Role-based authorization
Protected routes
Protected APIs
CORS configuration
Helmet security headers
Environment variables
Socket authentication
Input validation

Never commit your .env file.

🚫 Environment Variables

Do NOT commit:

.env
.env.local
.env.production

Do not expose:

JWT_SECRET
DB_PASSWORD
API_KEYS
SMTP_PASSWORD
ADMIN_PASSWORD
📦 Production Build

Frontend:

npm run build

Preview production build:

npm run preview

Backend:

NODE_ENV=production npm start

Before deployment, update:

CLIENT_URL=https://your-frontend-domain.com
VITE_API_URL=https://your-api-domain.com/api
VITE_SOCKET_URL=https://your-api-domain.com

Also configure your production MySQL database.

☁️ Deployment

The application can be deployed using platforms such as:

Frontend
├── Vercel
├── Netlify
└── Cloudflare Pages

Backend
├── Render
├── Railway
├── AWS
└── VPS

Database
├── Aiven
├── Railway
├── AWS RDS
└── MySQL Server

Make sure WebSocket/Socket.IO support is enabled on the selected backend hosting provider.

🧑‍💻 Development

Recommended development environment:

Node.js
VS Code
MySQL
Git
GitHub
Chrome

Run frontend and backend in separate terminals.

🐛 Troubleshooting
Backend cannot connect to MySQL

Check:

DB_HOST
DB_PORT
DB_NAME
DB_USER
DB_PASSWORD

Also verify that MySQL is running.

Socket.IO not connecting

Check:

VITE_SOCKET_URL=http://localhost:5000

and:

CLIENT_URL=http://localhost:5173

Also make sure the backend Socket.IO server is running.

401 Unauthorized

Check whether the JWT token exists in browser storage.

localStorage → token

Then verify that the frontend sends:

Authorization: Bearer <token>
403 Forbidden

Verify that:

JWT is valid
User is authenticated
User role matches the protected route
Backend authorization middleware is configured correctly
Database foreign-key errors

If the database contains old/incompatible schema data, use a clean database for development rather than repeatedly applying destructive schema changes to production data.

📄 License

This project is released as open source.

Everyone is free to:

Use it
Modify it
Learn from it
Extend it
Use it for personal projects
Use it for business/commercial purposes

Please review and comply with the repository's license terms if a separate LICENSE file is added.

👨‍💻 Developed By

CodePilot DevTeam

Building practical open-source software for developers and businesses.

🌍 Open Source

RFQ Marketplace SaaS is designed as an open-source project that can be adapted for different procurement and quotation workflows.

You can customize:

Buyer workflow
Supplier workflow
RFQ fields
Quotation fields
Notifications
Chat
Admin panel
Authentication
Database
UI
Business rules
🤝 Contributions

Contributions are welcome.

You can:

Fork the repository
Create a feature branch
git checkout -b feature/my-feature
Make your changes
Commit
git add .
git commit -m "Add new feature"
Push
git push origin feature/my-feature
Create a Pull Request
⭐ Support

If this project is useful to you:

Star the repository
Fork the project
Report bugs
Suggest features
Submit pull requests
📧 Developer Contact

For help, feature requests, business inquiries or development support:

CodePilot DevTeam

📧 Add your official developer email here.

📌 Project Summary

RFQ Marketplace SaaS is a full-stack B2B procurement platform that brings buyers and suppliers together through:

RFQs
+
Quotations
+
Real-Time Chat
+
Notifications
+
Role-Based Access
+
Admin Management
+
Responsive UI

Built with:

React + Node.js + Express + Sequelize + MySQL + Socket.IO
