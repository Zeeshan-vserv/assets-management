import GatePassAddressModel from "../models/gatePassAddressModel.js";

export const createGatePassAddress = async (req, res) =>{
    try {
        const { userId, addressName } = req.body;
        if(!userId){
            return res.status(404).json({ message: 'User not found'})
        }

        const lastAddress = await GatePassAddressModel.findOne().sort({ addressId: -1})
        const nextAddressId = lastAddress ? lastAddress.addressId + 1 : 1;

        const newAddress = new GatePassAddressModel({
            userId,
            addressId: nextAddressId,
            addressName
        })
        await newAddress.save();
        res.status(201).json({ success: true, data: newAddress, message: 'Gate Pass Address created successfully'})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error while creating Gate Pass Address'})
    }   
}

export const getAllGatePassAddress = async (req, res) => {
    try {
        const address = await GatePassAddressModel.find()
        res.status(200).json({ success: true, data: address})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error while fetching Gate Pass Addresses'})
    }
}

export const getGatePassAddressById = async (req, res) => {
    try {
        const { id } = req.params;
        const address = await GatePassAddressModel.findById(id);
        if(!address){
            return res.status(404).json({ success: false, message: 'Gate Pass Address not found'})
        }
        res.status(200).json({ success: true, data: address})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error while fetching Gate Pass Address'})
    }
}

export const updateGatePassAddress = async (req, res ) => {
    try {
        const { id } = req.params
        const addressData = await GatePassAddressModel.findByIdAndUpdate(id, req.body, { new: true})
        if(!addressData){
            return res.status(40).json({ success: false, message: 'Gate Pass Address not found'})
        }
        res.status(200).json({ success: true, data: addressData, message: 'Gate Pass Address updated successfully'})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error while updating Gate Pass Address'})
    }
}

export const deleteGatePassAddress = async (req, res) =>{
    try {
        const { id } = req.params
        const addressData = await GatePassAddressModel.findByIdAndDelete(id)
        if(!addressData){
            return res.status(40).json({ success: false, message: 'Gate Pass Address not found'})
        }
        res.status(200).json({ success: true, message: 'Gate Pass Address deleted successfully'})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error while updating Gate Pass Address'})
    }
}