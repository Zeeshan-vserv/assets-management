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

        // Fetch user from DB using ID from JWT
        const user = await AuthModel.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = {
            id: decoded.id,
            emailAddress: user.emailAddress,
            isAdmin: decoded.isAdmin || false // set this if you have admin logic
        }
        next()
    } catch (err) {
        console.log(err)
        return res.status(403).json({ message: 'Token is invalid' })
    }
}

export default authMiddleware