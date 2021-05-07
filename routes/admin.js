const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Categoria')
const Categoria = mongoose.model('categorias')

router.get('/', (req, res)=>{
    res.render("admin/index")
})

router.get('/posts', (req, res)=>{
    res.send('Página de posts')
})

router.get('/categorias', (req, res)=>{
    Categoria.find().lean().sort({date: 'desc'}).then((categorias)=>{
        res.render('admin/categorias', {categorias: categorias})
    }).catch((err)=>{
        req.flash('error_msg', `Houve um erro ao carregar as categorias`)
        res.render('admin/categorias')
    })
})

router.get('/categorias/add', (req, res)=>{
    res.render('admin/addcategorias')
})

router.post('/categorias/nova', (req, res)=>{
    var erros = []

    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({
            text: "Nome Inválido!"
        })
    }

    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        erros.push({
            text: "Slug Inválido!"
        })
    }

    if (erros.length > 0) {
        res.render('admin/addcategorias', {erros: erros})
    } else {

        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
    
        new Categoria(novaCategoria).save()
        .then(()=>{
            req.flash('success_msg', `Categoria ${req.body.nome} criada com sucesso!`)
            res.redirect('/admin/categorias')
        }).catch((err)=>{
            req.flash('error_msg', `Houve um erro ao criar a categoria ${req.body.nome}`)
            res.redirect('/admin/categorias')
        })
    }
})

router.get('/categorias/edit/:id', (req, res)=>{
    Categoria.findOne({_id: req.params.id}).lean()
    .then((categorias)=>{
        res.render('admin/editcategorias', {categorias: categorias})
    }).catch((err)=>{
        req.flash('error_msg', 'Esta categoria não existe!')
        res.redirect('/admin/categorias')
    })
})

router.post('/categorias/edit', (req, res) => {
    var erros = []

    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({
            text: "Nome Inválido!"
        })
    }

    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        erros.push({
            text: "Slug Inválido!"
        })
    }

    if (erros.length > 0) {
        res.render('admin/editcategorias', {erros: erros})
    } else {
    
        Categoria.findOne({_id: req.body.id})
        .then((categorias)=>{

            categorias.nome = req.body.nome
            categorias.slug = req.body.slug

            categorias.save().then(()=>{
                req.flash('success_msg', `Categoria ${req.body.nome} editada com sucesso!`)
                res.redirect('/admin/categorias')
            }).catch((err)=>{
                req.flash('error_msg', `Houve um erro ao salvar a atualização da categoria ${req.body.nome}`)
                res.redirect('/admin/categorias')
            })

        }).catch((err)=>{
            req.flash('error_msg', `Houve um erro ao editar a categoria ${req.body.nome}`)
            res.redirect('/admin/categorias')
        })
    }
})

module.exports = router