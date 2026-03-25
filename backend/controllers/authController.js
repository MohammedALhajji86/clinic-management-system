const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// 🟢 1. دالة تسجيل مستخدم جديد (موظف أو طبيب)
const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const userExists = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: "this email is already registered! "});
        }       

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await db.query(
            "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
            [name, email, hashedPassword, role || 'receptionist']
        );

        res.status(201).json({ message:  "User registered successfully", user: newUser.rows[0] });

    } catch (error) {
        console.error("Register Error:", error.message);
        res.status(500).json({ error:  "An error occurred while registering the user" });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const userResult = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        if (userResult.rows.length === 0) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const user = userResult.rows[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });

    } catch (error) {
        console.error("Login Error:", error.message);
        res.status(500).json({ error: "An error occurred while logging in" });
    }
};

module.exports = { register, login };