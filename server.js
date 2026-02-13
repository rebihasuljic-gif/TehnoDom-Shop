const express = require('express');
const cors = require('cors');

// Ovdje uvodimo rute 
const productRoutes = require('./routes/productRoutes'); 
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Glavna poruka da znamo da server radi
app.get('/', (req, res) => {
    res.send("<h1>Port 5000 radi.</h1>");
});

// POVEZIVANJE RUTA 
app.use('/api/proizvodi', productRoutes); // Ovo omogućava putanju /api/proizvodi
app.use('/api/korisnici', userRoutes);    // Ovo omogućava putanju /api/korisnici/login

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server radi na http://localhost:${PORT}`);
});