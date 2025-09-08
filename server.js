const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt"); // For password hashing
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGOKEY)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => console.log("❌ MongoDB connection error:", err));

// FIXED: Proper user schema with password field
const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

const User = mongoose.model("User", userSchema);

// Basic route
app.get("/", (req, res) => {
    res.json({ message: "Auth API is running!" });
});

app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
   
        if (!username || !password) {
            return res.status(400).json({ 
                status: "error", 
                message: "Username and password are required" 
            });
        }

   
        const user = await User.findOne({ username });
        
        if (!user) {
            return res.status(401).json({ 
                status: "error", 
                message: "Invalid credentials" 
            });
        }

        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (isPasswordValid) {
            res.json({ 
                status: "success", 
                message: "Login successful",
                user: { 
                    username: user.username, 
                    email: user.email 
                }
            });
        } else {
            res.status(401).json({ 
                status: "error", 
                message: "Invalid credentials" 
            });
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ 
            status: "error", 
            message: "Server error" 
        });
    }
});

app.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Validation
        if (!username || !email || !password) {
            return res.status(400).json({ 
                status: "error", 
                message: "All fields are required" 
            });
        }

        if (password.length < 6) {
            return res.status(400).json({ 
                status: "error", 
                message: "Password must be at least 6 characters" 
            });
        }

        
        const existingUser = await User.findOne({ 
            $or: [{ username }, { email }] 
        });
        
        if (existingUser) {
            return res.status(409).json({ 
                status: "error", 
                message: "Username or email already exists" 
            });
        }

        
        const hashedPassword = await bcrypt.hash(password, 12);
        
        
        const newUser = new User({ 
            username, 
            email, 
            password: hashedPassword 
        });
        
        await newUser.save();
        
        res.status(201).json({ 
            status: "success", 
            message: "Account created successfully",
            user: { 
                username: newUser.username, 
                email: newUser.email 
            }
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ 
            status: "error", 
            message: "Server error" 
        });
    }
});

// Get all users (for testing - remove in production!)
app.get("/users", async (req, res) => {
    try {
        const users = await User.find({}, { password: 0 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ status: "error", message: "Server error" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});