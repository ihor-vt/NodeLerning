import mongoose from 'mongoose';

const machineLogSchema = new mongoose.Schema({
    deviceitem_id: {
        type: String,
        required: true
    },
    counter: {
        type: Number,
        required: true
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: false },
    versionKey: false
});

const DeviceItemMongo = mongoose.model('MachineLog', machineLogSchema, 'DeviceItemMongo');

export default DeviceItemMongo;
