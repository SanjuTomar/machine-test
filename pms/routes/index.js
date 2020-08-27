var express = require('express');
var multer= require('multer');
var path=require('path');
var formidable=require('formidable');
var fs = require('fs');

var jsonwebtoken=require('jsonwebtoken');
const {check, validationResult}=require('express-validator');

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}


var router = express.Router();
var usermodule=require('../module/user')
var uploadmodule=require('../module/upload');
var nodemailer=require('../utility/nodemailer');
var imagedata= uploadmodule.find({});
var list=usermodule.find({});
router.use(express.static(__dirname + "./public/"))
var Storage=multer.diskStorage({
  destination:"./public/uploads/",
  filename:(req,file,cb)=>{
    cb(null,file.fieldname+""+Date.now()+path.extname(file.originalname));
  }
})
var upload= multer({
  storage:Storage
}).single('file');
function checktoken()
{
  var token1=localStorage.getItem('userToken');
  console.log("token1 value--->"+token1)
  if(token1!=null)
  {
    return true;

  }
  else
  {
    return false;
  }
}
/* GET home page. */
function createDomainCookie(value,  maxAgeInMinutes) {
  var time = ZonedDateTime.now().plusMinutes(maxAgeInMinutes);
  var expiry = time.toInstant().toEpochMilli();
 newCookie = new NewCookie("name", value, "/", null, Cookie.DEFAULT_VERSION,null, 12*60, expiry, false, false);
  return newCookie;
}
router.get('/', function(req, res, next) {
  res.render('index',{titel:"password management system", msg:''})
});
router.post('/', function(req, res, next) {
  var email=req.body.loginid;
  //console.log(loginid)
  var password=req.body.password;
  var checkUser=usermodule.findOne({email:email})
  checkUser.exec((err,data)=>{
    if(data==null)
    {
      res.render('index', { title: 'user Management System', token:token, msg:"Invalid Username and Password." });
    }
    else
    {
      if(err)throw err;

    var userid=data._id;
    console.log(userid) 
    var name=data.name; 
     if(userid!=null)
    {
    var token=jsonwebtoken.sign({userId:userid},'loginid');
    console.log("token---->"+token)
    
    localStorage.setItem('userToken',token)
    localStorage.setItem('username1',name)
    res.redirect('/dashboard')
    }
    else  {
      res.render('index',{titel:"user management system", msg:'Welcome user'})
    }
    }
  })
});

function checkEamil(req,res,next){
  var email=req.body.email;
  var checkexisstEmail=usermodule.findOne({email:email})
  checkexisstEmail.exec((err,data)=>{
    if(err) throw err;
    if(data)
    {
      return res.render('registration',{titel:"user management system", msg:'email already exist'})
    }
    next();
  })
}
router.get('/logout',function(req,res,next){
  localStorage.removeItem('userToken');
  localStorage.removeItem('username1')
  res.redirect('/');
}) 
router.get('/userlist',function(req,res,next){
  if(checktoken()==true)
  {
  list.exec(function(err,data){
     if(err) throw err;
     else{
       res.render('userlist',{title:"user management system",msg:"user list",data:data})
      console.log("data is-->"+data)
     }
   })
  }
  else
  {
    res.redirect('/');
  }
 });
 router.get('/delete/:id',function(req,res){
   var id=req.params.id;
   var del=usermodule.findByIdAndDelete(id);
   del.exec(function(err,data){
     if (err)throw err;
     res.redirect('/userlist');
   })
 });
router.get('/edit/:id',function(req,res,next){
  var id=req.params.id;
  var upd=usermodule.findById(id);
  upd.exec(function(err,data){
    if(err) throw err;
    res.render('edit',{msg:"",records:data}) 
  })
   

});
router.post('/edit/',function(req,res,next){
  
  var updat=usermodule.findByIdAndUpdate(req.body.id,{
    name:req.body.name,
    email:req.body.email,
    password:req.body.password,
    role:req.body.role,
    mob:req.body.mob
 })
 updat.exec(function(err,data){
   if(err)throw err;
   res.redirect('/userlist');
 })
})

router.get('/dashboard',function(req,res,next){
  if(checktoken()==true)
  {
  var username=localStorage.getItem('username1')
  console.log("dashboardis--->"+username)
  res.render('dashboard',{title:"password management system", username:username, msg:''})
  }
  else{
    res.redirect('/');
  }
}); 

router.get('/registration',function(req,res,next){
  res.render('registration',{title:"password management system", msg:''})
});
router.post('/registration',upload,checkEamil, function(req,res,next){
  
  var name=req.body.name;
  
  var email=req.body.email;
  var password=req.body.password;
  console.log(password)
  var confirm_password=req.body.confirm_password;
  var role=req.body.role;
  console.log(role);
  var mob=req.body.mob;
  console.log(mob);

  
var imagefile=req.file.filename;
  if(password!=confirm_password)
  {
    res.render('registration',{titel:"password management system", msg:'pasword doenot matched'})
  }
 /* nodemailer.sendMail({
    to:"tomarsanjay1711@gmail.com",
    subject:'test',
    html:'<h1>Hello</h1>'
  }).then(()=>{
    res.send('successs');
  })*/
  var userDeatails= new  usermodule({
  
    name:name,
    email:email,
    password:password,
    role:role,
    mob:mob,
   imagefile:imagefile
    
  });
  console.log(userDeatails)
  userDeatails.save((err,doc)=>{
   if(err)throw err;
   res.render('registration',{titel:"password management system", msg:'Registered succefully'})
  })
 
  });
  

module.exports = router;
