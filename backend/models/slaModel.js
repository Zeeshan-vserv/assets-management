import mongoose from 'mongoose';

const slaCreatetionSchema = new mongoose.Schema({
    userId: String,
    slaName: String,
    holidayCalender: String,
    default: Boolean,
    status: Boolean,
    serviceWindow: Boolean,
    slaTimeline: [
        {
            weekDay: String,
            startTime: Date,
            endTime: Date
        }
    ]
},{timestamps: true})

export const SLACreationModel = mongoose.model('SLACreation', slaCreatetionSchema);

const slaMappingSchema = new mongoose.Schema({
    userId: String,
    supportDepartment: String,
    slaName: String
}, {timestamps: true})

export const SLAMappingModel = mongoose.model('SLAMapping', slaMappingSchema);

const slaTimelineSchema = new mongoose.Schema({
    userId: String,
    priority: String,
    displayName: String,
    description: String,
    responseSLA: Date,
    resolutionSLA:Date,
    penality: String,
    stattus: Boolean
}, { timestamps: true});

export const SLATimelineModel = mongoose.model('SLATimeline', slaTimelineSchema)

const priorityMatrixSchema = new mongoose.Schema({
    userId: String,
    urgency: String,
    impact: String,
    priority: String
}, { timestamps: true});

export const PriorityMatrixModel = mongoose.model('PriorityMatrix', priorityMatrixSchema)

const holidayCalenderSchema = new mongoose.Schema({
    userId: String,
    holidayCalenderId: Number,
    holidayCalenderLocation: String
})

export const HolidayCalenderModel = mongoose.model('HolidayCalender', holidayCalenderSchema)

const holidayListSchema = new mongoose.Schema({
    userId: String,
    calenderName: String,
    holidayRemark: String,
    holidayDate: Date,
})

export const HolidayListModel = mongoose.model('HolidayList', holidayListSchema)
