const db = require('../config/db');

const getAllDoctors = async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM doctors");
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching doctors:", error.message);
        res.status(500).json({ error: "Server error while fetching doctors" });
    }
};

module.exports = { getAllDoctors };