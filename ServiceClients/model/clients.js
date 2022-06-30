const mongoose = require("mongoose");


const table_clients = new mongoose.Schema({
    nomeBanco:{type:String,required:true},
    tipoConta:{type:String,required:true},
    nomeTitular:{type:String,required:true},
    limiteCartao:{type:Number},
    createdAt:{type:Date, default:Date.now},
    updatedAt:{type:Date}
});

module.exports = mongoose.model("clients", table_clients);