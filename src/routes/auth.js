const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { body, validationResult } = require("express-validator");

dotenv.config();

const connection = require("../config/database");

// Middleware for JWT validation
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    req.user = decoded;
    next();
  });
};

router.post(
  "/register",
  [
    body("username").notEmpty(),
    body("email").notEmpty(),
    body("password").notEmpty(),
  ],
  async (req, res) => {
    console.log("req.body", req.body);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array(),
      });
    }

    try {
      // Proper async database query
      const existingUserQuery = new Promise((resolve, reject) => {
        connection.query(
          "SELECT * FROM users WHERE email = ?",
          [req.body.email],
          (err, results) => {
            if (err) reject(err);
            else resolve(results);
          }
        );
      });

      const existingUser = await existingUserQuery;

      if (existingUser && existingUser.length > 0) {
        return res.status(400).json({ error: "Email already exists" });
      }

      // Hash password with await and use req.body.password
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      // formData defined after hashing
      const formData = {
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
      };

      // Proper async database insert
      const insertQuery = new Promise((resolve, reject) => {
        connection.query("INSERT INTO users SET ?", formData, (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });

      const rows = await insertQuery;

      console.log(rows);
      return res.status(201).json({
        status: true,
        message: "Insert Data Successfully",
        data: {
          id: rows.insertId,
          username: formData.username,
          email: formData.email,
          // Don't return password in response!
        },
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Don't forget to export the router!
module.exports = router;
