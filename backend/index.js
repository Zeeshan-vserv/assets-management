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
import serviceRoute from './routes/serviceRequestRoute.js'
import gatePass from './routes/gatePassRoute.js'
import softwareCategory from './routes/softwareCategoryRoute.js'
import storeLocation from './routes/storeLocationRoute.js'
import consumable from './routes/consumableRoute.js'
import condition from './routes/conditionRoute.js'
import gatePassAddress from './routes/gatePassAddressRoute.js'
import vendorCategory from './routes/vendorCategoryRoute.js'
import status from './routes/statusRoute.js'
import vendorServiceCategory from './routes/vendorServiceCategoryRoute.js'
import supportDepartment from './routes/supportDepartmentRoute.js'
import globalIncident from './routes/globalIncidentRoute.js'
import globalService from './routes/globalServiceRoute.js'
import sla from './routes/slaRoute.js'
import incidentStatus from './routes/incidentStatusRoute.js'
import roleRoute from './routes/roleRoute.js';
import acessRoute from './routes/acessRoute.js';
import dashboardRoute from './routes/dashboardRoute.js'
import vendorRoute from './routes/vendorRoute.js'
import slatatRoute from './routes/SLATATRoutes.js'

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

app.use('/uploads', express.static('uploads'));
app.use('/auth', authRoute)
app.use('/asset', assetRoute)
app.use('/component', componentRoute)
app.use('/department', departmentRoute)
app.use('/location', locationRoute)
app.use('/category', incidentCategoryRoute)
app.use('/incident', incidentRoute)
app.use('/service', serviceRoute)
app.use('/gatePass', gatePass)
app.use('/software', softwareCategory)
app.use('/storeLocation', storeLocation)
app.use('/consumable', consumable)
app.use('/condition', condition)
app.use('/gatePassAddress', gatePassAddress)
app.use('/vendorCategory', vendorCategory)
app.use('/status', status)
app.use('/vendorServiceCategory', vendorServiceCategory)
app.use('/supportDepartment', supportDepartment)
app.use('/globalIncident', globalIncident)
app.use('/globalService', globalService)
app.use('/sla', sla)
app.use('/incidentStatus', incidentStatus)
app.use('/role', roleRoute);
app.use('/access', acessRoute);
app.use('/dashboard', dashboardRoute)
app.use('/vendor', vendorRoute)
app.use('/slatat', slatatRoute)
