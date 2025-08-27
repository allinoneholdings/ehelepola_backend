const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Staff } = require("../models");


exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const adminExists = await Staff.findOne({ where: { role: "admin" } });

    let requesterRole = null;
    if (req.user) {
      requesterRole = req.user.role;
    }

    if (!adminExists && role === "admin") {
      requesterRole = "super"; // treat as super bootstrap
    }

    // Permissions
    if (requesterRole === null) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (requesterRole === "staff") {
      return res.status(403).json({ message: "Staff cannot register users" });
    }

    if (requesterRole === "manager") {
      if (role === "admin") {
        return res
          .status(403)
          .json({ message: "Managers cannot create admins" });
      }
      if (role !== "staff") {
        return res
          .status(403)
          .json({ message: "Managers can only create staff users" });
      }
    }

    const existingUser = await Staff.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await Staff.create({
      username,
      email,
      password: hashedPassword,
      role: role || "staff",
    });

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await Staff.findOne({ where: { username } });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await Staff.findAll({
      attributes: [
        "id",
        "username",
        "email",
        "role",
        "created_at",
        "updated_at",
      ],
      order: [["created_at", "DESC"]],
    });

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
};
