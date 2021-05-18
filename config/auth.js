const localStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

// Model de usuário
require('../models/User')
const User = mongoose.model('user')

module.exports = function(passport) {
    passport.use(new localStrategy({usernameField: 'email', passwordField: 'password'}, (email, password, done) => {
        User.findOne({email: email}).then((user) => {
            if(!user) {
                return done(null, false, {message: "Usuário inválido!"})
            }

            bcrypt.compare(password, user.password, (err, check) => {
                if(check) {
                    return done(null, user)
                } else {
                    return done(null, false, {message: "Senha incorreta!"})
                }
            })
        })
    }))

    //Salvar dados do usuário em uma sessão.
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
        })
    })
}