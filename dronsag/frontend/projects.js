const express = require('express');
const router = express.Router();
const db = require('../db'); // Állítsd be a saját adatbázis kapcsolatod elérési útját!

// GET /api/projects - Összes aktív munka lekérése a megrendelő nevével együtt
router.get('/', async (req, res) => {
    try {
        const [projects] = await db.query(`
            SELECT p.*, u.name AS customer_name 
            FROM projects p 
            JOIN users u ON p.user_id = u.id 
            WHERE p.status = 'active'
            ORDER BY p.created_at DESC
        `);
        res.json(projects);
    } catch (error) {
        console.error("Hiba a munkák lekérésekor:", error);
        res.status(500).json({ error: 'Belső szerverhiba történt a lekérdezés során.' });
    }
});

// POST /api/projects - Új munka feladása
router.post('/', async (req, res) => {
    const { user_id, title, description, category, location, budget_type, budget, deadline } = req.body;
    
    try {
        const [result] = await db.query(`
            INSERT INTO projects 
            (user_id, title, description, category, location, budget_type, budget, deadline) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [user_id, title, description, category, location, budget_type, budget, deadline]);
        
        res.status(201).json({ id: result.insertId, message: "Munka sikeresen létrehozva!" });
    } catch (error) {
        console.error("Hiba a munka létrehozásakor:", error);
        res.status(500).json({ error: 'Belső szerverhiba történt a mentés során.' });
    }
});

module.exports = router;