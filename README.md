# 🍴 Canteen Food Management System

A full-stack **Canteen Food Management System** built to streamline food ordering and management in a canteen.  
The system supports two types of users:  

- **Admin** 👨‍💻 – manages menu items, monitors orders, and handles user management.  
- **User** 👤 – browses the menu, places orders, and tracks their status.  

## 🚀 Features
### For Users
- Register and login securely.
- Browse available food items.
- Place orders and track their status.
- Receive order notifications via email.

### For Admins
- Add, update, or delete food items.
- Manage incoming orders.
- Monitor user activities.
- Secure admin dashboard.

## 🛠️ Tech Stack
- **Frontend:** React / TailwindCSS  
- **Backend:** Node.js / Express.js  
- **Database:** MongoDB  
- **Authentication:** JWT (JSON Web Token)  
- **Email Service:** Nodemailer  

## ⚙️ Environment Variables
Create a `.env` file in the root of your project and configure the following variables:
```env
# MongoDB connection string
MONGO_URI="your_mongo_connection_uri"

# Secret key for JWT authentication
JWT_SECRET="your_secret_key"

# Email credentials (used for sending OTPs / notifications)
EMAIL_USER="your_email@example.com"
EMAIL_PASS="your_app_password"
