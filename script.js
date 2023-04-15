// api key
let API_KEY = 'AIzaSyB2SRF1HdeuLY3A0vL1MroY5OEtTawhYsE'

// div where videos get append
const videoCardContainer = document.querySelector('.videoCardContainer');

// youtube api links
let video_http = "https://www.googleapis.com/youtube/v3/videos?";
let channel_http = "https://www.googleapis.com/youtube/v3/channels?";
let playlist_http = "https://www.googleapis.com/youtube/v3/playlists?"
let keyword_http = "https://www.googleapis.com/youtube/v3/search?"



// getting channel icon
const getChannelIcon = (video_data) => {
    fetch(channel_http + new URLSearchParams({
        key: API_KEY,
        part: 'snippet',
        id: video_data.snippet.channelId
    }))
        .then(res => res.json())
        .then(data => {
            let channelIcon = data.items[0].snippet.thumbnails.default.url;
            makeVideoCard(video_data, channelIcon);
        })
}

// making card for each video and appending
const makeVideoCard = (data, channelIcon) => {
    let id = data.id
    
    videoCardContainer.innerHTML += `
    <div class="col">
    <div class="card">
    <img class="video card-img-top" src="${data.snippet.thumbnails.high.url}" class="thumbnail" alt="${data.snippet.title}">
        <div class="content card-body">
        <img src="${channelIcon}" class="channel-icon" alt="">
            <div class="info">
                <h6 class="title">${data.snippet.title}</h6>
                <p class="channel-name">${data.snippet.channelTitle}</p>
                <button onClick="onClickFunc()">Watch video</button>
            </div>
        </div>
    </div>
    </div>
    `;
    function onClickFunc(){
        watchVideo(id)
    }
}


// to get most popular videos
async function getMostPopularVideos() {
    try {
        videoCardContainer.innerHTML = ""
        const res = await fetch(`https://youtube.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&maxResults=1&regionCode=IN&key=${API_KEY}`)
        const data = await res.json()
            data.items.forEach(item => {
                getChannelIcon(item);
            })
    } catch (error) {
        console.error(error)
    }
}
getMostPopularVideos()


// form
const searchInput = document.querySelector('.search-bar');
const searchBtn = document.querySelector('.search-btn');
const formObj = document.getElementById("myForm")

formObj.addEventListener("submit", async (e) => {
    
    e.preventDefault()
    if (searchInput.value.length) {
        const fetchURL = await fetch(`${keyword_http}part=snippet&maxResults=5&q=${searchInput.value}&key=${API_KEY}`)
        const data = await fetchURL.json()
        videoCardContainer.innerHTML = ""
        data.items.forEach(item => {
            getChannelIcon(item);
        })
    }
    else{
        alert("Type Something to Search")
    }
})




// watch video
async function watchVideo(id){
    videoCardContainer.innerHTML = ""
    const fetchURL = await fetch(`https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${id}&key=${API_KEY}`)
    const data = await fetchURL.json()
    console.log(data)
    const videoData = data.items[0]
    videoCardContainer.innerHTML = `
    <div class="card" style="width: 100%;">
    <iframe class="video card-img-top" src="https://www.youtube.com/embed/${videoData.id}"></iframe> 
  <div class="card-body">
    <h5 class="card-title">${videoData.snippet.title}</h5>
    <p class="card-text">${videoData.snippet.description}</p>
    <button onClick='getMostPopularVideos()'>Back</button>
  </div>
</div>
    `
}


function authenticate() {
    return gapi.auth2.getAuthInstance()
        .signIn({scope: "https://www.googleapis.com/auth/youtube.readonly"})
        .then(function() { console.log("Sign-in successful"); },
              function(err) { console.error("Error signing in", err); });
  }
  function loadClient() {
    gapi.client.setApiKey("AIzaSyB2SRF1HdeuLY3A0vL1MroY5OEtTawhYsE");
    return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
        .then(function() { console.log("GAPI client loaded for API"); },
              function(err) { console.error("Error loading GAPI client for API", err); });
  }
  // Make sure the client is loaded and sign-in is complete before calling this method.
  function execute() {
    return gapi.client.youtube.playlists.list({
      "part": [
        "snippet,contentDetails"
      ],
      "maxResults": 25,
      "mine": true
    })
        .then(function(response) {
                // Handle the results here (response.result has the parsed body).
                console.log("Response", response);
              },
              function(err) { console.error("Execute error", err); });
  }
  gapi.load("client:auth2", function() {
    gapi.auth2.init({client_id: "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"});
  });