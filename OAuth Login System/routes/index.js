'use strict';
module.exports=function(express,app,passport){

	var router=express.Router();

	router.get('/',function(req,res,next){
		res.render('index',{
			title:'My First Jade Lesson'
		})
	});



	router.get('/auth/facebook',passport.authenticate('facebook'));


	router.get('/auth/facebook/callback',passport.authenticate('facebook',{
		successRedirect:'/contactus',
		failureRedirect:'/'
	}));


	router.get('/auth/twitter',passport.authenticate('twitter'));

	router.get('/auth/twitter/callback',passport.authenticate('twitter',{
		successRedirect:'/contactus',
		failureRedirect:'/'
	}));

 	router.get('/auth/linkedin',passport.authenticate('linkedin',{ scope: ['r_basicprofile', 'r_emailaddress']}));

 	router.get('/auth/linkedin/callback',passport.authenticate('linkedin',{
 		successRedirect:'/contactus',
		failureRedirect:'/'
 	}))

	router.get('/contactus',function(req,res,next){
		res.render('contactus',{
			title:'My Contact page Babbal',
			user:(typeof(req.user)==='undefined'?false:req.user)
		})

	});


/*
	router.get('/setColor',function(req,res,next){
		req.session.favColor='Red',
		res.send('Setting the favourite color to Red !')
	});


	router.get('/getColor',function(req,res,next){
		var favColor=req.session.favColor;
		if(favColor!==undefined){
			res.send('Favourite Color :' + req.session.favColor);
		}else{
			res.send('Favourite Color Not Found.');
		}
		res.end();
	});
*/
	function ensureAuthenticated(req,res,next){
		if(req.isAuthenticated()){
			return next();
		}else{
			res.redirect('/');
		}
	}


	app.use('/',router);
}