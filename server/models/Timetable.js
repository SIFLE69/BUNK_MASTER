import mongoose from 'mongoose';

const daySchema = new mongoose.Schema({
    slot1: [String], // 08:30 - 10:30
    slot2: [String], // 10:45 - 12:45
    slot3: [String]  // 01:30 - 03:30
}, { _id: false });

const timetableSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    schedule: {
        Monday: { type: daySchema, default: () => ({ slot1: [], slot2: [], slot3: [] }) },
        Tuesday: { type: daySchema, default: () => ({ slot1: [], slot2: [], slot3: [] }) },
        Wednesday: { type: daySchema, default: () => ({ slot1: [], slot2: [], slot3: [] }) },
        Thursday: { type: daySchema, default: () => ({ slot1: [], slot2: [], slot3: [] }) },
        Friday: { type: daySchema, default: () => ({ slot1: [], slot2: [], slot3: [] }) },
        Saturday: { type: daySchema, default: () => ({ slot1: [], slot2: [], slot3: [] }) }
    }
});

export default mongoose.model('Timetable', timetableSchema);
