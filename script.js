
const DEBUG = false // this doesn't do anything rn but maybe it could

var api_url = "https://api.chargd.social" // can change this during debug
api_url = "http://localhost:3000"


var document_root = document.querySelector(":root");


// fetch the feed and laod it into the page
function load_feed() {
  const show_div = document.getElementById("show_stuff");
  const new_div = document.createElement("div");

  const show_battery = document.getElementById("temp-battery-display")
  show_battery.innerHTML = ""
  const battery_div = document.createElement("div"); // to show the battery visualisation

  // keep track of number of users to use to set the circular progress bar
  var num_users = 0;
  var plugged_in_users = 0;

  fetch(api_url + '/battery')
  .then((res) => {
    return res.json();
  })
  .then((data) => {
    console.log(data);

    var current_count = 0;

    // add each user


    for (const username in data) {
      num_users += 1;
      const personDiv = document.createElement("div");
      const new_battery = document.createElement("div");

      var text = ""

      const plugin_text = data[username]["is_plugin"] == "true" ? "plugged in" : "unplugged";
      plugged_in_users += (data[username]["is_plugin"] == "true") ? 1 : 0

      const timestamp = format_time(data[username]["timestamp"])

      text = `<div class="feed_item">
      <p class="feed_timestamp">${timestamp}</p>
      <h1 class="feed_username">${username}</h1>
      <h2 class="feed_actiontext"> ${plugin_text} their phone.</h2>
      <h1 class="feed_percentage">${data[username]["battery"]}%</h1>
      <p class="feed_captionbox">${data[username]["caption"]}</p>
      </div>
      `

      personDiv.innerHTML = text;

      new_div.appendChild(personDiv);



      text = `

				<p class="battery-username">${username}</p>


				<div class="battery-display">
					<svg viewBox="0 0 84 40" fill="none" xmlns="http://www.w3.org/2000/svg">
						<rect class="battery-stroke" x="2" y="2" width="76" height="36" rx="6" stroke-width="4"/>
						<path class="battery-stroke battery-fill" d="M78 14H80C81.1046 14 82 14.8954 82 16V25C82 26.1046 81.1046 27 80 27H78V14Z" stroke-width="4"/>
						<path class="battery-chargeindicator" d="M78.07 21.3421L79.8184 15.1018C79.9125 14.766 80.4072 14.834 80.4072 15.1828V19.575C80.4072 19.7407 80.5415 19.875 80.7072 19.875H81.8308C82.0948 19.875 82.2864 20.1263 82.2166 20.3809L80.4399 26.8532C80.3473 27.1904 79.8506 27.1235 79.8506 26.7738V22.15C79.8506 21.9843 79.7163 21.85 79.5506 21.85H78.4552C78.1903 21.85 77.9985 21.5972 78.07 21.3421Z"/>
					</svg>

					<div class="battery-inside">
						<p class="battery-percentage">${data[username]["battery"]}%</p>
						<p class="battery-time">${timestamp}</p>
					</div>
				</div>


      `

      new_battery.innerHTML = text;
      new_battery.classList.add("battery")
      if (data[username]["is_plugin"] == "true") {
        new_battery.classList.add("plugged-in")
      }

      new_battery.style.setProperty("--cur-count", num_users - 1);

      show_battery.appendChild(new_battery)
    }

    // update the div
    show_div.innerHTML = "";
    show_div.appendChild(new_div);


    // show_battery.innerHTML = "";
    // show_battery.appendChild(battery_div);

    // update the circle percentage bar
    set_circle_percentage((plugged_in_users / num_users) * 100);

    document_root.style.setProperty("--total-users", num_users);

  })


}


window.onload = (event) => {
  load_feed();
};


document.querySelector('button')
.addEventListener('click', (e) => {
  e.preventDefault(); // no idea what this does i copied it from somewhere
  load_feed()
});







function set_circle_percentage(val) { // set the percentage on the circle progress bar for percent of users connected

  // constants — taken from the svg
  const circle_radius = 120;
  const circle_circum = Math.PI*(circle_radius*2);

  // clamp value
  if (val < 0) { val = 0;}
  if (val > 100) { val = 100;}

  // calculate length of path
  var percent = ((100-val)/100)*circle_circum;

  // set length of path
  document_root.style.setProperty("--progress-bar-percent", percent);
  console.log(percent) // debug

}



















function format_time(unix) {
  var post_date = new Date(unix * 1000); // multiplied by 100 so it's in milliseconds
  var formatted_post_time = ("0" + post_date.getHours()).substr(-2) + ':' + ("0" + post_date.getMinutes()).substr(-2);


  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = post_date.getFullYear();
  var month = months[post_date.getMonth()];
  var date = post_date.getDate();

  var current_date = new Date();

  var msPerMinute = 60 * 1000;
  var msPerHour = msPerMinute * 60;
  var msPerDay = msPerHour * 24;
  var msPerMonth = msPerDay * 30;
  var msPerYear = msPerDay * 365;

  var elapsed = current_date.getTime() - post_date.getTime();

  if (elapsed < msPerMinute) {
    return Math.round(elapsed/1000) + ' seconds ago';
  }

  else if (elapsed < msPerHour) {
    return Math.round(elapsed/msPerMinute) + ' minutes ago';
  }

  else if (elapsed < msPerDay ) {
    return 'today at ' + formatted_post_time;
  }

  else {
    return month + ' ' + date + ' ' + formatted_post_time;
  }

}
