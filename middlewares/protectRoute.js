import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

export const protectRoutes = async (req, res, next) => {
    try {
        // 1. Extract the Authorization header
        const authHeaders = req.headers.authorization;
        if (!authHeaders || !authHeaders.startsWith('Bearer ')) {
            return res.status(401).json({ status: 'error', message: 'Authentication required.' });
        }

        const token = authHeaders.split(' ')[1].trim();

        // 2. Verify the token
        jwt.verify(token, process.env.ACCESS_TOKEN_KEY, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ status: 'error', message: 'Invalid or expired token.' });
            }

            // 3. Database check: Ensure the user still exists in the database
            // This is important for multi-tenant environments to ensure account status
            const user = await User.findByPk(decoded.id);
            if (!user) {
                return res.status(401).json({ status: 'error', message: 'User no longer exists.' });
            }

            // 4. Attach user data to the request
            // Only attach necessary data (groupId is essential for your multi-tenant logic)
            req.user = {
                id: user.id,
                email: user.email,
                groupId: user.groupId
            };

            next();
        });
    } catch (error) {
        console.error('Middleware Error:', error);
        return res.status(500).json({ status: 'error', message: 'Internal server error during authentication.' });
    }
};