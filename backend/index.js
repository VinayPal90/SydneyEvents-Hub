import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cron from 'node-cron';
import Event from './models/Event.js';
import Interest from './models/Interest.js';
import session from 'express-session';
import passport from './config/passport.js';

// Humare custom imports
import { syncEventsToDB } from './utils/syncEvents.js';

dotenv.config();

const app = express();

// Middleware
// Deployment ke waqt FRONTEND_URL .env se uthayega
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173'
}));
app.use(express.json());

// MongoDB Connection aur Initial Sync
mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log("✅ MongoDB Connected Successfully");
        
        // Requirement: Scrape -> Store -> Display pipeline demonstrate karna hai 
        console.log("🔄 Starting Initial Event Sync...");
        await syncEventsToDB(); 
    })
    .catch(err => {
        console.error("❌ MongoDB Connection Error:", err.message);
    });

// 1. Requirement: Automatic Updates [cite: 7, 24]
// Har 6 ghante mein scraper chalega (Cron Job)
cron.schedule('0 */6 * * *', async () => {
    console.log('⏰ Running scheduled event sync...');
    await syncEventsToDB();
});

// Basic Route testing ke liye
app.get('/', (req, res) => {
    res.send("Sydney Event Tracker API is running...");
});

// Manual Sync Route (Testing ke liye aasan rahega)
app.get('/api/sync-now', async (req, res) => {
    try {
        await syncEventsToDB();
        res.status(200).json({ message: "Sync triggered successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all events route 
app.get('/api/events', async (req, res) => {
    const events = await Event.find().sort({ dateTime: 1 });
    res.json(events);
});

app.post('/api/interest', async (req, res) => {
    try {
        const { email, consent, eventId } = req.body;
        const newInterest = new Interest({ email, consent, eventId });
        await newInterest.save(); // [cite: 41]
        res.status(201).json({ message: "Interest saved successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Middleware
app.use(session({ 
    secret: process.env.SESSION_SECRET, 
    resave: false, 
    saveUninitialized: true 
}));
app.use(passport.initialize());
app.use(passport.session());

// Auth Routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login-failed' }),
  (req, res) => {
    // Successful login -> Dashboard par bhej do
    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  });

app.get('/api/current-user', (req, res) => {
    res.send(req.user || null);
});

// 1. Dashboard Events with Filters [cite: 50, 51, 52, 53]
app.get('/api/admin/events', async (req, res) => {
    const { city, search, status } = req.query;
    let query = {};
    
    if (city) query.city = city;
    if (status) query.status = status;
    if (search) {
        query.title = { $regex: search, $options: 'i' }; // Keyword search [cite: 52]
    }

    try {
        const events = await Event.find(query).sort({ lastScrapedAt: -1 });
        res.json(events);
    } catch (err) {
        res.status(500).send(err);
    }
});

// 2. Import Action [cite: 60, 61, 62]
app.patch('/api/events/:id/import', async (req, res) => {
    try {
        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id,
            { 
                status: 'imported', 
                importedAt: new Date(),
                importedBy: req.user?.displayName || 'Admin' 
            },
            { new: true }
        );
        res.json(updatedEvent);
    } catch (err) {
        res.status(500).send(err);
    }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});