

 document.addEventListener("DOMContentLoaded", function() {
	//Toggle Nav Menu
	document.getElementById("menu").onclick=function(){
	    var navmenu = document.getElementById('mobile-navigation');
	    var button = document.getElementById('toggle-wrapper');
	    navmenu.classList.toggle('toggled');
	    button.classList.toggle('toggled');
	}
	//Learn More Launch Alerts Button window.
	document.getElementById("learn-more-btn").onclick=function(){
 		var dialog = document.getElementById('learn-more-dialog');
 		dialog.classList.toggle('learn-more-toggled');

 		var plusMinus = document.getElementById('plus-minus');
 		plusMinus.classList.toggle('fa-plus');
 		plusMinus.classList.toggle('fa-minus');
 	}
});



//Mailchimp API Form Submission.
document.addEventListener("DOMContentLoaded", function() {
	document.getElementById("mc-form").addEventListener("submit", function submit(e){
		e.preventDefault();

		var data = "email=" + encodeURIComponent(document.getElementById("mc-email").value);
		var endpoint = document.getElementById("mc-form").getAttribute('action');
		
		function formSubmit(callback){
			var request = new XMLHttpRequest();
			
				request.onreadystatechange = function() {
					if (request.readyState === 4) {
			  		  if (request.status === 200) {
						//Parse returned string into an object, then pass the object to the callback function.
			        	var response = JSON.parse(request.responseText);
			       		callback(response);
			  		  } else {
			       console.log('JSON request error');
			    		}
					}
				}
			request.open("POST", endpoint , true);
			request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			request.send(data);
		}
		//Callback to show outcome of form submission
		function formResponse(response){
			if(response.id){
	        //successful adds will have an id attribute on the object
	        //Modals??
	        alert('Thank you for signing up for Launch Alerts!');
	      } else if (response.title == 'Member Exists') {
	        //MC wil send back an error object with "Member Exists" as the title
	        alert('You are already signed up for Launch Alerts!');
	      } else {
	        //something went wrong with the API call
	      	alert('Something went wrong. Please resubmit your email!');
	      }
	    }
		formSubmit(formResponse);
	})
});
/*//Clear form starting values when focused.
function fillField(input){
      if(input.value == "")
         input.value= "Email Address";
};
function clearField(input){
      if(input.value == "Email Address")
         input.value="";
};*/
//Request LaunchLibrary API data and pass to callback
function data(callback){
	var url = 'https://launchlibrary.net/1.2/launch/next/1024/mode=verbose';
	var request = new XMLHttpRequest();
		request.onreadystatechange = function() {
			if (request.readyState === 4) {
			    if (request.status === 200) {
			        document.body.className = 'ok';
					//Parse returned string into an object, then pass the object to the callback function.
			        var data = JSON.parse(request.responseText);
			        callback(data);
			    } else {
			        document.body.className = 'error';
			    }
			}
		};
	request.open("GET", url , true);
	request.send(null);
}
//Callback function to handle LaunchLibrary.net data
function launchDisplay(data){
	console.log(data);
	//Array of html data to print to page for each launch
	var launchArray = [];
	//Gather and store relevant data
	var names = [];
	var timestamps = [];
	var agencies = [];
 	var rockets = [];
	var missions = [];
	var launchMonth = [];
	var launchDay = [];
	var launchYear = [];
	var timeCheck = [];
	var launchDate = [];
	var wsstamp = [];
	var westamp = [];
	var windowOpenMin = [];
	var windowOpenHr = [];
	var windowCloseHr = [];
	var windowCloseMin = [];
	var netClass = [];
	var vidLink = [];
	var launchID = [];
	var locations = [];


	for(i = 0; i < data.launches.length; i++){
		//Get the names of the rockets and missions
		names.push(data.launches[i].name);	
	}
	//Split the Rockets and Missions apart and save them as separate variables.
	for (i = 0; i < names.length; i++) {
	    var temp = names[i].split(" | ");
	    temp[0] = temp[0].replace(/Full Thrust/g, 'FT');
	    rockets.push(temp[0]);
	    missions.push(temp[1]);
	}	
	for(i = 0; i < data.launches.length; i++){
		//Get Date information
		if(data.launches[i].windowstart === null){
			timestamps.push('Launch Ended');
		}else{
			timestamps.push(data.launches[i].windowstart);	
		}
		
		//Get Launch ID
		launchID.push(' id="' + data.launches[i].id);
		//Get unix timestamp for window opening and closing times
		wsstamp.push(data.launches[i].wsstamp);
		westamp.push(data.launches[i].westamp);
		//Get the name of the primary Launch Provider, and format it properly, or add an agency to the list.
		for(j = 0; j < 1; j++){
			if(data.launches[i].rocket.agencies.length > 0){
				if(data.launches[i].rocket.agencies[j].name === 'Lockheed Martin'){
					agencies.push('ULA');
				}else if(data.launches[i].rocket.agencies[j].name === 'United Launch Alliance'){
					agencies.push('ULA');
				}else if(data.launches[i].rocket.agencies[j].name === 'Orbital Sciences Corporation'){
					agencies.push('Orbital ATK');
				}else if(data.launches[i].rocket.agencies[j].name === 'Khrunichev State Research and Production Space Center'){
					agencies.push('Russia');
				}else if(data.launches[i].rocket.agencies[j].name === 'EADS Astrium Space Transportation'){
					agencies.push('Arianespace');
				}else if(data.launches[i].rocket.agencies[j].name === 'Avio S.p.A'){
					agencies.push('Avio');
				}else if(data.launches[i].rocket.agencies[j].name === 'Indian Space Research Organization'){
					agencies.push('India (ISRO)');
				}else if(data.launches[i].rocket.agencies[j].name === 'China Academy of Space Technology'){
					agencies.push('China');
				}else{
					agencies.push(data.launches[i].rocket.agencies[j].name);
				}
			}else if(rockets[i].indexOf('Long March') >= 0){
					agencies.push('China');
			}else if(rockets[i].indexOf('Soyuz') >= 0 || rockets[i].indexOf('Proton') >= 0){
					agencies.push('Russia');
			}else if(rockets[i].indexOf('Rokot') >= 0){
					agencies.push('Eurokot');
			}else if(rockets[i].indexOf('GSLV') >= 0){
					agencies.push('India (ISRO)');
			}else if(rockets[i].indexOf('Electron') >= 0){
					agencies.push('Rocket Lab');
			}else if(rockets[i].indexOf('SLS') >= 0){
					agencies.push('NASA');
			}else{
					agencies.push('');
			}
		}
		//Get Webcast Link
		for(j = 0; j < 1; j++){
			if(data.launches[i].vidURLs.length > 0){
				vidLink.push(data.launches[i].vidURLs[j]);
			}else{
				vidLink.push('');
			}
		}
		//Get launchpad information
		for(j = 0; j < 1; j++){
			if (data.launches[i].location.pads.length > 0) {
				locations.push(data.launches[i].location.pads[j].name);
			}else{
				locations.push('Launchpad information not available')
			}
		}
	}

	//Split timestamps array into Month, Date, Year, timeCheck arrays
	for (i = 0; i < timestamps.length; i++) {

		var temp = timestamps[i].split(" ");
		launchMonth.push(temp[0]);
		launchDay.push(temp[1]);
		launchYear.push(temp[2]);		
		timeCheck.push(temp[3]);
	}
	//Check if launch time is confirmed, and display date as confirmed. If time not confirmed, display NET before date.
	for(i = 0; i < timestamps.length; i++){
		var currentYear = new Date().getFullYear();
		if(timeCheck[i] === "00:00:00" &&  launchYear[i] == currentYear || launchMonth[i] == 'January'){
			launchDate.push('NET ' + launchMonth[i] + ' ' + launchDay[i] + ' ' + launchYear[i]);
			netClass.push(' net');//add class to launch when NET 
		}else if(timeCheck[i] === "00:00:00" &&  launchYear[i] !== currentYear){
			launchDate.push('NET ' + launchMonth[i] + ' ' + launchYear[i]);
			netClass.push(' net');//add class to launch when NET
		}
		else{
			launchDate.push(launchMonth[i] + ' ' + launchDay[i] + ' ' +  launchYear[i]);
			netClass.push(' highlighted');//add highlighted class if not NET.
		}
	}
	//Convert Window Start time to local time
	for(i = 0; i < wsstamp.length; i++){
		var localTimeStart = new Date(wsstamp[i] * 1000);
		var hr = localTimeStart.getHours();
		var min = localTimeStart.getMinutes();
		if(min<10) {
			min='0'+min
		}
		windowOpenHr.push(hr);
		windowOpenMin.push(min);
	}
	//Convert Window End Time to local time
	for(i = 0; i < westamp.length; i++){
		var localTimeStart = new Date(westamp[i] * 1000);
		var hr = localTimeStart.getHours();
		var min = localTimeStart.getMinutes();
		if(min<10) {
			min='0'+min
		}
		windowCloseHr.push(hr);
		windowCloseMin.push(min);
	}
	//Format Times                                                                                                                                                                                
	function window(hr, min){
		if(hr<12){
			if(hr === 0){
				return (hr+12) + ':' + min + ' am';
			}else{
				return hr + ':' + min + ' am';
			}
		}else {
			return (hr-12) + ':' + min + ' pm';
		}
	}
	//If default timestamp, don't display time.  If instantaneous launch window, display only open time. If launch window lasts a bit, display range.
	function launchTime(open, close, stamp){
		if(stamp === 0){
			return '<p class="time time-null">TBD</p>';
		}else if (open === close){
			return '<p class="time time-' + (i+1) + '">' + open + '</p>';
		}
		else{
			return '<p class="time time-' + (i+1) + '">Window: ' + open + '-' + close + '</p>';
		}
	}
	function webcast(link){
		if(link !== ""){
			return '<p class="webcast"><a href="' + link + '" title="Watch this launch!" target="_blank"><i class="fa fa-rocket" aria-hidden="true"></i>  Watch webcast</a></p>';
		
		}else{
			return '<p class="no-webcast">Webcast currently unavailable</p>';
		}
	}
	//Compile information for display, and push to launchArray
	for(i = 0; i < data.launches.length; i++){
		var launchInfo = '';
		launchInfo += '<div' + launchID[i] + '" class="launch' + netClass[i]  + '">';
		launchInfo += '<p class="agency agency-' + (i+1) + '">' + agencies[i] + '</p>';
		launchInfo += webcast(vidLink[i]);
		launchInfo += '<h3 class="rocket rocket-' + (i+1) + '">' + rockets[i] + '</h3>';
		launchInfo += '<h3 class="mission mission-' + (i+1) + '">' + missions[i] + '</h3>'; 
		launchInfo += '<p class="date date-' + (i+1) + '">' + launchDate[i] + '</p>'; 
		launchInfo += launchTime(window(windowOpenHr[i], windowOpenMin[i]), window(windowCloseHr[i], windowCloseMin[i]), wsstamp[i]); 
		launchInfo += '<p class="launchpad launchpad-' + (i+1) + '">' + locations[i] + '</p></div>';
		launchArray.push(launchInfo);
	}
	//Display only the first 24 launches, and add a show all launches button to show the rest.
	function paginate(){
		var main = document.getElementById("launches-main");

		for(i = 0; i < launchArray.length; i++){
			if(main !== null){
				if(i < 24){
					main.innerHTML += launchArray[i];
				}
			}else{
				if(i< 8){
					document.getElementById("launches-side").innerHTML += launchArray[i];
				}
			}
		}
		if(main !== null){
			main.innerHTML += '<button id="more-launches" class="highlighted"><p>Show All Launches</p></button>';
			document.getElementById("more-launches").onclick=function(){
				main.innerHTML = '';
				for(i = 0; i < launchArray.length; i++){
					main.innerHTML += launchArray[i];
				}
			}
		}
	} 
	paginate();
	console.log();
}
data(launchDisplay);
