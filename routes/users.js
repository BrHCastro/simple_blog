const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/User')
const User = mongoose.model('user')
const bcrypt = require('bcryptjs')

router.get('/register', (req, res) => {
    res.render('usuarios/registro')
})

router.post('/register', (req, res) => {
    var err = []

    if (!req.body.name || typeof req.body.name == undefined || req.body.name == null) {
        err.push({ text: "Nome inválido. Campo não pode ficar vázio." })
    }
    if (!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
        err.push({ text: "E-mail inválido. Campo não pode ficar vázio." })
    }
    if (!req.body.pass || typeof req.body.pass == undefined || req.body.pass == null) {
        err.push({ text: "Senha inválido. Campo não pode ficar vázio." })
    }
    if (!req.body.passTwo || typeof req.body.passTwo == undefined || req.body.passTwo == null) {
        err.push({ text: "Confirme sua senha. Campo não pode ficar vázio." })
    }
    if (req.body.pass.length < 4) {
        err.push({ text: "Oops! Senha muito curta. Sua senha deve ter no minimo 4 caracteres." })
    }
    if (req.body.pass != req.body.passTwo) {
        err.push({ text: "Oops! Senhas não conferem." })
    }

    if (err.length > 0) {
        res.render('usuarios/registro', { err: err })
    } else {
        User.findOne({ email: req.body.email })
            .then((user) => {
                if (user) {
                    req.flash('error_msg', `Já existe um usuário com o e-mail <b>"${req.body.email}"</b>`)
                    res.redirect('/user/register')
                } else {
                    const newUser = {
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.pass
                    }

                    bcrypt.genSalt(10, (err, salt) => {
                        //Qual valor,salt, callback
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) {
                                req.flash('error_msg0', 'Houve um erro durante o salvamento.')
                                res.redirect('user/register')
                            } else {
                                newUser.password = hash
                                new User(newUser).save()
                                    .then(() => {
                                        req.flash('success_msg', `Boa, ${req.body.name}! Seu cadastro foi realizado com sucesso! Clique 
                                        <a style="font-weight: bold; text-decoration: none; color: #0f5132;" href="#">aqui</a> 
                                        e faça o login.`)

                                        res.redirect('/user/register')
                                    }).catch((err) => {
                                        req.flash('error_msg', `Houve um erro em seu cadastro, ${req.body.name}. Por favor, tente novamente mais tarde.`)
                                        res.redirect('user/register')
                                    })
                            }

                        }) 
                    })

                }
            }).catch((error) => {
                req.flash('error_msg', 'Vish! Houve um erro interno. Por favor, tente mais tarde.')
                res.redirect('user/register')
            })
    }
})

router.get('/login', (req, res) => {
    res.render('usuarios/login')
})


module.exports = router
