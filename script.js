
function load_feed() {
  const show_div = document.getElementById("show_stuff");
  show_div.innerHTML = "";


  fetch('https://api.chargd.social/battery')
  .then((res) => {
    return res.json();
  })
  .then((data) => {
    console.log(data);

    for (const username in data) {
      const personDiv = document.createElement("div");

      var text = ""

      const plugin_text = data[username]["is_plugin"] == "true" ? "plugged in" : "unplugged";

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

      show_div.appendChild(personDiv);

    }
  })
}

document.querySelector('button')
.addEventListener('click', (e) => {
  e.preventDefault(); // no idea what this does i copied it from somewhere
  load_feed()
});




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
