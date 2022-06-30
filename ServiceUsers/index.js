const express = require("express");
const mongoose = require("mongoose");
// const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cfg = require("./config/config");
const User = require("./model/user");
const create_token = require("./utils/token");
const ManagerUser = require("./model/manageruser");


const app = express();
app.use(express.json());
// app.use(corrs());

const url = "mongodb+srv://mongodb:erNmeRTLe@clustermongo.qsw2c.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(url,{useNewUrlParser:true, useUnifiedTopology:true});

app.get("/", (req, res) => {
    res.send({output:req.headers});
});


app.post("/api/user/add", (req, res) => {
    const data = new User(req.body);
    data.save().then((data) => {
        res.status(201).send({output:`Novo usuário inserido`, payload:data})
    }).catch((erro) => res.status(400).send({output:`Falha ao inserir -> ${erro}`}));
});

app.post("/api/user/login", (req, res) => {
    const user = req.body.user;
    const password = req.body.password;

    User.findOne({username:user}, (erro, data) => {
        if(erro) return res.status(400).send({output: `Erro ao processar`});
        if(!data) return res.status(404).send({output: `Usuário não encontrado`});

        bcrypt.compare(password, data.password, (erro, same) => {
            if(!same) return res.status(400).send({output: `Autenticação Inválida`});
            const token = create_token(data._id, data.user);
            const info = new ManagerUser({userid:data._id, username: data.username, information:req.headers});
            info.save();
            res.status(200).send({output:`Autenticado`, payload:data, token:token});
        })
    })
});


app.put("/api/change-password", (req, res) => {
    const userid = req.body.id
    const password = req.body.password
    
    User.findByIdAndUpdate(userid, password, {new:true}, (erro, dados) => {
        
        if(erro) return res.status(400).send({output:`Problema ao alterar -> ${erro}`});
        if(!dados) return res.status(400).send({output: `Falha ao alterar -> ${erro}`});
        return res.status(201).send({output:`Senha Alterada`, payload: dados});
    })
})

app.listen(3001,() => console.log(`Servidor ativo porta 3001`));
