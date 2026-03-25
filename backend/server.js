const express = require('express');
const cors = require('cors');
require('dotenv').config(); 

const app = express();
const db = require('./config/db');

app.use(cors()); 
app.use(express.json()); 

const patientRoutes = require('./routes/patientRoutes');
const authRoutes = require('./routes/authRoutes'); 

app.use('/api/patients', patientRoutes);
app.use('/api/auth', authRoutes);


// app.get('/', (req, res) => {
//   res.send('مرحباً أحمد! سيرفر إدارة العيادة يعمل بنجاح 🚀');
// });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🔥 Server is running on port ${PORT}`);
});