const express = require('express');
const router = express.Router();
const RegisterController = require('../controllers/RegisterController');

router.get('/register', RegisterController.register_page);

router.post('/register/auth', RegisterController.register_auth.bind(RegisterController));

module.exports = router;