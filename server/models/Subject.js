import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    attended: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    type: { type: String, enum: ['Major', 'Minor', 'Practical'], default: 'Major' }
});

export default mongoose.model('Subject', subjectSchema);
