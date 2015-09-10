'use strict';
var express=require('express'),
	app=express(),
	path=require('path'),
	rootDirectory=__dirname,
	port=process.env.PORT || 9006,
	jade=require('jade'),
	cookieParser=require('cookie-parser'),
	bodyParser=require('body-parser'),
	session=require('express-session'),
	config=require('./config/config.js'),
	connectMongo=require('connect-mongo')(session),
	mongoose=require('mongoose').connect(config.dbURL),
	passport=require('passport'),
	FacebookStrategy=require('passport-facebook').Strategy,
	TwitterStrategy=require('passport-twitter').Strategy,
	LinkedInStrategy=require('passport-linkedin').Strategy;


app.set('views',path.join(rootDirectory,'/views'));
app.set('view engine','jade');
app.use(express.static(path.join(rootDirectory,'/public')));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
	extended:true
}));
app.use(bodyParser.json());
 // Initialize Passport!  Also use passport.session() middleware, to support persistent login sessions (recommended).

var env=process.env.NODE_ENV || 'development';
console.log('Current environment mode is ' + env);
if(env==='development'){
	//development specific settings
	app.use(session({
		secret:config.sessionSecret,
		saveUninitialized:true,
		resave:true,
		maxAge:60000
	}));
}else{
	//Production specific settings
	//session cannot be stored in default memory store in production environment
	//
	app.use(session({
		secret:config.sessionSecret,		
	    resave: true,
	    saveUninitialized: true,
		maxAge:60000,
		store:new connectMongo({
			//url:config.dbURL,      --need to avoid this to avoid multiple connections to the same db.
			//mongoose_connection:mongoose.connections[0],
			mongooseConnection: mongoose.connection,
			stringify:true 				//all the session values are first converted to string and then only stored to mongodb.
		})
	}));
}

 app.use(passport.initialize());
 app.use(passport.session());
//First create a schema
/*

 var userSchema=mongoose.Schema({
	username:String,
	password:String,
	fullname:String,
	profilePic:String
});

//Turn Schema into Model
var Person=mongoose.model('users',userSchema);
var Shrawan=new Person({
	username:'shrawanlakhe',
	password:'idunn0kn0Wp@ssw0rd',
	fullname:'Shrawan Lakhe',
	profilePic:'09384pic_np.jpg'
});

Shrawan.save(function(err){
	console.log('Done!');
});
*/
require('./auth/passport_authentication.js')(passport,FacebookStrategy,TwitterStrategy,LinkedInStrategy,config,mongoose);
require('./routes/index.js')(express,app,passport);

app.listen(port,function(){
	console.log('Server Listening at http://localhost:' + port);
});