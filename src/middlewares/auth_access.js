const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  const access_token = req.signedCookies['access'];
  if(!access_token)
    res.redirect('/login');

  const [ token_name, token_value ] = access_token.split(' ');
  if(token_name !== 'Bearer'){
    res.redirect('/login');
  }
  await jwt.verify(token_value, process.env.JWT_SECRET, (err, decoded) => {
    if(err) res.redirect('/login')

    req.user_id = decoded.user_id
    next();
  });
  console.log(access_token)
}