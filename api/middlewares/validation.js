module.exports = {
    authChecker: (req, res, next) => {
        if (req.session.user) {
            next()
        } else {
            res.redirect('/'); 
        }
    },

    pageChecker: (req, res, next) => {
        if (req.session.user) next();
        else {
            res.clearCookie('authenticated');
            res.clearCookie('user');
            res.redirect('/');    
        }
    }
}

