# Business Partners – CRM WebApp

Welcome to **Business Partners**, a **Customer Relationship Management (CRM)** web application designed to streamline your client and contact management.

## 🚀 Getting Started

### ⚠️ Production (Currently Not Working)

> **Note:** The production setup using `docker compose up` is currently **not working**. Please use the development setup until this is resolved.


### 🛠 Development Setup

#### 1. Start MariaDB

Before running the app, start a MariaDB container:

```bash
docker run --name business-partners-db \
  -e MYSQL_ROOT_PASSWORD=my-secret-pw \
  -e MYSQL_DATABASE=test \
  -p 3306:3306 \
  -v mariadb_data:/var/lib/mysql \
  -d mariadb
```

#### 2. Create the `.env` File

Inside the `server/` directory, create a `.env` file:

```env
# Environment
NODE_ENV=development
PORT=3001

# JWT Secrets
ACCESS_TOKEN_SECRET=my-secure-access-toke
REFRESH_TOKEN_SECRET=my-secure-refresh-toke
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

DEV_AUTH='AUTH'

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=my-secret-pw
DB_DATABASE=test

# SMTP Configuration
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASSWORD=your_smtp_password
```


#### 3. Start the App

In two separate terminal tabs or windows:

**Server:**
```bash
cd server
npm install
npm run dev
```

**Client:**
```bash
cd client
npm install
npm run dev
```

Once running, the frontend will be available at:  
👉 `http://localhost:3000`


### 🔐 First Login

- **Default admin email:** `admin@example.com`  
- Set the password by visiting:  
  `http://localhost:3000/password-reset/admin`
