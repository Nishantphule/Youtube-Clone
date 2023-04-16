// api key
let API_KEY = 'AIzaSyDOCyR8hRpnGumCXtZdDnegkms9pvhjWQA'

// div where videos get append
const videoCardContainer = document.querySelector('.videoCardContainer');

// youtube api links
let video_http = "https://www.googleapis.com/youtube/v3/videos?";
let channel_http = "https://www.googleapis.com/youtube/v3/channels?";
let playlist_http = "https://www.googleapis.com/youtube/v3/playlists?"
let keyword_http = "https://www.googleapis.com/youtube/v3/search?"
let activity_http = "https://youtube.googleapis.com/youtube/v3/activities?"


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
  let colDiv = document.createElement("div")
  colDiv.classList = "col"

  let cardDiv = document.createElement("div")
  cardDiv.classList = "card"
  colDiv.appendChild(cardDiv)

  let cardImg = document.createElement("img")
  cardImg.classList = "video card-img-top"
  cardImg.src = data.snippet.thumbnails.high.url
  cardImg.alt = data.snippet.title
  cardImg.title = "Watch Video"
  cardImg.style.cursor = "pointer"
  cardImg.addEventListener("click", () => {
    if (typeof data.id === "string") {
      watchVideo(data.id)
    }
    else {
      watchVideo(data.id.videoId)
    }
  })

  let cardBody = document.createElement("div")
  cardBody.classList = "content card-body"
  cardDiv.append(cardImg, cardBody)

  let icon = document.createElement("img")
  icon.classList = "channel-icon"
  icon.src = channelIcon
  icon.alt = data.snippet.channelTitle
  icon.title = "View Channel"
  icon.style.cursor = "pointer"
  icon.addEventListener("click", () => {
    getChannelDetails(data.snippet.channelId)
  })

  let infoDiv = document.createElement("div")
  infoDiv.classList = "info"
  cardBody.append(icon, infoDiv)

  let title = document.createElement("h6")
  title.classList = "title"
  title.innerText = data.snippet.title

  let name = document.createElement("p")
  name.classList = "channel-name"
  name.innerText = data.snippet.channelTitle
  name.title = "Visit Channel"
  name.style.cursor = "pointer"
  name.addEventListener("click", () => {
    getChannelDetails(data.snippet.channelId)
  })
  infoDiv.append(title, name)
  videoCardContainer.appendChild(colDiv)
}


// to get most popular videos
async function getMostPopularVideos() {
  try {
    videoCardContainer.innerHTML = ""
    videoCardContainer.classList="videoCardContainer row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4 mt-3"
    const res = await fetch(`${video_http}part=snippet&chart=mostPopular&maxResults=10&regionCode=IN&key=${API_KEY}`)
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
  localStorage.setItem("recent", JSON.stringify("none"))
  filterFunc()
  e.preventDefault()
  if (searchInput.value.length) {
    const fetchURL = await fetch(`${keyword_http}part=snippet&maxResults=10&q=${searchInput.value}&key=${API_KEY}`)
    const data = await fetchURL.json()
    videoCardContainer.innerHTML = ""
    videoCardContainer.classList="videoCardContainer row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4 mt-3"
    data.items.forEach(item => {
      getChannelIcon(item);
    })
  }
  else {
    alert("Type Something to Search...!")
  }
})


// watch video
async function watchVideo(id) {
  videoCardContainer.innerHTML = ""
  localStorage.setItem("recent", JSON.stringify("none"))
  filterFunc()
  const fetchURL = await fetch(`${video_http}part=snippet%2CcontentDetails%2Cstatistics&id=${id}&key=${API_KEY}`)
  const data = await fetchURL.json()
  const videoData = data.items[0]
  let length = (videoData.snippet.description).split("").length
  let description = (videoData.snippet.description).split("").slice(0, 200).join("")
  let rest = (videoData.snippet.description).split("").slice(200, length).join("")

  const cardDiv = document.createElement("div")
  cardDiv.classList = "card"
  cardDiv.style.width = "100%"

  const iframeDiv = document.createElement("iframe")
  iframeDiv.classList = "youtubeVideo card-img-top"
  iframeDiv.src = `https://www.youtube.com/embed/${videoData.id}`
  iframeDiv.setAttribute("allowFullscreen","")

  const bodyDiv = document.createElement("div")
  bodyDiv.classList = "card-body"
  cardDiv.append(iframeDiv, bodyDiv)

  const title = document.createElement("h5")
  title.classList = "card-title"
  title.innerText = videoData.snippet.title

  const pTag = document.createElement("p")
  pTag.classList = "card-text"
  pTag.innerHTML = description

  const Span1 = document.createElement("span")
  Span1.id = "dots"
  Span1.innerHTML = "..."
  Span1.style.display = "inline"

  const span2 = document.createElement("span")
  span2.id = "more"
  span2.innerHTML = rest
  span2.style.display = "none"
  pTag.append(Span1, span2)

  const readBtn = document.createElement("button")
  readBtn.id = "myBtn"
  readBtn.innerHTML = "Read More"

  bodyDiv.append(title, pTag, readBtn)
  videoCardContainer.appendChild(cardDiv)

  readBtn.addEventListener("click", (e) => {
    var dots = document.getElementById("dots");
    var moreText = document.getElementById("more");
    var btnText = document.getElementById("myBtn");
    if (dots.style.display === "none") {
      dots.style.display = "inline";
      btnText.innerHTML = "Read more";
      moreText.style.display = "none";
    } else {
      dots.style.display = "none";
      btnText.innerHTML = "Read less";
      moreText.style.display = "inline";
    }
  })
}


