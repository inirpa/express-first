const express = require('express');
const path = require('path'); 
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database');


mongoose.connect(config.database);
let db = mongoose.connection;
//check connection
db.once('open', function(){
	console.log('Connected to mongodb');
});

//Check for DB errors
db.on('error', function(err){
	console.log(err);
});

//init app
const app = express();

//Bring in models
let Packages = require('./models/Packages');
let Users = require('./models/Users');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Set public folder as static
app.use(express.static(path.join(__dirname, 'public')));
 
//express session middleware
app.use(session({
	secret: 'keyboard cat',
	resave: true,
	saveUninitialized: true,
}));

//express message middleware
app.use(require('connect-flash')());
app.use(function(req, res, next){
	res.locals.messages = require('express-messages')(req, res);
	next();
});

//express validator middleware
app.use(expressValidator({
	errorFormatter: function(param, msg, value){
		var namespace = param.split('.')
		, root = namespace.shift()
		, formParam = root;

		while(namespace.length){
			formParam += '[' + namespace.shift() + ']';
		}

		return{
			param: formParam,
			msg: msg,
			value: value
		};
	}
}));

//passport config
require('./config/passport')(passport);

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//enable global user variable
app.get('*', function(req, res, next){
	res.locals.user = req.user || null;
	next();
});

//home route
app.get('/', (req, res) => {
	// res.send('Hello world');
	// let packages = [
	// 	{
	// 		id: 1,
	// 		title: 'Special package',
	// 		description: 'Holiday 50% discount'
	// 	},
	// 	{
	// 		id: 2,
	// 		title: 'Pokhara tour',
	// 		description: 'Phewa package'
	// 	},
	// 	{
	// 		id: 3,
	// 		title: 'Chitwan safari',
	// 		description: 'Safari'
	// 	},
	// ];
	Packages.find({}, function(err, packages){
		if(err){
			console.log(err);
		}else{
			res.render('index', {
				title: 'Home',
				packages: packages
			});
		}
	});
});

//Route files
let packages = require('./routes/packages');
app.use('/packages', packages);

let users = require('./routes/users');
app.use('/users', users);

//Start server
app.listen(3000, function(){
	console.log('Server started on port 3000...')
});