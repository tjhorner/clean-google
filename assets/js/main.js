urlRegex = /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/;
placeholders = ["anything", "people", "places", "websites", "news"];
currentPlaceholder = 0;
showSuggestions = false;

function suggest(data){
	if(showSuggestions){
		if($('#suggestion').css('display') === 'none'){
			$('#suggestion').css('opacity', 1);
		}
		$('#suggestion').text(data[1][0][0]);
	}
}

$(document).ready(function(){
	$('#query').focus();
	var suggestTimeout = setTimeout(function(){}, 500);

	$('#query').on('keyup', function(e){
		if(e.keyCode === 40){
			$('#query').val($('#suggestion').text());
			$('#suggestion').css('opacity', 0);
		}else{
			clearTimeout(suggestTimeout);

			var query = $('#query').val();

			if(query.match(urlRegex) && query.indexOf("?") !== 0){
				$('#search').addClass('url');
			}else{
				$('#search').removeClass('url');
			}

			if(query === ""){
				$('#suggestion').css('opacity', 0);
				showSuggestions = false;
			}else{
				showSuggestions = true;
				$('#suggestion').css('opacity', 1);
				suggestTimeout = setTimeout(function(){
					$.getJSON("http://suggestqueries.google.com/complete/search?callback=?",
			            {
			              "hl":"en", // Language
			              "jsonp":"suggest", // jsonp callback function name
			              "q":query, // query term
			              "client":"youtube" // force youtube style response, i.e. jsonp
			            }
			    	);
				}, 100);
			}
		}
	});

	$('#search').submit(function(e){
		$('#search').fadeOut(function(){
			var query = $('#query').val();
			if(query.match(urlRegex) && query.indexOf("?") !== 0){
				window.location = query;
				return false;
			}
			if(query.indexOf("?") === 0){
				query = query.substring(1);
			}
			window.location = "https://google.com/#q=" + encodeURIComponent(query);
		});
		return false;
	});

	setInterval(function(){
		if((placeholders[currentPlaceholder+1]) === undefined){
			$('#query').attr('placeholder', 'Search for ' + placeholders[0] + '...');
			currentPlaceholder = 0;
		}else{
			currentPlaceholder++;
			$('#query').attr('placeholder', 'Search for ' + placeholders[currentPlaceholder] + '...');
		}
	}, 5000);
});