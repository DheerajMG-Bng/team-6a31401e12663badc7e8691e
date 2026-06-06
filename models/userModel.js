const mongoose = require('mongoose');
const bcrpyt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    
    // USER NAME
    name : {
        type : String,
        required : [true, 'Name is required'],
        trim : true,
        minlength : [5, 'Name must be atleast 5 characters'],
        maxlength : [30, 'Name cannot exceed 30 characters'] 
    },

    // USER EMAIL
    email : {
        type : String,
        required : [true, 'email is required'],
        unique: true,
        trim : true,
        lowercase : true,
        match : [ /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ , 'Please provide a valid email address']
    },

    // USER PASSWORD
    password : {
        type : String,
        required : [true, 'Password is required'],
        minlength : [6, 'Password must be at least 6 characters'],
        select : false
    },

    // ROLE OF USER - USER OR ADMIN
    role : {
        type : String,
        enum : ['user', 'admin'],
        default : 'user'
    },

    // ACCOUNT CREATED AT 
    created_at : {
        type : Date,
        default : Date.now,
        immutable : true
    },

    // ACCOUNT UPDATED AT
    updated_at : {
        type : Date,
        default : Date.now
    }
});

userSchema.index({ created_at : -1 });
userSchema.pre('save',async function(next) {
    if(!this.isModified('password')) {
        return next();
    }

    try{
        const salt = await bcrpyt.genSalt(10);
        this.password = await bcrpyt.hash(this.password, salt);
        this.updated_at = Date.now();
        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model('User', userSchema);