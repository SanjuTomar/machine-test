const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/pms',{useNewUrlParser:true,useCreateIndex:true,useUnifiedTopology: true ,})
var conn=mongoose.Collection;

var uploadSchema= new mongoose.Schema({
    imagename:String,
})
var uploadmodel=mongoose.model('uploadimage',uploadSchema);
module.exports=uploadmodel;