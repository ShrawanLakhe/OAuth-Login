module.exports=function(passport,TwitterStrategy,config,mongoose){
	console.log('hello');
	var userSchema1=new mongoose.Schema({
		profileID:String,
		fullname:String,
		profilePic:String,
		email:String
	});

	var userModel=mongoose.model('customers1',userSchema1);
// 	 Passport session setup.

//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing. 
	passport.serializeUser(function(user,done){

		console.log('------------------------------------------------------------------');
		console.log(user);
		console.log('------------------------------------------------------------------');
		 return done(null,user.id);
	});

	passport.deserializeUser(function(id,done){

		
		userModel.findById(id,function(err,user){
			console.log('tarrrrrrrrrrrr');
			if(err){
                return done(err);
            }else{
            	console.log('///////////////////////////////////////////////////////////////////////');
		console.log(user);
		console.log('///////////////////////////////////////////////////////////////////////');
            	return done(null, user);
            }

		});
	});
 	
	passport.use(new TwitterStrategy({
		consumerKey:config.twitter.consumerKey,
		consumerSecret:config.twitter.consumerSecret,
		callbackURL:config.twitter.callbackURL
	},
	function(token,tokenSecret,profile,done){
		//Checks if the user exists in our mongoose database
		//If user exists,simply return the profile
		//else create user and return the profile
		userModel.findOne({'profileID':profile.id},function(err,result){
			console.log(profile);
			if(result){
				console.log('Result is as below:');
				console.log(result);
				return  done(null,result);
			}else{
				var newUser=new userModel({
					profileID:profile.id,
					fullname:profile.displayName,
					profilePic:profile.photos[0].value || ''
				});
				newUser.save(function(err){

				console.log('**********************************************************************');
				console.log(newUser);
				console.log('**********************************************************************');
					return done(null,newUser);
				})
			}
		})
	}
	));


}