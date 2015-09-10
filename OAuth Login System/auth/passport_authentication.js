'use strict';
module.exports=function(passport,FacebookStrategy,TwitterStrategy,LinkedInStrategy,config,mongoose){
	var userSchema=new mongoose.Schema({
		profileID:String,
		fullname:String,
		profilePic:String,
		email:String
	});

	var userModel=mongoose.model('customers',userSchema);
// 	 Passport session setup.

//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing. 
	passport.serializeUser(function(user,done){
		console.log('Serializing...');
		console.log(user);
		 return done(null,user._id);
	});

	passport.deserializeUser(function(id,done){
		userModel.findById(id,function(err,user){
			console.log('Deserializing user...');
			console.log(user);
			if(err){
                return done(err);
            }else{
            	return done(null, user);
            }

		});
	});



	passport.use(new FacebookStrategy({
		clientID:config.facebook.appID,
		clientSecret:config.facebook.appSecret,
		callbackURL:config.facebook.callbackURL,
		enableProof:false,
		profileFields:['id','displayName','photos','email']
	},
	function(accessToken,refreshToken,profile,done){
		//Checks if the user exists in our mongoose database
		//If user exists,simply return the profile
		//else create user and return the profile
		console.log('Facebook strategy now starting...');
		userModel.findOne({'profileID':profile.id},function(err,result){
			if(result){
				return  done(null,result);
			}else{
				var newUser=new userModel({
					profileID:profile.id,
					fullname:profile.displayName,
					profilePic:profile.photos[0].value || '',
					email:profile.email
				});

				newUser.save(function(err){
					return done(null,newUser);
				})
			}
		})
	}));


	passport.use(new TwitterStrategy({
		consumerKey:config.twitter.consumerKey,
		consumerSecret:config.twitter.consumerSecret,
		callbackURL:config.twitter.callbackURL
	},
	function(token,tokenSecret,profile,done){
		//Checks if the user exists in our mongoose database
		//If user exists,simply return the profile
		//else create user and return the profile
		console.log('Twitter strategy now starting...');
		userModel.findOne({'profileID':profile.id},function(err,result){
			if(result){
				return  done(null,result);
			}else{
				var newUser=new userModel({
					profileID:profile.id,
					fullname:profile.displayName,
					profilePic:profile.photos[0].value || '',
					email:profile.email
				});
				newUser.save(function(err){
					return done(null,newUser);
				})
			}
		})
	}
	));


	passport.use(new LinkedInStrategy({
		consumerKey:config.linkedin.consumerKey,
		consumerSecret:config.linkedin.consumerSecret,
		callbackURL:config.linkedin.callbackURL,
		profileFields: ['id', 'first-name', 'last-name', 'email-address', 'headline']
	},function(token,tokenSecret,profile,done){
		console.log('Linked strategy now starting...');
		userModel.findOne({'profileID':profile.id},function(err,result){
			if(result){
				console.log('Result is as below:');
				console.log(result);
				return  done(null,result);
			}else{
				console.log('Result  below:');
				console.log(result);
				var newUser=new userModel({
					profileID:profile.profileID,
					fullname:profile.fullname,
					profilePic:profile.profilePic || '',
					email:profile.email
				});
				newUser.save(function(err){
					console.log('saving...');
					return done(null,newUser);
				})
			}
		})
	}));
}