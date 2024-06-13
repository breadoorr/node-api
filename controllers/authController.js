const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, getUserByEmail } = require('../models/userModel');

exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashedPassword = bcrypt.hashSync(password, 8);
        await createUser({ name, email, password: hashedPassword });
        res.status(201).send({ message: "User was registered successfully!" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(404).send({ message: 'User Not found.' });
        }

        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) {
            return res.status(401).send({ message: 'Invalid Password!' });
        }

        const token = jwt.sign({ id: user.id }, process.env.SECRET, {
            expiresIn: 86400 // 24 hours
        });

        res.status(200).send({ id: user.id, email: user.email, accessToken: token });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};
