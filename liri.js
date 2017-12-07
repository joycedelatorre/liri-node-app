var keys = require("./keys");
var spotify = require("./keys");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var fs = require('file-system');
var request = require('request');

var command = process.argv[2];
appendTheCommand(command);
if (command === "my-tweets"){
	tweetTweet();
	
} else if( command === "spotify-this-song"){
	var song = process.argv[3]; // ---> please put quotations around song -->spotify-this-song "more than words"
	spotifyThisSong(song);
	

} else if (command === "movie-this"){
	var movieTitle = process.argv[3]; // ---> Please put quotations around title
	movieThis(movieTitle);
	

} else if (command === "do-what-it-says"){
	fs.readFile("random.txt","utf-8", function(error, data){
		var fileMethod = data.split(',')[0];
		var param= data.split(',')[1];
		if(fileMethod === "spotify-this-song"){
			spotifyThisSong(param);
		} else if(fileMethod === "my-tweets"){
			tweetTweet();
		} else if(fileMethod === "movie-this"){
			movieThis(param);
		}
	});
}

function spotifyThisSong(song){
	var spotify = new Spotify({
	  id: keys.spotifyKeys.id,
	  secret: keys.spotifyKeys.secret
	});
	 
	spotify.search({ type: 'track', query: song }, function(err, data) {
	  if (err) {
	    return console.log('Error occurred: ' + err);
	  }
	 	for(var i = 0; i < data.tracks.items.length; i++){

			console.log("Artist: "+JSON.stringify(data.tracks.items[i].album.artists[0].name));
			console.log("Song: ")
			console.log("URL: "+JSON.stringify(data.tracks.items[i].album.external_urls.spotify));
			console.log("Album: "+JSON.stringify(data.tracks.items[i].album.name)); 
			console.log("<<--------------------->>");
	 	}
	});
}

function tweetTweet(){
	var client = new Twitter({
	  consumer_key: keys.twitterKeys.consumer_key,
	  consumer_secret: keys.twitterKeys.consumer_secret,
	  access_token_key: keys.twitterKeys.access_token_key,
	  access_token_secret: keys.twitterKeys.access_token_secret
	});
	var params = {screen_name:'j_of_the_tower'};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
  		if (!error) {
    		// console.log(tweets);
    		counter = 1
    		for (var i = 0; i < tweets.length; i++){
    			console.log( counter +". "+ tweets[i].text);
    			counter +=1;
    			console.log("<<--------------------->>");
    		}
  		}
	});
}

function movieThis(movieTitle){
	if((movieTitle === null)|| (movieTitle=== "")){
			movieTitle = "Mr. Nobody";
		}

	var queryUrl = "https://www.omdbapi.com/?t="+movieTitle+"&y=&plot=short&apikey=trilogy";
	//console.log(queryUrl);
	request(queryUrl, function(error, response, body){
		if(!error & response.statusCode === 200){
			var obj = JSON.parse(body);
			console.log("\n");
			console.log("Title: "+ obj.Title);
			console.log("\n");
			console.log("Year: "+ obj.Year);
			console.log("\n");
			console.log("Ratings:");//loop
			for(var i = 0; i < obj.Ratings.length; i++){
				console.log(JSON.stringify(obj.Ratings[i].Source)+": "+JSON.stringify(obj.Ratings[i].Value));
			}
			console.log("\n");
			console.log("Country: "+ obj.Country);//loop
			console.log("\n");
			console.log("Language: " + obj.Language);
			console.log("\n");
			console.log("Plot: " + obj.Plot);
			console.log("\n");
			console.log("Actors: "+ obj.Actors);
			console.log("\n");
		}
	});
}

function appendTheCommand(command){
	fs.appendFile('log.txt', command, (err)=>{
		if(err) throw err;
		console.log('The data to append was appended to file!');
	});
}


