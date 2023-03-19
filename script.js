
const DEBUG = false

var document_root = document.querySelector(":root");


function load_feed() {
  const show_div = document.getElementById("show_stuff");
  show_div.innerHTML = "";

  var num_users = 0;
  var plugged_in_users = 0;


  if (!DEBUG){
    fetch('https://api.chargd.social/battery')
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log(data);

      for (const username in data) {
        num_users += 1;
        const personDiv = document.createElement("div");

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

        show_div.appendChild(personDiv);
      }

      set_circle_percentage((plugged_in_users / num_users) * 100);
    })
  }
  else {

    show_div.innerHTML = `
    <div>
    <div class="feed_item">
    <p class="feed_timestamp">today at 00:00am</p>
    <h1 class="feed_username">PERSON!</h1>
    <h2 class="feed_actiontext"> plugged in their phone.</h2>
    <h1 class="feed_percentage">90%</h1>
    <p class="feed_captionbox">some caption</p>
    </div>
    </div>
    `;
  }

}


window.onload = (event) => {
  set_circle_percentage(100);
  load_feed();
};


document.querySelector('button')
.addEventListener('click', (e) => {
  e.preventDefault(); // no idea what this does i copied it from somewhere
  load_feed()
});







function set_circle_percentage(val) { // percent from 0-100

  const circle_radius = 120;
  const circle_circum = Math.PI*(circle_radius*2);

  if (val < 0) { val = 0;}
  if (val > 100) { val = 100;}

  var percent = ((100-val)/100)*circle_circum;

  document_root.style.setProperty("--progress-bar-percent", percent);
  console.log(percent)

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
