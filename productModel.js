const db = require('../config/db');

const Product = {
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM proizvodi');
        return rows;
    }
};

module.exports = Product;