let API_KEY = "AIzaSyCU7LomXvsy8Q-atxxHJmH3ZuAiPceVoXc"
const videoCardContainer = document.querySelector('.videoCardContainer');
let video_http = "https://www.googleapis.com/youtube/v3/videos?";
let channel_http = "https://www.googleapis.com/youtube/v3/channels?";


// fetching
fetch(video_http + new URLSearchParams({
    key: API_KEY,
    part: 'snippet',
    chart: 'mostPopular',
    maxResults: 20,
    regionCode: 'IN'
}))
.then(res => res.json())
.then(data => {
    console.log(data)
    data.items.forEach(item => {
        getChannelIcon(item);
    })
})
.catch(err => console.error(err));

const getChannelIcon = (video_data) => {
    fetch(channel_http + new URLSearchParams({
        key: API_KEY,
        part: 'snippet',
        id: video_data.snippet.channelId
    }))
    .then(res => res.json())
    .then(data => {
        video_data.channelThumbnail = data.items[0].snippet.thumbnails.default.url;
        makeVideoCard(video_data);
    })
}

const makeVideoCard = (data) => {
    console.log(data.id)
    videoCardContainer.innerHTML += `
    <div class="col">
    <div class="card">
    <iframe class="card-img-top" src="https://www.youtube.com/embed/${data.id}"></iframe>
        <div class="content card-body">
        <img src="${data.channelThumbnail}" class="channel-icon" alt="">
            <div class="info">
                <h6 class="title">${data.snippet.title}</h6>
                <p class="channel-name">${data.snippet.channelTitle}</p>
            </div>
        </div>
    </div>
    </div>
    
    `;
}


// form
const searchInput = document.querySelector('.search-bar');
const searchBtn = document.querySelector('.search-btn');
let searchLink = "https://www.youtube.com/results?search_query=";
const formObj = document.getElementById("myForm")

formObj.addEventListener("submit",(e)=>{
    e.preventDefault()
    if(searchInput.value.length){
        location.href = searchLink + searchInput.value;
    }
})


// sign-in
function authenticate() {
    return gapi.auth2.getAuthInstance()
        .signIn({scope: "https://www.googleapis.com/auth/youtube.force-ssl"})
        .then(function() { console.log("Sign-in successful"); },
              function(err) { console.error("Error signing in", err); });
  }
  function loadClient() {
    gapi.client.setApiKey("AIzaSyCU7LomXvsy8Q-atxxHJmH3ZuAiPceVoXc");
    return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
        .then(function() { console.log("GAPI client loaded for API"); },
              function(err) { console.error("Error loading GAPI client for API", err); });
  }
  // Make sure the client is loaded and sign-in is complete before calling this method.
  function execute() {
    return gapi.client.youtube.search.list({
      "part": [
        "snippet"
      ],
      "maxResults": 5
    })
        .then(function(response) {
                // Handle the results here (response.result has the parsed body).
                console.log("Response", response);
              },
              function(err) { console.error("Execute error", err); });
  }
  gapi.load("client:auth2", function() {
    gapi.auth2.init({client_id: "725121126436-5flbb3htfh905rap6bmg3q6srtm782hc.apps.googleusercontent.com"});
  });