import db from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";


const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";
const REFRESH_SECRET = process.env.REFRESH_SECRET;
const REFRESH_EXPIRES_IN = process.env.REFRESH_EXPIRES_IN || "7d";

export const AuthController = {
  
  async signup(req, res) {
    try {
      const { email, username, password, confirmPassword, firstName, lastName, role } = req.body;

      if (!email || !username || !password || !confirmPassword || !firstName || !lastName)
        return res.status(400).json({ message: "All fields are required" });

      if (password !== confirmPassword)
        return res.status(400).json({ message: "Passwords do not match" });

      const existing = await db("users").where({ email }).orWhere({ username }).first();
      if (existing) return res.status(400).json({ message: "Email or username already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);

      
      const otp = crypto.randomInt(100000, 999999).toString();

      const [user] = await db("users")
        .insert({
          email,
          username,
          password: hashedPassword,
          firstName,
          lastName,
          role: role || "user",
          status: "inactive",
          otp,
        })
        .returning("*");

      
      console.log(`OTP for ${email}: ${otp}`);

      res.status(201).json({
        message: "User created, OTP sent",
        userId: user.id,
        otpSent: true,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  
  async verifyOtp(req, res) {
    try {
      const { userId, otp } = req.body;

      const user = await db("users").where({ id: userId }).first();
      if (!user) return res.status(404).json({ message: "User not found" });

      if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

      await db("users").where({ id: userId }).update({ status: "active", otp: null });

      res.json({ message: "OTP verified, account activated" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

 
  async signin(req, res) {
    try {
      const { email, password } = req.body;

      const user = await db("users").where({ email }).first();
      if (!user) return res.status(404).json({ message: "User not found" });
      if (user.status !== "active") return res.status(403).json({ message: "Account inactive" });

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(401).json({ message: "Invalid credentials" });

      const accessToken = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
      const refreshToken = jwt.sign({ id: user.id, role: user.role }, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES_IN });

      
      await db("users").where({ id: user.id }).update({ refreshToken });

      res.json({ accessToken, refreshToken });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  
  async getMe(req, res) {
    try {
      const user = await db("users").where({ id: req.user.id }).select("-password", "-otp", "-refreshToken").first();
      if (!user) return res.status(404).json({ message: "User not found" });

      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  
  async logout(req, res) {
    try {
      await db("users").where({ id: req.user.id }).update({ refreshToken: null });
      res.json({ message: "Logout successful" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  
  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) return res.status(400).json({ message: "Refresh token required" });

      const user = await db("users").where({ refreshToken }).first();
      if (!user) return res.status(401).json({ message: "Invalid refresh token" });

      // Verify token
      jwt.verify(refreshToken, REFRESH_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: "Invalid refresh token" });
      });

      const newAccessToken = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
      const newRefreshToken = jwt.sign({ id: user.id, role: user.role }, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES_IN });

      await db("users").where({ id: user.id }).update({ refreshToken: newRefreshToken });

      res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
