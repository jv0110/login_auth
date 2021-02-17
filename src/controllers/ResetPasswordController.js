const db = require('../models/UsersModel');
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const SendMail = require('../modules/transporter');
const Auth = require('../modules/auth_fields');

class ResetPassword extends SendMail{
  constructor(){
    super(),
    this.auth = new Auth()
  }
  // -----------------------------------------------------------------
  async gen_reset_token(){
    return await crypto.randomBytes(16).toString('hex');
  }
  // -----------------------------------------------------------------
  async forgot_password_page(req, res){
    res.render(path.resolve(__dirname, '..', 'views', 'forgot_password'));
  }
  // -----------------------------------------------------------------
  async forgot_password(req, res){
    const data = {
      ...req.body
    };
    const errors = [];

    if(!data.user_email){
      errors.push({ msg: 'Please pass in an email' });
      return res.render(path.resolve(__dirname, '..', 'views', 'forgot_password'), {
        errors,
        user_email: data.user_email
      })
    }
    try{
      const user = await db.get_user_by_email(data.user_email);
      if(!user.length){
        errors.push({ msg: 'Email does not exist' });
        return res.render(path.resolve(__dirname, '..', 'views', 'forgot_password'), {
          errors,
          user_email: data.user_email
        });
      }
      // set recovery password token and expiration time
      data.reset_password_token = await this.gen_reset_token();
      data.reset_password_exp = new Date();
      data.reset_password_exp.setHours(data.reset_password_exp.getHours() + 1);

      if(!data.reset_password_token){
        req.flash('error_msg', 'Error sending the redefining email');
        return res.redirect('/forgot_password');
      }

      const update = await db.update_user(user[0].user_id, data);
      if(!update){
        req.flash('error_msg', 'Error sending the redefining email');
        return res.redirect('/forgot_password');
      }
      if(!await this.send_email('recover_password', {
        reset_password_token: data.reset_password_token,
        user_id: user[0].user_id
      })){
        req.flash('error_msg', 'Error sending the redefining email');
        return res.redirect('/forgot_password');
      }
      req.flash('success_msg', 'Email was sent :)');
      return res.redirect('/forgot_password');
    }catch(err){
      return console.log(err);
    }
  }
  // -----------------------------------------------------------------
  async reset_password(req, res){
    const { password_token, user_id } = req.params;
    if(!id || !user_id) return res.redirect('/');

    try{
      const user = await db.get_user_password_tokens(user_id);
      if(!user.length) return res.redirect('/');

      if(user[0].reset_password_token !== password_token){
        req.flash('error_msg', 'redefinition token is invalid, please send another redefinition email');
        return res.redirect('/forgot_password')
      }
      if(new Date() > user[0].reset_password_exp){
        req.flash('error_msg', 'redefinition token has expired, please send another redefinition email');
        return res.redirect('/forgot_password')
      }
      return res.render(path.resolve(__dirname, '..', 'views', 'reset_password'), {
        user_id,
        password_token
      });
    }catch(err){
      return console.log(err);
    }
  }
  // -----------------------------------------------------------------
  async reset_password_auth(req, res){
    const data = {
      ...req.body,
      updatedAt: new Date()
    }
    let errors = [];

    if(!data.user_password || !data.confirm_password){
      errors.push({ msg: 'Invalid password' });
      return res.render(path.resolve(__dirname, '..', 'views', 'reset_password'), {
        errors,
        user_id: data.user_id,
        password_token: data.password_token
      });
    }

    if(!this.auth.password_match(data.user_password, data.confirm_password)){
      errors.push({ msg: 'Passwords do not match' });
      return res.render(path.resolve(__dirname, '..', 'views', 'reset_password'), {
        errors,
        user_id: data.user_id,
        password_token: data.password_token
      });
    }
    try{
      const salt = await bcrypt.genSaltSync(16);
      const hash = await bcrypt.hashSync(data.user_password, salt);
      if(!salt || !hash){
        req.flash('error_msg', 'Error saving the password');
        return res.redirect('/reset_password/' + token_expires + '/' + user_id);
      }
      data.user_password = hash;
      const { user_id } = data;
      const { password_token } = data;
      // Removing data that won't be saved nor updated in the database
      delete data.confirm_password;
      delete data.user_id;
      delete data.token_expires;
      delete data.password_token;

      const update_password = await db.update_user(user_id, data);
      if(!update_password){
        req.flash('error_msg', 'Error saving the password');
        return res.redirect('/reset_password/' + password_token + '/' + user_id);
      }
      req.flash('success_msg', 'Your password has been changed :)');
      return res.redirect('/login');
    }catch(err){
      return console.log(err);
    }
  }
}

module.exports = new ResetPassword();