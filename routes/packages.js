const express = require('express')
const router = express.Router()

//Bring in Packages model
let Packages = require('../models/Packages');
let Users = require('../models/Users');

//add route
router.get('/add', ensureAuthenticated, function(req, res){
	res.render('add_package', {
		title: 'Add package',
	});
});

//save pacakge
router.post('/save', ensureAuthenticated, function(req, res){
	req.checkBody('title', 'Title required').notEmpty();
	req.checkBody('description', 'Description required').notEmpty();

	let errors = req.validationErrors();
	if(errors){
		res.render('add_package',{
			title: 'Add package',
			errors: errors
		});
	}else{
		let package = new Packages();
		package.title = req.body.title;
		package.description = req.body.description;
		package.user_id = req.user._id;
		package.save(function(err){
			if(err){
				console.log(err);
				return;
			}else{
				req.flash('success', 'Package created');
				res.redirect('/');
			}
		});
	}
});

//get single package detail
router.get('/:id', function(req, res){
	Packages.findById(req.params.id, function(err, package){
		Users.findById(package.user_id, function(err, user){
			res.render('package', {
				title: package.title,
				package: package,
				ownerName: user.name,
			});
		});
	});
});

//edit single package detail
router.get('/edit/:id', ensureAuthenticated, function(req, res){
	Packages.findById(req.params.id, function(err, package){
		if(package.user_id != req.user._id){
			req.flash('danger', 'Sorry unauthorized access');
			res.redirect('/');
		}
		res.render('edit_package', {
			title: package.title,
			package: package
		});
	});
});

//update package detail
router.post('/update/:id', function(req, res){
	let package = {};
	package.title = req.body.title;
	package.description = req.body.description;
	
	let query = {_id:req.params.id};
	Packages.update(query, package, function(err){
		if(err){
			console.log(err);
			return;
		}else{
			req.flash('info', 'Package updated');
			res.redirect('/');
		}
	});
});

router.delete('/delete/:id', function(req, res){
	if(!req.user._id){
		res.status(500).send();
	}

	let query = {_id: req.params.id};

	Packages.findById(req.params.id, function(err, package){
		if(package.user_id != req.user._id){
			res.status(500).send()
		}else{
			Packages.remove(query, function(err){
				if(err){
					console.log(err);
				}else{
					res.send('success');
				}
			});
		}
	});
});

//access control
function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}else{
		req.flash('danger', 'Login to continue');
		res.redirect('/users/login');
	}
}

module.exports = router;