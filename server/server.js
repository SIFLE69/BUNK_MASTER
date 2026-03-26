import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Subject from './models/Subject.js';
import Timetable from './models/Timetable.js';
import auth from './middleware/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Cluster Handshake: SUCCESS (MongoDB Connected)'))
    .catch(err => console.error('Cluster Fault:', err));

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        let user = await User.findOne({ username });
        if (user) return res.status(400).json({ msg: 'Identity already exists' });

        user = new User({ username, password });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
        res.json({ token, user: { id: user._id, username: user.username } });
    } catch (err) {
        res.status(500).send('Registry Failure');
    }
});

app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ msg: 'Invalid Identity' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Access Denied: Invalid Credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
        res.json({ token, user: { id: user._id, username: user.username } });
    } catch (err) {
        res.status(500).send('Auth Engine Failure');
    }
});

// Subject Routes (Protected)
app.get('/api/subjects', auth, async (req, res) => {
    try {
        const subjects = await Subject.find({ userId: req.user.id });
        res.json(subjects);
    } catch (err) {
        res.status(500).send('Data Retrieval Error');
    }
});

app.post('/api/subjects', auth, async (req, res) => {
    const { name, attended, total, type } = req.body;
    try {
        const newSub = new Subject({ userId: req.user.id, name, attended, total, type });
        const sub = await newSub.save();
        res.json(sub);
    } catch (err) {
        res.status(500).send('Write Error');
    }
});

app.put('/api/subjects/:id', auth, async (req, res) => {
    try {
        let sub = await Subject.findById(req.params.id);
        if (!sub) return res.status(404).json({ msg: 'Module not found' });
        if (sub.userId.toString() !== req.user.id) return res.status(401).json({ msg: 'Unauthorized' });

        sub = await Subject.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.json(sub);
    } catch (err) {
        res.status(500).send('Update Error');
    }
});

app.delete('/api/subjects/:id', auth, async (req, res) => {
    try {
        const sub = await Subject.findById(req.params.id);
        if (!sub) return res.status(404).json({ msg: 'Module not found' });
        if (sub.userId.toString() !== req.user.id) return res.status(401).json({ msg: 'Unauthorized' });

        await Subject.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Module Extracted' });
    } catch (err) {
        res.status(500).send('Deletion Failure');
    }
});

// Timetable Routes (Protected)
app.get('/api/timetable', auth, async (req, res) => {
    try {
        const timetable = await Timetable.findOne({ userId: req.user.id });
        const emptySchedule = {
            Monday: { slot1: [], slot2: [], slot3: [] },
            Tuesday: { slot1: [], slot2: [], slot3: [] },
            Wednesday: { slot1: [], slot2: [], slot3: [] },
            Thursday: { slot1: [], slot2: [], slot3: [] },
            Friday: { slot1: [], slot2: [], slot3: [] },
            Saturday: { slot1: [], slot2: [], slot3: [] }
        };
        res.json(timetable ? timetable.schedule : emptySchedule);
    } catch (err) {
        res.status(500).send('Schedule Retrieval Error');
    }
});

app.post('/api/timetable', auth, async (req, res) => {
    const { schedule } = req.body;
    try {
        let timetable = await Timetable.findOne({ userId: req.user.id });
        if (timetable) {
            timetable.schedule = schedule;
            await timetable.save();
        } else {
            timetable = new Timetable({ userId: req.user.id, schedule });
            await timetable.save();
        }
        res.json(timetable.schedule);
    } catch (err) {
        res.status(500).send('Schedule Sync Failure');
    }
});

// app.listen(PORT, () => console.log(`Strategic Payload Ops Server: ONLINE on port ${PORT}`));
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    app.listen(PORT, () => console.log(`Strategic Payload Ops Server: ONLINE on port ${PORT}`));
}

export default app;
