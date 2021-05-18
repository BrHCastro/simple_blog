module.exports = {
    checkAdmin: function(req, res, next) {
        if (req.isAuthenticated() && req.user.userLevel == 1) {
            return next()
        }

        req.flash('error_msg', 'Oops! Você não tem autorização para esta página.')
        res.redirect('/')
    }
}