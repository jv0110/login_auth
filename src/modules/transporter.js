const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');

class SendEmail{
  transport(){
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    const options = {
      viewEngine: {
        extName: '.hbs',
        layoutsDir: path.resolve('src/views/email_templates'),
        partialsDir: path.resolve('src/views/email_templates'),
        defaultLayout: undefined
      },
      viewPath: path.resolve('src/views/email_templates'),
      extName: '.hbs'
    }
    transporter.use('compile', hbs(options));

    return transporter;
  }
  async send_email(temp, data){
    return await this.transport().sendMail({
      from: '<satanas@outlook.com>',
      to: 'joaovitor32592@gmail.com',
      subject: 'Nodemailer test',
      text: 'Will it work or not?',
      template: temp,
      context: data
    });
  }
}
module.exports = SendEmail;