const bcrypt = require('bcryptjs');

class Auth{
  auth_email(email){
    const reg = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    return reg.test(email);
  }
  async auth_password(password, hashPassword){
    try{
      return await bcrypt.compareSync(password, hashPassword)
    }catch(err){
      return console.log(err);
    }
  }
  password_match(password, confirm_password){
    return password === confirm_password;  
  }
}
module.exports = Auth;