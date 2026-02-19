# MongoDB Setup Guide

## Current Configuration Status

✅ **MongoDB Atlas Connection**: You're currently using MongoDB Atlas (Cloud Database)
- Cluster: `yakadabadu.bi9yq.mongodb.net`
- Database: `sliit_af_db`
- Status: Connected successfully

## Option 1: Using MongoDB Atlas (Cloud) - RECOMMENDED ✅

Your current setup is using MongoDB Atlas, which is already configured. Follow these steps to verify and manage:

### Step 1: Access MongoDB Atlas Dashboard
1. Go to [https://cloud.mongodb.com/](https://cloud.mongodb.com/)
2. Login with your MongoDB Atlas account
3. Select your project: **YAKADABADU**

### Step 2: Verify Database Access
1. In the left sidebar, click **Database Access**
2. Verify user `admin` exists with password `admin123`
3. Ensure the user has **readWrite** permissions

### Step 3: Verify Network Access
1. In the left sidebar, click **Network Access**
2. Add your IP address or use `0.0.0.0/0` for development (allows all IPs)
   - **Important**: For production, restrict to specific IPs
3. Click **Add IP Address** → **Allow Access from Anywhere** (for development)

### Step 4: Check Database Collections
1. Click **Database** in the left sidebar
2. Click **Browse Collections** on your cluster
3. You should see database `sliit_af_db`
4. Collections will be created automatically when you insert data:
   - `users` - User accounts (Admin, Seller, Customer)

### Step 5: Test the Connection
Your current connection string:
```
mongodb+srv://admin:admin123@yakadabadu.bi9yq.mongodb.net/sliit_af_db?retryWrites=true&w=majority&appName=YAKADABADU
```

The server shows: ✅ `MongoDB connected: yakadabadu-shard-00-00.bi9yq.mongodb.net`

---

## Option 2: Using Local MongoDB (Development)

If you want to use local MongoDB instead:

### Step 1: Install MongoDB Community Server

#### macOS (using Homebrew):
```bash
# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community

# Verify MongoDB is running
brew services list | grep mongodb
```

#### Windows:
1. Download MongoDB Community Server from [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Run the installer
3. Choose **Complete** installation
4. Install MongoDB as a Service
5. Start MongoDB service from Services app

#### Linux (Ubuntu/Debian):
```bash
# Import MongoDB public GPG Key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Create list file
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Update packages
sudo apt-get update

# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Step 2: Update Environment Variables
Edit `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sliit_af_db
JWT_SECRET=sliit_af_backend_secret_key_2026_change_in_production
```

### Step 3: Restart Backend Server
```bash
# Stop the current server (Ctrl+C)
# Then start again
npm run dev
```

---

## MongoDB Compass (GUI Tool) - OPTIONAL

MongoDB Compass is a visual tool to manage your database:

### Step 1: Download and Install
- Download from: [https://www.mongodb.com/products/compass](https://www.mongodb.com/products/compass)

### Step 2: Connect to Your Database

**For MongoDB Atlas (Current Setup):**
```
mongodb+srv://admin:admin123@yakadabadu.bi9yq.mongodb.net/sliit_af_db
```

**For Local MongoDB:**
```
mongodb://localhost:27017/sliit_af_db
```

### Step 3: View Your Data
- Browse collections
- View documents
- Run queries
- Monitor performance

---

## Troubleshooting

### Problem: "Network Error" when registering

**Solution 1**: Check Network Access in MongoDB Atlas
1. Go to MongoDB Atlas Dashboard
2. Click **Network Access**
3. Add IP `0.0.0.0/0` (Allow from anywhere) for development
4. Wait 1-2 minutes for changes to take effect

**Solution 2**: Verify Connection String
The connection string in `.env` should include:
- Database name (`/sliit_af_db`)
- Proper credentials
- Query parameters (`?retryWrites=true&w=majority`)

**Solution 3**: Check User Permissions
1. MongoDB Atlas → **Database Access**
2. User `admin` should have:
   - **Built-in Role**: Atlas Admin OR
   - **Specific Privileges**: readWriteAnyDatabase

### Problem: "MongoServerError: bad auth"

**Solution**: Update user credentials in MongoDB Atlas
1. Go to **Database Access**
2. Edit the `admin` user
3. Update password to `admin123`
4. Update `.env` file with correct credentials

### Problem: Database connected but no collections visible

**Solution**: Collections are created automatically
- Collections are created when you first insert a document
- Try registering a user from the frontend
- Refresh MongoDB Compass or Atlas to see new collections

### Problem: "Connection timeout"

**Solution 1**: Check if MongoDB is running
```bash
# For Atlas: Check MongoDB Atlas dashboard status
# For Local: 
brew services list | grep mongodb  # macOS
sudo systemctl status mongod        # Linux
```

**Solution 2**: Network issues
- Check your internet connection (for Atlas)
- Check firewall settings
- Verify VPN is not blocking connections

---

## Testing the Setup

### Method 1: Using cURL (Terminal)
```bash
# Test register endpoint
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "customer"
  }'
```

If successful, you'll see:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {...},
    "token": "..."
  }
}
```

### Method 2: Check Backend Logs
Watch the terminal where backend is running:
```bash
npm run dev
```

You should see:
- ✅ MongoDB connected
- ✅ Server running on http://localhost:5000
- If there are errors, they'll appear here

### Method 3: Check MongoDB Compass
1. Open MongoDB Compass
2. Connect to your database
3. Navigate to `sliit_af_db` → `users`
4. After registration, you should see user documents

---

## Current Status Summary

✅ **Backend Server**: Running on `http://localhost:5000`  
✅ **MongoDB Atlas**: Connected to `yakadabadu.bi9yq.mongodb.net`  
✅ **Database**: `sliit_af_db`  
✅ **CORS**: Configured for `http://localhost:5173`  
✅ **JWT Secret**: Configured  

### Your Connection String (Updated):
```
mongodb+srv://admin:admin123@yakadabadu.bi9yq.mongodb.net/sliit_af_db?retryWrites=true&w=majority&appName=YAKADABADU
```

**Key Changes Made:**
- ✅ Added database name `/sliit_af_db` to the connection string
- ✅ Added query parameters for better reliability

---

## Next Steps

1. **Restart your backend server** (it should auto-restart with nodemon)
2. **Go to MongoDB Atlas** and verify Network Access allows your IP
3. **Try registering a user** from the frontend
4. **Check MongoDB Atlas** → Browse Collections to see the new user

If you still encounter issues, check the backend terminal logs for error messages.

---

## Contact & Support

- MongoDB Atlas Docs: [https://www.mongodb.com/docs/atlas/](https://www.mongodb.com/docs/atlas/)
- MongoDB University (Free): [https://university.mongodb.com/](https://university.mongodb.com/)

---

**Last Updated**: February 18, 2026
