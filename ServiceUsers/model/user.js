const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const table = new mongoose.Schema({
    username:{type:String, unique:true},
    password:{type:String},
    email:{type:String, unique:true},
    completeName:{type:String},
    telphone:{type:String},
    created_at:{type:Date, default:Date.now}
});

table.pre('save', function(next){
    let user = this
    if(!user.isModified('password')) return next()
    bcrypt.hash(user.password,10,(erro,hashpass) => {
        user.password = hashpass
        return next()
    })
})

module.exports = mongoose.model('user', table)