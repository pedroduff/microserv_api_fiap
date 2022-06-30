const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const auth = require("./middleware/jwt_verify");
const Client = require("./model/clients");

const app = express();
app.use(express.json());

const url = "mongodb+srv://mongodb:erNmeRTLe@clustermongo.qsw2c.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(url,{useNewUrlParser:true, useUnifiedTopology:true});

app.get("/", (req, res) => {
    res.send({output:req.headers});
});

app.post("/api/client/add", auth, (req, res) => {
    const data = new Client(req.body);
    data.save().then((data) => {
        res.status(201).send({output: `Novo cliente adicionado`, payload:data})
    }).catch((erro) => res.status(400).send({output: `Falha ao inserir -> ${erro}`}));
});

app.put("/api/client/update/:id", auth, (req, res) => {
    const id = req.params.id
    const body = req.body
    Client.findByIdAndUpdate(id, body, {new:true}, (erro, dados) => {
        
        if(erro) return res.status(400).send({output:`Problema ao atualizar -> ${erro}`});
        if(!dados) return res.status(400).send({output: `Falha ao atualizar -> ${erro}`});
        return res.status(201).send({output:`Atualização realizada`, payload: dados});
    })
});


app.delete("/api/client/delete/:id", auth, (req, res) => {
    const id = req.parms.id
    Client.findByIdAndDelete(id, (erro, dados) => {
        if(erro) return res.status(400).send({output:`Problema ao deletar -> ${erro}`});
        res.status(204).send({})
    })
});

app.listen(3003, () => console.log("Servidor Ativo 3003"));
