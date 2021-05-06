//Imports........................................................
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
// const mongoose = require('mongoose')

const app = express()

// Settings......................................................
    // Body-Parser...............................................
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json())

    // HandleBars................................................
    app.engine('handlebars', handlebars({defaultLayout: 'main'}))
    app.set('view engine', 'handlebars')

    // Mongoose..................................................
        // todo#

// Routes........................................................

// Others........................................................

//Server.........................................................
const PORT = 8081

app.listen(PORT, (req, res)=>{
    console.log(`server running on port http://localhost:${PORT}`)
})