module.exports=function(passport,FacebookStrategy,config,mongoose){
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
		 return done(null,user._id);
		 console.log(user);
	});

	passport.deserializeUser(function(id,done){
		userModel.findById(id,function(err,user){
			if(err){
                return done(err);
            }else{
		 console.log(user);
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
		userModel.findOne({'profileID':profile.id},function(err,result){
			if(result){
				return  done(null,result);
			}else{
				console.log(profile);
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
	}))
}