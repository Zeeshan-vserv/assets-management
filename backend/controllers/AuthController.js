import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import AuthModel from '../models/authModel.js';
import dotenv from 'dotenv';

dotenv.config();

export const signup = async (req, res) => {
    const { businessUnit, employeeName, employeeCode, grade, emailAddress, mobileNumber, designation, costCentre, location, subLocation, department, subDepartment, reportingManager, departmentHead, businessHead, vipUser, password, confirmPassword } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt); // Fix: Correct usage of bcrypt.hash

        const newSignup = new AuthModel({
            businessUnit,
            employeeName,
            employeeCode,
            grade,
            emailAddress,
            mobileNumber,
            designation,
            costCentre,
            location,
            subLocation,
            department,
            subDepartment,
            reportingManager,
            departmentHead,
            businessHead,
            vipUser,
            password: hashedPassword,
            confirmPassword: hashedPassword
        });

        const user = await newSignup.save();

        const token = jwt.sign({
            emailAddress: user.emailAddress,
            id: user._id,
        }, process.env.JWT_KEY, { expiresIn: '2h' });

        res.status(201).json({
            user,
            message: 'User registered successfully',
            token
        });
    } catch (error) {
        console.log("User not Created", error);
        res.status(400).json({ error: error.message });
    }
};

export const login = async (req, res) => {
    const { emailAddress, password } = req.body;

    try {
        const user = await AuthModel.findOne({ emailAddress });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        const token = jwt.sign({
            emailAddress: user.emailAddress,
            id: user._id,
        }, process.env.JWT_KEY, { expiresIn: '2h' });
        res.status(200).json({ user, token });
    } catch (error) {
        console.log("User not Authenticated", error);
        res.status(500).json({ success: false, message: 'Login Failed' + error.message });
    }
};

export const getUsers = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await AuthModel.findById(id);
        if (user) {
            const { password, confirmPassword, ...otherDetails } = user._doc;
            res.status(200).json(otherDetails);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateUser = async (req, res) => {
    const id = req.params.id;
    const { currentUserId, currentAdminStatus, password } = req.body;
    if (id === currentUserId || currentAdminStatus) { // Fix: Correct typo
        try {
            if (password) {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(password, salt);
            }
            const user = await AuthModel.findByIdAndUpdate(id, req.body, { new: true });
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    } else {
        res.status(403).json({ message: 'Unauthorized' }); // Fix: Add missing response
    }
};

export const deleteUser = async (req, res) => {
    const id = req.params.id;
    const { currentUserId, currentAdminStatus } = req.body;
    if (id === currentUserId || currentAdminStatus) {
        try {
            await AuthModel.findByIdAndDelete(id);
            res.status(200).json('User Deleted');
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    } else {
        res.status(403).json({ message: 'Unauthorized' }); // Fix: Add missing response
    }
};