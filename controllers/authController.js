/**
 * @file services/authService.js
 * @description Simplified Authentication logic.
 * Handles user registration and login, associated with a specific Group.
 */

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';
import Group from '../models/group.js';

dotenv.config();
const isDev = process.env.NODE_ENV === 'development';
export const registerUser = async (req, res) => {
    try {
        const { firstName, surName, email, password } = req.body;
         console.log('firstName, surName, email, password ',  firstName, surName, email, password )

        // 1. Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ status: 'error', message: 'Email already in use.' });
        }

        // 2. Fetch the "system" group (since there is only one per DB)
        const systemGroup = await Group.findOne(); 
        
        if (!systemGroup) {
            return res.status(500).json({ 
                status: 'error', 
                message: "System Error: No group configuration found. Please initialize the system." 
            });
        }

        // 3. Hash password
        const hashPassword = await bcrypt.hash(password, 12);

        // 4. Create user linked to the found systemGroup.id
        const newUser = await User.create({
            firstName, 
            surName, 
            email, 
            password: hashPassword,
            groupId: systemGroup.id // Automatically links to the found group
        });

        res.status(201).json({ status: 'success', message: 'Account created successfully.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: error.message });
    }
};


export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
       
        
        // 1. Find the user
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ status: 'error', message: 'User not found.' });
        }

        // 2. Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ status: 'error', message: 'Incorrect password.' });
        }

        // 3. Generate Access Token only
        const payload = { 
            id: user.id, 
            groupId: user.groupId, 
            email: user.email 
        };

        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_KEY, { 
            expiresIn: '1h' 
        });

        const profile = await User.findOne({
            where: { id: user.id },
            attributes: ['profilePicture']
        });

        // 4. Return success response
        // No cookies set, as we are only using the Bearer token in headers
        return res.status(200).json({ 
            status: 'success', 
            message: 'Login successful.',
            profilePicture: profile.profilePicture,
            accessToken 
        });

    } catch (error) {
        console.error('Login Error:', error);
        return res.status(500).json({ status: 'error', message: 'Login failed.' });
    }
};