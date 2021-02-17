const db = require('../database/database');

class UsersModel{
  async get_users(){
    try{
      return await db
      .select(['user_id', 'user_name', 'user_email'])
      .from('users')
    }catch(err){
      return console.log(err)
    }
  }
  async get_user_by_id(user_id){
    try{
      return await db
      .select(['user_id', 'user_name', 'user_email'])
      .from('users')
      .where({ user_id });
    }catch(err){
      return console.log(err);
    }
  }
  async get_user_by_email(user_email){
    try{
      return await db
      .select(['user_id', 'user_name', 'user_password'])
      .from('users')
      .where({ user_email });
    }catch(err){
      return console.log(err);
    }
  }
  async get_user_w_password(user_email){
    try{
      return await db
      .select(['user_id', 'user_email', 'user_password'])
      .from('users')
      .where({ user_email });
    }catch(err){
      return console.log(err);
    }
  }
  async get_user_password_tokens(user_id){
    try{
      return await db
      .select(['user_id', 'reset_password_token', 'reset_password_exp'])
      .from('users')
      .where({ user_id });
    }catch(err){
      return console.log(err);
    }
  }
  async save_user(data){
    try{
      return await db
      .insert(data)
      .into('users');
    }catch(err){
      return console.log(err);
    }
  }
  async update_user(user_id, data){
    try{
      return await db
      .table('users')
      .update(data)
      .where({ user_id });
    }catch(err){
      return console.log(err);
    }
  }
}

module.exports = new UsersModel();