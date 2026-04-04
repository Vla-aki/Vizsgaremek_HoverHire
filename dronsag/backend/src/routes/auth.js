const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Adatbázis kapcsolat (ugyanaz a beállítás, mint a többi fájlodban)
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'dronsag_mysql',
    user: process.env.DB_USER || 'dronsag_user',
    password: process.env.DB_PASSWORD || 'dronsag_password',
    database: process.env.DB_NAME || 'dronsag',
    waitForConnections: true,
    connectionLimit: 10
});

// POST /api/auth/register - Regisztráció ÉS Automatikus bejelentkezés
router.post('/register', async (req, res) => {
    const { name, email, password, role, phone } = req.body;

    try {
        // 1. Ellenőrizzük, hogy létezik-e már az email
        const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'Ez az email cím már foglalt!' });
        }

        // 2. Jelszó titkosítása
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Új felhasználó beszúrása
        const [result] = await pool.query(
            'INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)',
            [name, email, hashedPassword, role, phone || null]
        );

        const newUserId = result.insertId;

        // 4. Token generálása (ugyanaz a folyamat, mint bejelentkezéskor)
        const token = jwt.sign(
            { id: newUserId, role: role },
            process.env.JWT_SECRET || 'titkos_kulcs', // Ezt a .env-ből kellene venni ideális esetben
            { expiresIn: '1d' }
        );

        // 5. Válasz visszaküldése a token-nel együtt
        res.status(201).json({
            message: 'Sikeres regisztráció!',
            token: token,
            user: { id: newUserId, name, email, role }
        });
    } catch (error) {
        console.error('❌ Regisztrációs hiba:', error);
        res.status(500).json({ message: 'Szerver hiba a regisztráció során.' });
    }
});

// POST /api/auth/login - Hagyományos bejelentkezés
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) return res.status(401).json({ message: 'Hibás email vagy jelszó!' });

        const user = users[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: 'Hibás email vagy jelszó!' });

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'titkos_kulcs', { expiresIn: '1d' });

        res.json({ message: 'Sikeres bejelentkezés!', token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        console.error('❌ Bejelentkezési hiba:', error);
        res.status(500).json({ message: 'Szerver hiba a bejelentkezés során.' });
    }
});

// GET /api/auth/pilots - Összes pilóta lekérése (Keresőhöz és Landing page-hez)
router.get('/pilots', async (req, res) => {
    try {
        const query = `
            SELECT id, name, location, hourly_rate as hourlyRate, availability, 
                   completed_jobs as completedProjects, rating, reviews_count as reviews, 
                   verified, profile_image as image, bio as description, member_since as memberSince
            FROM users 
            WHERE role = 'driver'
            ORDER BY rating DESC, completed_jobs DESC
        `;
        const [pilots] = await pool.query(query);

        // Készségek és adatok formázása minden pilótához
        for (let pilot of pilots) {
            const [skills] = await pool.query('SELECT skill FROM user_skills WHERE user_id = ?', [pilot.id]);
            pilot.skills = skills.map(s => s.skill);
            if (!pilot.image) {
                pilot.image = `https://ui-avatars.com/api/?name=${encodeURIComponent(pilot.name)}&background=2563eb&color=fff`;
            }
            pilot.verified = pilot.verified === 1;
            pilot.featured = pilot.rating >= 4.8;
            pilot.memberSince = pilot.memberSince ? new Date(pilot.memberSince).toLocaleDateString('hu-HU') : 'Ismeretlen';
        }

        res.json({ success: true, pilots });
    } catch (error) {
        console.error('❌ Pilóták lekérési hiba:', error);
        res.status(500).json({ message: 'Szerver hiba a pilóták lekérésekor.' });
    }
});

module.exports = router;