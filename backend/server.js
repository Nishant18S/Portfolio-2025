require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/visitorCounter', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Visitor Count Schema
const visitorCountSchema = new mongoose.Schema({
  count: { type: Number, default: 350 } // Starts at 350
});
const VisitorCount = mongoose.model('VisitorCount', visitorCountSchema);

// API Routes
app.get('/api/visitors', async (req, res) => {
  try {
    let data = await VisitorCount.findOne();
    if (!data) data = await VisitorCount.create({});
    res.json({ count: data.count });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.post('/api/visitors/increment', async (req, res) => {
  try {
    let data = await VisitorCount.findOne();
    if (!data) {
      data = await VisitorCount.create({ count: 351 });
    } else {
      data.count += 1;
      await data.save();
    }
    res.json({ count: data.count });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
mongoose.connection.on('connected', () => {
    console.log('✅ MongoDB connected successfully!');
  });
  
  mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });