const { getUserById, updateUser, getAllUsers } = require('../models/userModel');

exports.getUser = async (req, res) => {
    try {
        const user = await getUserById(req.params.id);
        if (!user) {
            return res.status(404).send({ message: 'User Not found.' });
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.updateUser = async (req, res) => {
    const updates = {};

    if (req.body.name) updates.name = req.body.name;
    if (req.body.email) updates.email = req.body.email;
    if (req.body.surname) updates.surname = req.body.surname;
    if (req.body.gender) updates.gender = req.body.gender;
    if (req.body.photo) updates.photo = req.body.photo;

    try {
        const result = await updateUser(req.params.id, updates);
        if (result.affectedRows === 0) {
            return res.status(404).send({ message: 'User Not found.' });
        }
        res.status(200).send({ message: 'User was updated successfully.' });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};


exports.getAllUsers = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    try {
        const { rows, totalItems } = await getAllUsers(offset, limit);
        res.status(200).send({
            totalItems,
            users: rows,
            totalPages: Math.ceil(totalItems / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};