// filter
const filterButtons = document.querySelectorAll(".search-filter")
filterButtons.forEach((btn) => btn.addEventListener("click", async (e) => {
  let filterValue = e.target.firstChild.nodeValue
  localStorage.setItem("recent", JSON.stringify(filterValue))
  const fetchURL = await fetch(`${keyword_http}part=snippet&maxResults=10&q=${filterValue}&key=${API_KEY}`)
  const data = await fetchURL.json()
  filterFunc()
  videoCardContainer.innerHTML = ""
  videoCardContainer.classList="videoCardContainer row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4 mt-3"
  data.items.forEach(item => {
    getChannelIcon(item);
  })
}))

function filterFunc() {
  let data = JSON.parse(localStorage.getItem("recent"))
  filterButtons.forEach(btn => {
    if (btn.innerText !== data) {
      btn.classList = "search-filter"
    }
    else {
      btn.classList = 'search-filter bg-primary'
    }
  })
}



// get channel details
async function getChannelDetails(id) {
  videoCardContainer.innerHTML = ""
  videoCardContainer.classList="videoCardContainer"
  localStorage.setItem("recent", JSON.stringify("none"))
  filterFunc()

  // channel details
  const fetchURL = await fetch(`${channel_http}part=snippet%2CcontentDetails%2Cstatistics&id=${id}&key=${API_KEY}`)
  const data = await fetchURL.json()
  const videoData = data.items[0]

  // channel playlist
  const playlistURL = await fetch(`${playlist_http}part=snippet%2CcontentDetails&channelId=${id}&maxResults=3&key=${API_KEY}`)
  const playlistData = await playlistURL.json()
  playlistCard = playlistData.items

  // activity
  const activityURL = await fetch(`${activity_http}part=snippet%2CcontentDetails&channelId=${id}&maxResults=3&key=${API_KEY}`)
  const activityData = await activityURL.json()
  activityCard = activityData.items
  
let viewCount = videoData.statistics.viewCount
if(viewCount>=1000000 && viewCount<1000000000){
  viewCount = `${(videoData.statistics.viewCount / 1000000).toFixed()} M`
}
else if(viewCount>=1000000000){
  viewCount = `${(videoData.statistics.viewCount / 1000000000).toFixed()} B`
}
else if(viewCount<=1000000){
  viewCount = `${(videoData.statistics.viewCount / 1000).toFixed()} K`
}
  videoCardContainer.innerHTML = `
    
    <div class="card mb-3 p-2 mt-3">
  <div class="row g-0">
    <div class="col-md-4">
      <img src="${videoData.snippet.thumbnails.default.url}" class="channelIcon rounded-circle" alt="${videoData.snippet.title}">
    </div>
    <div class="col-md-8">
      <div class="card-body">
        <h4 class="card-title  position-relative">
        ${videoData.snippet.title} 
        <small class="text-muted">
        ${videoData.snippet.customUrl}
        </small><span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
        ${videoData.snippet.country}
        <span class="visually-hidden">country</span>
      </span> </h4>
        <h5 class="card-title">${videoData.statistics.subscriberCount} Subscribers ${videoData.statistics.videoCount} Videos <br/> ${viewCount} Views</h5>
        <p class="card-text">${videoData.snippet.localized.description}</p>
      </div>
    </div>
  </div>
</div>

<nav>
  <div class="nav nav-tabs" id="nav-tab" role="tablist">
    <button class="nav-link active" id="nav-playlist-tab" data-bs-toggle="tab" data-bs-target="#nav-playlist" type="button" role="tab" aria-controls="nav-playlist" aria-selected="true">Playlist</button>
    <button class="nav-link" id="nav-activity-tab" data-bs-toggle="tab" data-bs-target="#nav-activity" type="button" role="tab" aria-controls="nav-activity" aria-selected="false">Recent Activity</button>
    <button class="nav-link" id="nav-about-tab" data-bs-toggle="tab" data-bs-target="#nav-about" type="button" role="tab" aria-controls="nav-about" aria-selected="false">About Channel</button>
  </div>
</nav>


<div class="tab-content" id="nav-tabContent">
  <div class="tab-pane fade show active" id="nav-playlist" role="tabpanel" aria-labelledby="nav-playlist-tab">
  <div class="row row-cols-1 row-cols-md-2 g-4">

  <div class="col">
  <div class="card">
  <img src="${playlistCard[0].snippet.thumbnails.default.url}" class="card-img-top" alt="${playlistCard[0].snippet.title}">
  <div class="card-body">
    <h5 class="card-title">${playlistCard[0].snippet.title}</h5>
    <small>${playlistCard[0].contentDetails.itemCount} Videos</small>
  </div>
  </div>
  </div>
  
  <div class="col">
  <div class="card">
  <img src="${playlistCard[1].snippet.thumbnails.default.url}" class="card-img-top" alt="${playlistCard[1].snippet.title}">
  <div class="card-body">
    <h5 class="card-title">${playlistCard[1].snippet.title}</h5>
    <small>${playlistCard[1].contentDetails.itemCount} Videos</small>
  </div>
  </div>
  </div>
  
  <div class="col">
  <div class="card">
  <img src="${playlistCard[2].snippet.thumbnails.default.url}" class="card-img-top" alt="${playlistCard[2].snippet.title}">
  <div class="card-body">
    <h5 class="card-title">${playlistCard[2].snippet.title}</h5>
    <small>${playlistCard[2].contentDetails.itemCount} Videos</small>
    </div>
  </div>
  </div>
  
  </div></div>
  
  
  <div class="tab-pane fade" id="nav-activity" role="tabpanel" aria-labelledby="nav-activity-tab">
<div class="row row-cols-1 row-cols-md-2 g-4" ;>
  
<div class="col">
<div class="card">
<img src="${activityCard[0].snippet.thumbnails.default.url}" class="card-img-top" alt="${activityCard[0].snippet.title}">
<div class="card-body">
  <h5 class="card-title">${activityCard[0].snippet.title}</h5>
  <small>${(activityCard[0].snippet.publishedAt).split("").slice(0, 10).join("")} Upload</small>
</div>
</div>
</div>

<div class="col">
<div class="card">
<img src="${activityCard[1].snippet.thumbnails.default.url}" class="card-img-top" alt="${activityCard[1].snippet.title}">
<div class="card-body">
  <h5 class="card-title">${activityCard[1].snippet.title}</h5>
  <small>${(activityCard[1].snippet.publishedAt).split("").slice(0, 10).join("")} Upload</small>
</div>
</div>
</div>

<div class="col">
<div class="card">
<img src="${activityCard[2].snippet.thumbnails.default.url}" class="card-img-top" alt="${activityCard[2].snippet.title}">
<div class="card-body">
  <h5 class="card-title">${activityCard[2].snippet.title}</h5>
  <small>${(activityCard[2].snippet.publishedAt).split("").slice(0, 10).join("")} Upload</small>
</div>
</div>
</div>

</div></div>


  <div class="tab-pane fade" id="nav-about" role="tabpanel" aria-labelledby="nav-about-tab">
  <div class="card mb-3" style="max-width: 540px;">
  <div class="row g-0">
    <div class="col-md-4">
      <img src="${videoData.snippet.thumbnails.high.url}" class="img-fluid rounded-start" alt="${videoData.snippet.title}">
    </div>
    <div class="col-md-8">
      <div class="card-body">
        <h5 class="card-title">${videoData.snippet.title}</h5>
        <p class="card-text">${videoData.snippet.customUrl}</p>
        <p class="card-text"><small class="text-muted">Since ${(videoData.snippet.publishedAt).split("").slice(0, 10).join("")}</small></p>
      </div>
    </div>
  </div>
</div>
  </div>
  
  
  
</div>


    `

}
