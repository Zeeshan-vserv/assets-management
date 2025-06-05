import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import AuthModel from '../models/authModel.js';
import dotenv from 'dotenv';

dotenv.config();

export const signup = async (req, res) => {
    const { password, confirmPassword, ...userData } = req.body;

    try {
        if(password == confirmPassword){
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt); 
        
            const newSignup = new AuthModel({
                ...userData,
                password: hashedPassword,
            });
            
            const user = await newSignup.save();

            const token = jwt.sign({
                emailAddress: user.emailAddress,
                id: user._id,
            }, process.env.JWT_KEY, { expiresIn: '2m' });

            res.status(201).json({
                user,
                message: 'User registered successfully',
                token
            });
        } else {
            res.status(400).json("Password and Confirm Password does not match")
        }
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
        }, process.env.JWT_KEY, { expiresIn: '2m' });

        // Remove sensitive fields
        const { password: pwd, confirmPassword, ...safeUser } = user._doc;

        res.status(200).json({ user: safeUser, token });
    } catch (error) {
        console.log("User not Authenticated", error);
        res.status(500).json({ success: false, message: 'Login Failed: ' + error.message });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const usersData = await AuthModel.find();
        if (usersData && usersData.length > 0) {
            const usersWithoutPasswords = usersData.map(user => {
                const { password, confirmPassword, ...otherDetails } = user._doc;
                return otherDetails;
            });
            res.status(200).json(usersWithoutPasswords);
        } else {
            res.status(404).json({ message: 'Users not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getUser = async (req, res) => {
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
  try {
    const { id } = req.params;
    const { _id, ...updateUserData } = req.body;
    const updatedUser = await AuthModel.findByIdAndUpdate(id, updateUserData, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error updating PO: " + error.message });
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
        res.status(403).json({ message: 'Unauthorized' });
    }
};