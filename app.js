//Imports........................................................
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const admin = require('./routes/admin')
const path = require('path')
const session = require('express-session')
const flash = require('connect-flash')
require('./models/Posts')
const Post = mongoose.model('posts')

const app = express()

// Settings......................................................
    // Session...................................................
    app.use(session({
        secret: "nodejs",
        resave: true,
        saveUninitialized: true
    }))
    app.use(flash())

    // Middlewhere...............................................
    app.use((req, res, next)=>{
        res.locals.success_msg = req.flash("success_msg")
        res.locals.error_msg = req.flash("error_msg")
        next()
    })

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
    app.get('/', (req, res) => {
        Post.find().populate('category').sort({data:"desc"}).lean().then((posts)=>{
            res.render('index', {posts: posts})
        }).catch((erro)=>{
            req.flash('error_msg', 'Erro interno! Não foi possível carregar as postagens')
            res.redirect('/404')
        })
    })

    app.get('/postagem/:slug', (req, res) => {
        Post.findOne({slug: req.params.slug}).populate('category').lean()
        .then((posts) => {

            if (posts) {
                res.render('posts/index', {posts: posts})
            } else {
                req.flash('error_msg', 'Erro interno! Não foi possível carregar a postagem ou ela não existe')
                res.redirect('/')
            }

        }).catch((err) => {
            req.flash('error_msg', 'Erro interno! Não foi possível carregar a postagem')
            res.redirect('/404')
        })
    })

    app.get('/404', (req, res) => {
        res.send('Erro 404!')
    })

    app.use('/admin', admin)
// Others........................................................

//Server.........................................................
const PORT = 8081

app.listen(PORT, (req, res)=>{
    console.log(`server running on port http://localhost:${PORT}`)
})
