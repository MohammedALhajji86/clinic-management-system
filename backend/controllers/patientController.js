const db = require('../config/db');

const createPatient = async (req, res) => {
    try {
        const { name, age, phone } = req.body;

        if (!name || !age) {
            return res.status(400).json({ error: "the name and age are required" });
        }

        const newPatient = await db.query(
            "INSERT INTO patients (name, age, phone) VALUES ($1, $2, $3) RETURNING *",
            [name, age, phone]
        );

        res.status(201).json({
            message: "the patient has been created successfully",
            patient: newPatient.rows[0]
        });

    } catch (error) {
        console.error("Error creating patient:", error.message);
        res.status(500).json({ error: "an error occurred while creating the patient" });
    }
};

const getAllPatients = async (req, res) => {
    try {
        const allPatients = await db.query("SELECT * FROM patients ORDER BY created_at DESC");
        
        res.status(200).json(allPatients.rows);
    } catch (error) {
        console.error("Error fetching patients:", error.message);
        res.status(500).json({ error:  "an error occurred while fetching the patients" });
    }
};

module.exports = {
    createPatient,
    getAllPatients
};
