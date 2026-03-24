const express = require('express');
const cors = require('cors');
require('dotenv').config(); 

// تهيئة التطبيق
const app = express();
// استدعاء ملف الاتصال بقاعدة البيانات
const db = require('./config/db');
// إعدادات الـ Middleware الأساسية
app.use(cors()); // السماح للفرونت اند بالاتصال
app.use(express.json()); // لكي يفهم السيرفر البيانات المرسلة بصيغة JSON

// تجربة بسيطة لنتأكد أن السيرفر يعمل
app.get('/', (req, res) => {
  res.send('مرحباً أحمد! سيرفر إدارة العيادة يعمل بنجاح 🚀');
});

// تحديد البورت الذي سيعمل عليه السيرفر
const PORT = process.env.PORT || 5000;

// تشغيل السيرفر
app.listen(PORT, () => {
  console.log(`🔥 Server is running on port ${PORT}`);
});