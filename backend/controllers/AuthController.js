import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AuthModel from "../models/authModel.js";
import dotenv from "dotenv";
import xlsx from "xlsx";
import fs from "fs";
import nodemailer from "nodemailer";
import { getISTDate } from "../utils/dateUtils.js";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "vservit.icewarpcloud.in",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const signup = async (req, res) => {
  const { password, confirmPassword, ...userData } = req.body;

  try {
    if (password == confirmPassword) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newSignup = new AuthModel({
        ...userData,
        password: hashedPassword,
      });

      const user = await newSignup.save();

      const token = jwt.sign(
        {
          emailAddress: user.emailAddress,
          id: user._id,
        },
        process.env.JWT_KEY,
        { expiresIn: "2h" }
      );

      res.status(201).json({
        user,
        message: "User registered successfully",
        token,
      });

      //send email
      const loginUrl = process.env.VITE_FRONTEND_KEY;
      const mailOptions = {
        from: `"Vserv Infosystems Asset Management" <${process.env.EMAIL_USER}>`,
        to: user.emailAddress,
        subject: "Login Credentials",
        html: `
      <p>Dear ${user.employeeName},</p>
      <p>Your account has been successfully created.</p>
      <p>You can now login using your email: <strong>${user.emailAddress}</strong> and password: <strong>${password}</strong>.</p>
      <p><b>We recommend changing the password after your first login for security purposes.</b></p>
      <p>You can now log in using the following link: <a href="${loginUrl}" target="_blank">${loginUrl}</a></p>
      <p>Thank you,<br/>Vserv Team</p>
      `,
      };
      await transporter.sendMail(mailOptions);
    } else {
      res.status(400).json("Password and Confirm Password does not match");
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
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        emailAddress: user.emailAddress,
        id: user._id,
      },
      process.env.JWT_KEY,
      { expiresIn: "2h" }
    );

    // Remove sensitive fields
    const { password: pwd, confirmPassword, ...safeUser } = user._doc;

    res.status(200).json({ user: safeUser, token });
  } catch (error) {
    console.log("User not Authenticated", error);
    res
      .status(500)
      .json({ success: false, message: "Login Failed: " + error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const usersData = await AuthModel.find();
    if (usersData && usersData.length > 0) {
      const usersWithoutPasswords = usersData.map((user) => {
        const { password, confirmPassword, ...otherDetails } = user._doc;
        return otherDetails;
      });
      res.status(200).json(usersWithoutPasswords);
    } else {
      res.status(404).json({ message: "Users not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await AuthModel.findById(id);
    if (user) {
      const { password, confirmPassword, ...otherDetails } = user._doc;
      res.status(200).json(otherDetails);
    } else {
      res.status(404).json({ message: "User not found" });
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
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating user: " + error.message,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const userData = await AuthModel.findById(id);
    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, data: userData });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error while fetching user details" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await AuthModel.findByIdAndDelete(id);
    if (!deletedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: error.message,
    });
  }
};

export const uploadUsersFromExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    // Read the uploaded Excel file
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const users = xlsx.utils.sheet_to_json(sheet);

    // Prepare users for insertion
    const usersToInsert = await Promise.all(
      users.map(async (user) => {
        // Hash password if present
        let hashedPassword = user.password;
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          hashedPassword = await bcrypt.hash(user.password, salt);
        }
        return {
          ...user,
          password: hashedPassword,
        };
      })
    );

    // Insert users into DB
    await AuthModel.insertMany(usersToInsert);

    // Remove the uploaded file
    fs.unlinkSync(req.file.path);

    res
      .status(201)
      .json({ success: true, message: "Users uploaded successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to upload users",
      error: error.message,
    });
  }
};

// Add incident to user's history
export const addIncidentToUserHistory = async (userId, incidentId, status) => {
  const user = await AuthModel.findById(userId);
  if (user) {
    user.incidentHistory.push({
      incidentId,
      reportedAt: getISTDate(),
      status,
    });
    await user.save();
  }
};

// Add service request to user's history
export const addServiceRequestToUserHistory = async (userId, requestId, status) => {
  const user = await AuthModel.findById(userId);
  if (user) {
    user.serviceRequestHistory.push({
      requestId,
      requestedAt: getISTDate(),
      status,
    });
    await user.save();
  }
};

// When allocating an asset to a user
export const allocateAssetToUser = async (req, res) => {
  try {
    const { userId, assetId } = req.body;
    const user = await AuthModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.assetAllocationHistory.push({
      assetId,
      allocatedAt: getISTDate(),
      status: "Allocated",
    });
    await user.save();
    res
      .status(200)
      .json({ success: true, message: "Asset allocated and history updated" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error allocating asset", error: error.message });
  }
};

// When deallocating an asset from a user
export const deallocateAssetFromUser = async (req, res) => {
  try {
    const { userId, assetId } = req.body;
    const user = await AuthModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const history = user.assetAllocationHistory.find(
      (h) => h.assetId.toString() === assetId && !h.deallocatedAt
    );
    if (history) {
      history.deallocatedAt = getISTDate();
      history.status = "Deallocated";
      await user.save();
      res
        .status(200)
        .json({ success: true, message: "Asset deallocated and history updated" });
    } else {
      res.status(404).json({ message: "Allocation record not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deallocating asset", error: error.message });
  }
};

// Get allocated asset history by user ID
export const getAssetAllocationHistoryByUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await AuthModel.findById(id).select('assetAllocationHistory');
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, data: user.assetAllocationHistory });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching asset allocation history", error: error.message });
  }
};

// Get incident history by user ID
export const getIncidentHistoryByUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await AuthModel.findById(id).select('incidentHistory');
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, data: user.incidentHistory });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching incident history", error: error.message });
  }
};

// Get service request history by user ID
export const getServiceRequestHistoryByUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await AuthModel.findById(id).select('serviceRequestHistory');
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, data: user.serviceRequestHistory });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching service request history", error: error.message });
  }
};