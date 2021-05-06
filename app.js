//Imports........................................................
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const admin = require('./routes/admin')
const path = require('path')

const app = express()

// Settings......................................................
    // Body-Parser...............................................
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json())

    // HandleBars................................................
    app.engine('handlebars', handlebars({defaultLayout: 'main'}))
    app.set('view engine', 'handlebars')

    // Mongoose..................................................
    mongoose.Promise = global.Promise
    mongoose.connect('mongodb://localhost/blogapp', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=>{
        console.log('conectado com sucesso!')
    }).catch((err)=>{
        console.log(`Erro: ${err}`)
    })

    // Public....................................................
    app.use(express.static(path.join(__dirname,"public")))

// Routes........................................................
    app.use('/admin', admin)
// Others........................................................

//Server.........................................................
const PORT = 8081

app.listen(PORT, (req, res)=>{
    console.log(`server running on port http://localhost:${PORT}`)
})