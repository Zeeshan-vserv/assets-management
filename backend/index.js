import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import path from 'path'

// import authRoute from './routes/authRoute'
import authRoute from './routes/authRoute.js'
import assetRoute from './routes/assetRoute.js'
import componentRoute from './routes/componentRoute.js'
import departmentRoute from './routes/departmentRoute.js'
import locationRoute from './routes/locationRoute.js'
import incidentCategoryRoute from './routes/incidentCategoryRoute.js'
import incidentRoute from './routes/incidentRoute.js'

const app = express()

app.use(bodyParser.json({limit: '30mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '30mb', extended: true}))
app.use(cors())

mongoose.connect(process.env.MONGODB, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    app.listen(process.env.PORT, ()=> console.log(`Serverv is running at port ${process.env.PORT}`))
})

.catch((error)=>{
    console.error('MongoDB Connection Error',error)
})

app.use('/auth', authRoute)
app.use('/asset', assetRoute)
app.use('/component', componentRoute)
app.use('/department', departmentRoute)
app.use('/location', locationRoute)
app.use('/category', incidentCategoryRoute)
app.use('/incident', incidentRoute)
