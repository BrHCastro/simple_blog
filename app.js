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
require('./models/Categoria')
const Category = mongoose.model('categorias')
const user = require('./routes/users')
const passport = require('passport')
require('./config/auth')(passport)
const db = require('./config/db');

//moment lib para formatação de dadas e horas
const moment = require('moment')
const localization = require('moment/locale/pt-br')

const app = express()

// Settings......................................................
    // Session...................................................
    app.use(session({
        secret: "nodejs",
        resave: true,
        saveUninitialized: true
    }))

    // É importante que este metodo fique nesta ordem.
    app.use(passport.initialize())
    app.use(passport.session())

    app.use(flash())

    // Middlewhere...............................................
    app.use((req, res, next)=>{
        res.locals.success_msg = req.flash("success_msg")
        res.locals.error_msg = req.flash("error_msg")
        res.locals.error = req.flash("error")
        res.locals.user = req.user || null //Passar para a variável global dados do usuário. Caso não exista o valor sera vazio.
        next()
    })

    // Body-Parser...............................................
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json())

    // HandleBars................................................

    const hbs = handlebars.create({
        defaultLayout: 'main',
        //create custom helpers
        helpers:{
            formatDate: (date) => {
                return moment(date).format('DD/MM/YYYY H:mm:ss')
            },
            formatMoment: (date) => {
                return moment(date).fromNow()
            },
            limitString: function(value){
                return value.substring(0, 400) + '...';
            },
            setUser: (par) => {
                let name = par.name
                name = name.split(' ')
                return name[0]
            }
        }
    })

    app.engine('handlebars', hbs.engine)
    app.set('view engine', 'handlebars')

    // Mongoose..................................................
    mongoose.Promise = global.Promise
    mongoose.connect(db.mongoURI, {useNewUrlParser: true, useUnifiedTopology: true})
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
            res.redirect('/')
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
            res.redirect('/')
        })
    })

    app.get('/categorias', (req, res) => {
        Category.find().lean()
        .then((categorias) => {
            res.render('categorias/index', {categorias: categorias})
        }).catch((err) => {
            req.flash('error_msg', 'Erro interno! Não foi possível listar as categorias')
            res.redirect('/')
        })
    })

    app.get('/categorias/:slug', (req, res) => {
        Category.findOne({slug: req.params.slug}).lean()
        .then((categorias) => {
            if (categorias) {
                Post.find({category: categorias._id}).lean()
                .then((posts) => {
                    res.render('categorias/postagens', {posts: posts, categorias: categorias})
                }).catch((err) => {
                    req.flash('error_msg', 'Erro interno! Não foi possível localizar as postagens dessa categorias')
                    res.redirect('/')
                })

            } else {
                req.flash('error_msg', 'Nenhuma postagem localizada com essa categoria')
                res.redirect('/')
            }
        }).catch((err) => {
            req.flash('error_msg', 'Erro interno! Não foi possível carregar a postagem dessa categoria')
            res.redirect('/')
        })
    })

    app.get('/404', (req, res) => {
        res.send('Erro 404!')
    })

    app.use('/admin', admin)
    app.use('/user', user)
// Others........................................................

//Server.........................................................
const PORT = process.env.PORT || 8089;

app.listen(PORT, (req, res)=>{
    console.log(`server running on port http://localhost:${PORT}`)
})
