const express = require('express');
const router = express.Router();
const ResetPasswordController = require('../controllers/ResetPasswordController');

// using bind so 'this' so the instance does not get lost and this can be referenced
router.get('/forgot_password', ResetPasswordController.forgot_password_page);

router.post('/forgot_password/send_email', ResetPasswordController.forgot_password.bind(ResetPasswordController));

router.get('/reset_password/:password_token/:user_id', ResetPasswordController.reset_password.bind(ResetPasswordController));

router.post('/reset_password/auth', ResetPasswordController.reset_password_auth.bind(ResetPasswordController));

module.exports = router;