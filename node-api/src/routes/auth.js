
import bcrypt from 'bcryptjs';
import { Router } from "express";
import jwt from 'jsonwebtoken';
import dbConnection from "../config/dbConfig.js";


const authRouter = Router();
authRouter.post("/register", async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const pool = await dbConnection.getConnection();
        const [existingUser] = await pool.query('SELECT * FROM Contact_Details WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: "Email already registered." });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(
            'INSERT INTO Contact_Details (first_name, last_name, email, password) VALUES (?, ?, ?, ?)',
            [firstName, lastName, email, hashedPassword]
        );
        // Get the new user’s ID
        const [userRows] = await pool.query('SELECT * FROM Contact_Details WHERE email = ?', [email]);
        const user = userRows[0];

        // Create a JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: "User registered successfully.",
            token,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong." });
    }
});

authRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const pool = await dbConnection.getConnection();

        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        const user = users[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({ message: "Login successful", token, user: { id: user.id, email: user.email, firstName: user.first_name, lastName: user.last_name } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong." });
    }
});

export default authRouter;