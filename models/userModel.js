const { db } = require('../database/db');
const path = require('path');

const createUser = async (userData) => {
    const connection = await db();
    const [result] = await connection.execute(
        'INSERT INTO user (name, email, password, registeredAt) VALUES (?, ?, ?, ?)',
        [userData.name, userData.email, userData.password, new Date()]
    );
    connection.end();
    return result;
};

const getUserByEmail = async (email) => {
    const connection = await db();
    const [rows] = await connection.execute('SELECT * FROM user WHERE email = ?', [email]);
    connection.end();
    return rows[0];
};

const getUserById = async (id) => {
    const connection = await db();
    const [rows] = await connection.execute('SELECT * FROM user WHERE id = ?', [id]);
    connection.end();
    return rows[0];
};


const updateUser = async (id, updates) => {
    const connection = await db();

    const fields = Object.keys(updates).map(field => `${field} = ?`).join(', ');
    const values = Object.values(updates);

    if (updates.photo) {
        const photo = updates.photo;

        // Validate file size (max 10 MB)
        const maxSize = 10 * 1024 * 1024; // 10 MB
        if (photo.size > maxSize) {
            throw new Error('File size exceeds 10 MB limit.');
        }

        // Validate file type (only accept .jpg and .png)
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(photo.mimetype)) {
            throw new Error('Invalid file type. Only JPG and PNG files are allowed.');
        }

        // Create a directory to store photos if not exists
        const uploadDir = path.join( 'uploads');

        // Generate unique filename
        const fileName = `${id}_${Date.now()}_${photo.name}`;
        const filePath = path.join(uploadDir, fileName);

        // Save photo to server
        await photo.mv(filePath);

        // Update user record in database with the file path
        const query = `UPDATE user SET photo = ? WHERE id = ?`;
        const [result] = await connection.execute(query, [filePath, id]);

        connection.end();
        return result;
    }

    if (values.length === 0) {
        throw new Error('No fields to update');
    }

    const query = `UPDATE user SET ${fields} WHERE id = ?`;
    const [result] = await connection.execute(query, [...values, id]);

    connection.end();
    return result;
};

const getAllUsers = async (offset, limit) => {
    const connection = await db();
    const [rows] = await connection.execute(
        'SELECT * FROM user ORDER BY registeredAt DESC LIMIT ? OFFSET ?',
        [limit, offset]
    );
    const [countRows] = await connection.execute('SELECT COUNT(*) AS count FROM user');
    const totalItems = countRows[0].count;
    connection.end();
    return { rows, totalItems };
};

module.exports = {
    createUser,
    getUserByEmail,
    getUserById,
    updateUser,
    getAllUsers
};
