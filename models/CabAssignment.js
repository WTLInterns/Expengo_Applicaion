const mongoose = require('mongoose');

const CabAssignmentSchema = new mongoose.Schema({
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver', // Reference to the Driver model
        required: true
    },
    cab: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CabDetails', // Reference to the Cab model
        required: true
    },
    assignedAt: {
        type: Date,
        default: Date.now // Timestamp when assigned
    },
    assignedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin", // Tracks which admin assigned the cab
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('CabAssignment',CabAssignmentSchema);
