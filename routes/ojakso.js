var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');
 
// display books page
router.get('/', function(req, res, next) {
      
    dbConn.query('SELECT * FROM opiskelija ORDER BY idOpiskelija',function(err,rows)     {
 
        if(err) {
            req.flash('error', err);
            // render to views/koulu/index.ejs
            res.render('koulu',{data:''});   
        } else {
            // render to views/books/index.ejs
            res.render('koulu',{data:rows});
        }
    });
});

// display add book page
router.get('/add', function(req, res, next) {    
    // render to add.ejs
    res.render('koulu/add', {
        etunimi: '',
        sukunimi: '',
        osoite: '',
        luokkatunnus: ''         
    })
})

// add a new book
router.post('/add', function(req, res, next) {    

    let etunimi = req.body.etunimi;
    let sukunimi = req.body.sukunimi;
    let osoite = req.body.osoite;
    let luokkatunnus = req.body.luokkatunnus;
    let errors = false;

    if(etunimi.length === 0 || sukunimi.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Annappa etu- ja sukunimi");
        // render to add.ejs with flash message
        res.render('koulu/add', {
            etunimi: etunimi,
            sukunimi: sukunimi,
            osoite: osoite,
            luokkatunnus: luokkatunnus
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            etunimi: etunimi,
            sukunimi: sukunimi,
            osoite: osoite,
            luokkatunnus: luokkatunnus
        }
        
        // insert query
        dbConn.query('INSERT INTO opiskelija SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                 
                // render to add.ejs
                res.render('koulu/add', {
                    etunimi: form_data.etunimi,
                    sukunimi: form_data.sukunimi, 
                    osoite: form_data.osoite,
                    luokkatunnus: form_data.luokkatunnus                    
                })
            } else {                
                req.flash('success', 'Opiskelija successfully added');
                res.redirect('/koulu');
            }
        })
    }
})

// display edit book page
router.get('/edit/(:idOpiskelija)', function(req, res, next) {

    let idOpiskelija = req.params.idOpiskelija;
   
    dbConn.query('SELECT * FROM opiskelija WHERE idOpiskelija = ' + idOpiskelija, function(err, rows, fields) {
        if(err) throw err
         
        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'Opiskelija ei löydy idOpiskelija = ' + idOpiskelija)
            res.redirect('/koulu')
        }
        // if book found
        else {
            // render to edit.ejs
            res.render('koulu/edit', {
                title: 'Edit opiskelija', 
                idOpiskelija: rows[0].idOpiskelija,
                etunimi: rows[0].etunimi,
                sukunimi: rows[0].sukunimi,
                osoite: rows[0].osoite,
                luokkatunnus: rows[0].luokkatunnus

            })
        }
    })
})

// update book data
router.post('/update/:idOpiskelija', function(req, res, next) {

    let idOpiskelija = req.params.idOpiskelija;
    let etunimi = req.body.etunimi;
    let sukunimi = req.body.sukunimi;
    let osoite = req.body.osoite;
    let luokkatunnus = req.body.luokkatunnus;
    let errors = false;

    if(etunimi.length === 0 || sukunimi.length === 0) {
        errors = true;
        
        // set flash message
        req.flash('error', "Ole hyvä ja anna etu- ja sukunimi");
        // render to add.ejs with flash message
        res.render('koulu/edit', {
            idOpiskelija: req.params.idOpiskelija,
            etunimi: etunimi,
            sukunimi: sukunimi,
            osoite: osoite,
            luokkatunnus: luokkatunnus
        })
    }

    // if no error
    if( !errors ) {   
 
        var form_data = {
            etunimi: etunimi,
            sukunimi: sukunimi,
            osoite: osoite,
            luokkatunnus: luokkatunnus
        }
        // update query
        dbConn.query('UPDATE opiskelija SET ? WHERE idOpiskelija = ' + idOpiskelija, form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('koulu/edit', {
                    idOpiskelija: req.params.idOpiskelija,
                    etunimi: form_data.etunimi,
                    sukunimi: form_data.sukunimi,
                    osoite: form_data.osoite,
                    luokkatunnus: form_data.luokkatunnus
                })
            } else {
                req.flash('success', 'Opiskelija päivitetty onnistuneesti');
                res.redirect('/koulu');
            }
        })
    }
})
   
// delete book
router.get('/delete/(:idOpiskelija)', function(req, res, next) {

    let idOpiskelija = req.params.idOpiskelija;
     
    dbConn.query('DELETE FROM opiskelija WHERE idOpiskelija = ' + idOpiskelija, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to books page
            res.redirect('/koulu')
        } else {
            // set flash message
            req.flash('success', 'Opiskelija tuhottu! idOpiskelija = ' + idOpiskelija)
            // redirect to books page
            res.redirect('/koulu')
        }
    })
})

module.exports = router;