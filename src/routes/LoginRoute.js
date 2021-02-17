const express = require('express');
const router = express.Router();
const LoginController = require('../controllers/LoginController');
const auth_access = require('../middlewares/auth_access');

router.get('/', LoginController.home_page);

router.get('/login', LoginController.login_page);

router.post('/login/auth', LoginController.login.bind(LoginController));

router.get('/user/panel', auth_access, LoginController.panel);

module.exports = router;