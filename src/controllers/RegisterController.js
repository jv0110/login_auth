const UsersModel = require('../models/UsersModel');
const Auth = require('../modules/auth_fields');
const path = require('path');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

class RegisterController extends Auth{
  // ------------ loading views ---------------
  async home_page(req, res){
    res.render(path.resolve(__dirname, '..', 'views', 'home'));
  }
  async register_page(req, res){
    res.render(path.resolve(__dirname, '..', 'views', 'register'));
  }
  // ------------------------------------------
  async register_auth(req, res){
    const data = {
      ...req.body,
      createdAt: new Date()
    }
    let errors = [];

    if(!data.user_name){
      errors.push({ msg: 'Invalid name' })
    }else if(!data.user_email){
      errors.push({ msg: 'Invalid email' })
    }else if(!data.user_password){
      errors.push({ msg: 'Invalid password' })
    }else if(!data.confirm_password){
      errors.push({ msg: 'Password do not match' });
    }else{
      if(!this.auth_email(data.user_email)){
        errors.push({ msg: 'Invalid email' });
      }
      if(data.user_password.length < 8){
        errors.push({ msg: 'Password too short' });
      }
      if(data.user_password !== data.confirm_password){
        errors.push({ msg: 'passwords do not match' });
      }
    }
    
    if(errors.length > 0){
      return res.render(path.resolve(__dirname, '..', 'views', 'register'), {
        errors,
        user_name: data.user_name,
        user_email: data.user_email,
        user_password: data.user_password
      });
    }
    try{
      const email_exists = await UsersModel.get_user_by_email(data.user_email);
      if(email_exists.length){
        errors.push({ err: 'Email already exists' });
        res.render(path.resolve(__dirname, '..', 'views', 'register'), {
          errors,
          user_name: data.user_name,
          user_email: data.user_email,
          user_password: data.user_password
        });
      }
      // ------ generating user id -----
      const user_id = crypto.randomBytes(16).toString('hex');
      if(!user_id) return console.log('error');

      data.user_id = user_id;
      // ------ generating password hash -----
      const salt = await bcrypt.genSaltSync(16);
      const hash = await bcrypt.hashSync(data.user_password, salt);
      if(!salt || !hash){
        errors.push({ msg: 'Error saving the password' });
        return res.render(path.resolve(__dirname, '..', 'views', 'register'), {
          errors,
          user_name: data.user_name,
          user_email: data.user_email
        });
      }
      
      data.user_password = hash;
      // deleting confirm_password from data object
      delete data.confirm_password;

      const save = await UsersModel.save_user(data);
      if(!save){
        errors.push({ msg: 'Error saving the user' });
        return res.render(path.resolve(__dirname, '..', 'views', 'register'), {
          errors,
          user_name: data.user_name,
          user_email: data.user_email,
          user_password: data.user_password
        });
      }
      req.flash('success_msg', 'You have registered successfully!');
      return res.redirect('/login');
    }catch(err){
      return console.log(err);
    }
  }
}

module.exports = new RegisterController();