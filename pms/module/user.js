const mongoose= require('mongoose')
mongoose.connect('mongodb://localhost:27017/pms',{useNewUrlParser:true,useCreateIndex:true ,useUnifiedTopology: true ,})
var conn=mongoose.Collection;
var userSchema=new mongoose.Schema({
    
    name:{
        type:String,
        required:true,
     },
    email:{
        type:String,
        required:true,
        index:{
       
            unique:true,
        }
        },
        password:{
            type:String,
        },
        role:{
            type:String,
        },
        mob:{
            type:Number,
        
    

    },
        imagefile:String,
    
    Created_date:{
        type: Date,
        default:Date.now
    },
    updated_date:{
        type:Date

    }
});
var usermodule=mongoose.model('userinfo',userSchema);
module.exports=usermodule;
