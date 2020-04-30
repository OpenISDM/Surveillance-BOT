module.exports = {
    authChecker: (req, res, next) => {
        if (req.session.user) {
            next()
        } else {
            res.send('permission denied')
        }
    },

    pageChecker: (req, res, next) => {
        if (req.session.user) next();
        else res.redirect('/');    
    }
}

