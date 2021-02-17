const UsersModel = require('../models/UsersModel');
const Auth = require('../modules/auth_fields');
const path = require('path');
const jwt = require('jsonwebtoken');

class UsersController extends Auth{
  // ------------ loading views ---------------
  async home_page(req, res){
    res.render(path.resolve(__dirname, '..', 'views', 'home'));
  }
  async login_page(req, res){
    res.render(path.resolve(__dirname, '..', 'views', 'login'));
  }
  async panel(req, res){
    res.render(path.resolve(__dirname, '..', 'views', 'panel'));
  }
  async login(req, res){
    const data = {
      ...req.body
    }
    let errors = [];
    if(!data.user_email || !data.user_password){
      errors.push({ msg: 'Please fill in all fields' });
    }else{
      if(!this.auth_email(data.user_email)){
        errors.push({ msg: 'Invalid email' });
      }
    }
    if(errors.length > 0){
      return res.render(path.resolve(__dirname, '..', 'views', 'login'), {
        errors,
        user_name: data.user_name,
        user_password: data.user_password
      });
    }

    try{
      const user = await UsersModel.get_user_w_password(data.user_email);
      if(!user.length){
        errors.push({ msg: 'Wrong email' });
        return res.render(path.resolve(__dirname, '..', 'views', 'login'), {
          errors,
          user_email: data.user_email
        });
      }
      if(!await this.auth_password(data.user_password, user[0].user_password)){
        errors.push({ msg: 'Wrong password' });
        return res.render(path.resolve(__dirname, '..', 'views', 'login'), {
          errors,
          user_email: data.user_email
        });
      }
      const access_token = await jwt.sign({
        user_id: user[0].user_id,
        user_name: user[0].user_name
      }, process.env.JWT_SECRET, {expiresIn: '3h'});
      if(!access_token) {
        errors.push({ msg: 'Cannot redirect. An error has ocurred'});
        return res.render(path.resolve(__dirname, '..', 'views', 'login'), {
          errors
        });
      }
      res.cookie('access', 'Bearer ' + access_token, {
        maxAge: 1000 * 60 * 60,
        signed: true,
        secure: false
      });
      return res.redirect('/user/panel');
    }catch(err){
      return console.log(err);
    }
  }
}

module.exports = new UsersController();