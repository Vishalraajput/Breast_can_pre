import 'dotenv/config';   

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; 

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const userSchema = new mongoose.Schema({
  name: String,
  dob: String,
  blood_group: String,
  email: { type: String, unique: true },
  password: String,
  profession: String, 
  history: [
    {
      result: String,
      image_url: String,
      predict: Number,
      date: { type: Date, default: Date.now },
    },
  ],
});

const User = mongoose.model("User", userSchema);
const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// ✅ Signup route --- UPDATED TO RETURN A TOKEN
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name,dob:"",blood_group:"", email, password: hashedPassword,profession:"", history: [] });
    await user.save();

    // Create and send token upon successful signup
    const payload = { 
      user: { id: user.id } 
    };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
});




app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) return res.status(400).json({ message: "User not found" });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Invalid password" });

    // Create and send token upon successful login
    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});




app.post("/save-prediction", authMiddleware, async (req, res) => {
  try {
    const { result, image_url, predict } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });
    user.history.push({ result, image_url, predict });
    await user.save();
    res.json({ message: "Prediction saved", history: user.history });
  } catch (err) {
    res.status(500).json({ message: "Failed to save prediction", error: err.message });
  }
});




app.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch dashboard", error: err.message });
  }
});





app.put("/update-profile", authMiddleware, async (req, res) => {
  try {
    const { name, dob, blood_group, profession } = req.body;
    const fieldsToUpdate = {
        name,
        dob,
        blood_group,
        profession
    };

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,        
      fieldsToUpdate,     
      { new: true }       
    ).select("-password"); 

    
    if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Profile updated successfully!", user: updatedUser });

  } catch (err) {

    console.error("Profile update error:", err);
    res.status(500).json({ message: "Failed to update profile", error: err.message });
  }
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));