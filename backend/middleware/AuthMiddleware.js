import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import AuthModel from '../models/authModel.js'

dotenv.config()
const secret = process.env.JWT_KEY

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]
        if (!token) {
            return res.status(401).json({ message: 'Token is not provided' })
        }

        const decoded = jwt.verify(token, secret)
        const user = await AuthModel.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = {
            id: user._id,
            userRole: user.userRole,
            emailAddress: user.emailAddress,
            ...user._doc
        };
        next()
    } catch (err) {
        console.log(err)
        return res.status(401).json({ message: 'Token is invalid' }) 
    }
}

export default authMiddleware