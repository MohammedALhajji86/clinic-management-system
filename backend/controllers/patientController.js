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

module.exports = {
    createPatient
};