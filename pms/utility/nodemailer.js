var nodemail=require('nodemailer');
var sendgrid = require('nodemailer-sendgrid-transport');

 class nodemailer{

     static intilizeTransport()
    {
        return nodemail.createTransport(sendgrid({
            auth: {
                api_key:'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'
            }
        }))
    }
   /* static sendMail(data){
      return  nodemail.intilizeTransport().sendMail({
            from:'tomarsanju531@gmail.com',
            to:'data.to',
            subject:'data.subject',
            html:'data.html'
        })
    }*/
}
module.exports=nodemailer;