import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()
const secret = process.env.JWT_KEY

const authMiddleware = async (req, res, next) =>{
    try{
        const token = req.headers.authorization?.split(' ')[1]
        if(!token){
            return res.status(401).json({message: 'Token is not provided'})
        } 

        const decoded = jwt.verify(token, secret)
        req.body._id = decoded?._id
        next()
    } catch(err){
        console.log(err)
        return res.status(403).json({message: 'Token is invalid'})
    }
}

export default authMiddleware