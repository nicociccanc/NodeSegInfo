const bcrypt = require('bcrypt');

function login(req, res){
    if(req.session.logeddin != true){

        res.render('login/index');

    }else {

        res.redirect('/');

    }
  
}

function auth (req, res) {
    const data = req.body;
    console.log(data); //Muestro la info ingresada por consola

    req.getConnection((err, conn) =>{
        conn.query('SELECT * FROM users WHERE email = ?', [data.email], (err, userdata) => {

            if (userdata.length>0) {

                userdata.forEach(element => {
                    bcrypt.compare(data.password, element.password, (err, isMatch) => {
                   
                        if(!isMatch) {
                            res.render('login/index', { error: 'INCORRECT PASSWORD' });
                        }else {
                           
                            req.session.logeddin = true;
                            req.session.name = element.name;

                            res.redirect('/');

                        }
                   });
                });

            } else {
                res.render('login/index', {error: 'USER NOTEXIST! '});
            }
        });
    });
}

function register(req, res){

    if(req.session.logeddin != true){

        res.render('login/register');

    }else {

        res.redirect('/');

    }
}

function storeUser(req,res){
    const data = req.body;
    //console.log(data); //INGRESO DE DATOS SIN ENCRIPTAR

    //Ingreso de datos con encriptacion y validacion:
    
    req.getConnection((err, conn) =>{
        conn.query('SELECT * FROM users WHERE email = ?', [data.email],
         (err, userdata) =>{
            if (userdata.length>0){
                res.render('login/register', {error: 'USER ALREADY EXIST! '});
            }else {
                bcrypt.hash(data.password, 12).then(hash => { //uso bcrypt para encriptar la pass
                    data.password = hash;
                    req.getConnection((err, conn) => {
                        conn.query('Insert INTO users SET ?', [data], (err,rows) =>{
            
                            res.redirect('/');
                        })
                    })
                });
            }
         });
    });
    
}

function logout(req, res) {
    if(req.session.logeddin == true) { 

        req.session.destroy();
    
    }
    res.redirect('/login');
}


module.exports = {
    login,
    register,
    storeUser,
    auth,
    logout,
}