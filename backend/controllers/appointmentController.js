const db = require('../config/db');

const createAppointment = async (req, res) => {
    try {
        const { patient_id, doctor_id, appointment_date } = req.body;

        if (!patient_id || !doctor_id || !appointment_date) {
            return res.status(400).json({ error: "Patient, Doctor, and Date are required!" });
        }

        const conflictCheck = await db.query(
            "SELECT * FROM appointments WHERE doctor_id = $1 AND appointment_date = $2",
            [doctor_id, appointment_date]
        );

        if (conflictCheck.rows.length > 0) {
            return res.status(400).json({ error: "This doctor is already booked at this specific time!" });
        }

        const newAppointment = await db.query(
            "INSERT INTO appointments (patient_id, doctor_id, appointment_date) VALUES ($1, $2, $3) RETURNING *",
            [patient_id, doctor_id, appointment_date]
        );

        res.status(201).json({
            message: "Appointment booked successfully!",
            appointment: newAppointment.rows[0]
        });

    } catch (error) {
        console.error("Error booking appointment:", error.message);
        res.status(500).json({ error: "Server error while booking appointment" });
    }
};

const getAllAppointments = async (req, res) => {
    try {
        const query = `
            SELECT 
                a.id, 
                p.name AS patient_name, 
                d.name AS doctor_name, 
                a.appointment_date, 
                a.status 
            FROM appointments a
            JOIN patients p ON a.patient_id = p.id
            JOIN doctors d ON a.doctor_id = d.id
            ORDER BY a.appointment_date ASC
        `;
        const result = await db.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching appointments:", error.message);
        res.status(500).json({ error: "Server error while fetching appointments" });
    }
};

module.exports = { createAppointment, getAllAppointments };