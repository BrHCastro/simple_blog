const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Categoria')
require('../models/Posts')
const Categoria = mongoose.model('categorias')
const Post = mongoose.model('posts')

//Rota principal para admin.............................................
router.get('/', (req, res)=>{
    res.render("admin/index")
})

// router.get('/posts', (req, res)=>{
//     res.send('Página de posts')
// })

//Rota para lista de categorias.........................................
router.get('/categorias', (req, res)=>{
    Categoria.find().sort({date: 'DESC'}).lean().then((categorias)=>{
        res.render('admin/categorias', {categorias: categorias})
    }).catch((err)=>{
        req.flash('error_msg', `Houve um erro ao carregar as categorias`)
        res.render('admin/categorias')
    })
})

//Rota para página de criar categoria..................................
router.get('/categorias/add', (req, res)=>{
    res.render('admin/addcategorias')
})

//Rota para adicionar categoria ao banco...............................
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

//Rota para editar a categoria.....................................................
router.get('/categorias/edit/:id', (req, res)=>{
    Categoria.findOne({_id: req.params.id}).lean()
    .then((categorias)=>{
        res.render('admin/editcategorias', {categorias: categorias})
    }).catch((err)=>{
        req.flash('error_msg', 'Esta categoria não existe!')
        res.redirect('/admin/categorias')
    })
})

//Rota para fazer o update da categoria no banco
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

//Rota para deletar categoria...................................................
router.post('/categorias/delete', (req, res) => {
    let nome = req.body.nome
    let id = req.body.id
    Categoria.remove({_id: id})
    .then(()=>{
        req.flash('success_msg', `Categoria ${nome} removida com sucesso!`)
        res.redirect('/admin/categorias')
    }).catch(()=>{
        req.flash('error_msg', `Erro ao excluir categora ${req.body.nome}`)
        res.redirect('admin/categorias')
    })
})

//Rota para listar postagens......................................................
router.get('/postagens', (req, res) => {
    Post.find().lean().populate('category').sort({date: 'desc'})
    .then((posts)=>{
        res.render('admin/postagens', {posts: posts})
    }).catch((err)=>{
        req.flash('error_msg', 'Houve um erro ao listar as postagens')
        res.redirect("/admin")
    })
})

//Rota para criar nova postagem....................................................
router.get('/postagens/add', (req, res) => {
    Categoria.find().lean()
    .then((categorias)=>{
        res.render('admin/addpostagem', {categorias: categorias})
    }).catch((req, res) => {
        req.flash('error_msg', `Erro ao retornar as categorias`)
        res.render('admin/postagens')
    })
})

//Rota para adicionar nova postagem no banco........................................
router.post('/postagens/nova', (req, res)=>{
    var erros = []

    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({
            text: "Título Inválido! Registre um título."
        })
    }

    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        erros.push({
            text: "Slug Inválido! Registre um slug."
        })
    }

    if (!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null) {
        erros.push({
            text: "Descrição Inválido! Registre uma descrição."
        })
    }

    if (!req.body.conteudo || typeof req.body.conteudo == undefined || req.body.conteudo == null) {
        erros.push({
            text: "Conteúdo Inválido! Registre um conteúdo."
        })
    }

    if (!req.body.categoria || typeof req.body.categoria == undefined || req.body.categoria == null || req.body.categoria == 0) {
        erros.push({
            text: "Categoria Inválido! Registre uma categoria."
        })
    }

    if (erros.length > 0) {
        res.render('admin/addpostagem', {erros: erros})
    } else {

        const newPost = {
            title: req.body.nome,
            slug: req.body.slug,
            description: req.body.descricao,
            content: req.body.conteudo,
            category: req.body.categoria
        }

        new Post(newPost).save()
        .then(()=>{
            req.flash('success_msg', `Post ${req.body.nome} criada com sucesso!`)
            res.redirect('/admin/postagens')
        }).catch((err)=>{
            req.flash('error_msg', `Houve um erro ao criar o post ${req.body.nome}`)
            res.redirect('/admin/postagens')
        })
    }
})

//Rota para editar a postagem....................................................
router.get('/postagem/edit/:id', (req, res)=>{
    Post.findOne({_id: req.params.id}).lean()
    .then((posts)=>{
        
    Categoria.find().lean()
    .then((categorias)=>{
        res.render('admin/editpostagem', {categorias: categorias, posts: posts})
    }).catch((req, res) => {
        req.flash('error_msg', `Erro ao retornar as categorias`)
        res.render('admin/postagens')
    })

    }).catch((err)=>{
        req.flash('error_msg', 'Este Post não existe!')
        res.redirect('/admin/postagens')
    })
})

//Rota para fazer o update da postagem.
router.post('/postagem/edit', (req, res)=>{
    var erros = []

    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({
            text: "Título Inválido! Registre um título."
        })
    }

    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        erros.push({
            text: "Slug Inválido! Registre um slug."
        })
    }

    if (!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null) {
        erros.push({
            text: "Descrição Inválido! Registre uma descrição."
        })
    }

    if (!req.body.conteudo || typeof req.body.conteudo == undefined || req.body.conteudo == null) {
        erros.push({
            text: "Conteúdo Inválido! Registre um conteúdo."
        })
    }

    if (!req.body.categoria || typeof req.body.categoria == undefined || req.body.categoria == null || req.body.categoria == 0) {
        erros.push({
            text: "Categoria Inválido! Registre uma categoria."
        })
    }

    if (erros.length > 0) {
        res.render('admin/editpostagem', {erros: erros})
    } else {
        Post.findOne({_id: req.body.id})
        .then((posts)=>{
            posts.title = req.body.nome
            posts.slug = req.body.slug
            posts.description = req.body.descricao
            posts.content = req.body.conteudo
            posts.category = req.body.categoria

            posts.save().then(()=>{
                req.flash('success_msg', 'Post alterado com sucesso!')
                res.redirect('/admin/postagens')
            }).catch((err)=>{
                req.flash('error_msg', 'Erro ao atualizar a postagem.')
                res.redirect('/admin/postagens')
            })
        }).catch((err)=>{
            req.flash('error_msg', 'Houve um erro ao salvar a edição')
            res.redirect('admin/postagens')
        })
    }
    
})

//Rota para deletar postagem
router.post('/postagem/delete', (req, res) => {
    let nome = req.body.nome
    let id = req.body.id
    Post.deleteOne({_id: id})
    .then(()=>{
        req.flash('success_msg', `Post "${nome}" removida com sucesso!`)
        res.redirect('/admin/postagens')
    }).catch(()=>{
        req.flash('error_msg', `Erro ao excluir o post "${req.body.nome}"`)
        res.redirect('admin/postagens')
    })
})

module.exports = router