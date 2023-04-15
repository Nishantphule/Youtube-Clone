// api key
let API_KEY = 'AIzaSyALlvMX-O6s5uzxaOqRRjpUjjWfUhnVXVs'

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
    let colDiv = document.createElement("div")
    colDiv.classList="col"
    
    let cardDiv = document.createElement("div")
    cardDiv.classList="card"
    colDiv.appendChild(cardDiv)
    
    let cardImg = document.createElement("img")
    cardImg.classList="video card-img-top"
    cardImg.src=data.snippet.thumbnails.high.url
    cardImg.alt = data.snippet.title
    cardImg.title = "Watch Video"
    cardImg.addEventListener("click",()=>{
        watchVideo(`${data.id}`)
    })
    
    let cardBody = document.createElement("div")
    cardBody.classList="content card-body"
    cardDiv.append(cardImg,cardBody)
    
    let icon = document.createElement("img")
    icon.classList="channel-icon"
    icon.src = channelIcon
    icon.alt = data.snippet.channelTitle
    icon.title="View Channel"
    icon.addEventListener("click",()=>{
        getChannelDetails(data.snippet.channelId)
    })
    
    let infoDiv = document.createElement("div")
    infoDiv.classList="info"
    cardBody.append(icon,infoDiv)
    
    let title = document.createElement("h6")
    title.classList="title"
    title.innerText=data.snippet.title
    
    let name = document.createElement("p")
    name.classList="channel-name"
    name.innerText=data.snippet.channelTitle
    infoDiv.append(title,name)
    
    videoCardContainer.appendChild(colDiv)
}


// to get most popular videos
async function getMostPopularVideos() {
    try {
        videoCardContainer.innerHTML = ""
        const res = await fetch(`${video_http}part=snippet&chart=mostPopular&maxResults=1&regionCode=IN&key=${API_KEY}`)
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
    localStorage.setItem("recent",JSON.stringify("none"))
    filterFunc()
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
        alert("Type Something to Search...!")
    }
})


// watch video
async function watchVideo(id){
    videoCardContainer.innerHTML = ""
    localStorage.setItem("recent",JSON.stringify("none"))
    filterFunc()
    const fetchURL = await fetch(`${video_http}part=snippet%2CcontentDetails%2Cstatistics&id=${id}&key=${API_KEY}`)
    const data = await fetchURL.json()
    const videoData = data.items[0]
    videoCardContainer.innerHTML = `
    <div class="card" style="width: 100%;">
    <iframe class="youtubeVideo card-img-top" src="https://www.youtube.com/embed/${videoData.id}"></iframe> 
  <div class="card-body">
    <h5 class="card-title">${videoData.snippet.title}</h5>
    <p class="card-text">${videoData.snippet.description}</p>
    <button onClick='getMostPopularVideos()'>Back</button>
  </div>
</div>
    `
}


// filter
const filterButtons = document.querySelectorAll(".search-filter")
filterButtons.forEach((btn) => btn.addEventListener("click", async (e)=>{
    let filterValue = e.target.firstChild.nodeValue
    localStorage.setItem("recent",JSON.stringify(filterValue))
    const fetchURL = await fetch(`${keyword_http}part=snippet&maxResults=1&q=${filterValue}&key=${API_KEY}`)
    const data = await fetchURL.json()
    filterFunc()
    videoCardContainer.innerHTML = ""
    data.items.forEach(item => {
        getChannelIcon(item);
    })
}))

function filterFunc(){
    let data = JSON.parse(localStorage.getItem("recent"))
    filterButtons.forEach(btn => {
        if(btn.innerText !== data){
            btn.classList="search-filter"
        }
        else{
            btn.classList='search-filter bg-primary'
        }
    })
}



// get channel details
async function getChannelDetails(id){
    videoCardContainer.innerHTML = ""
    localStorage.setItem("recent",JSON.stringify("none"))
    filterFunc()
    const fetchURL = await fetch(`${channel_http}part=snippet%2CcontentDetails%2Cstatistics&id=${id}&key=${API_KEY}`)
    const data = await fetchURL.json()
    
    const videoData = data.items[0]
    
    videoCardContainer.innerHTML = `
    <div class="card mb-3" style="width: 100%;">
  <div class="row g-0">
    <div class="col-md-4">
      <img src="${videoData.snippet.thumbnails.default.url}" class="channelIcon rounded-circle" alt="${videoData.snippet.title}">
    </div>
    <div class="col-md-8">
      <div class="card-body">
        <h4 class="card-title  position-relative">${videoData.snippet.title} <small class="text-muted">${videoData.snippet.customUrl}</small><span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
        ${videoData.snippet.country}
        <span class="visually-hidden">country</span>
      </span> </h4>
        <h5 class="card-title">${videoData.statistics.subscriberCount} Subscribers ${videoData.statistics.videoCount} Videos <br/> ${(videoData.statistics.viewCount/1000000).toFixed()} M Views</h5>
        <p class="card-text">${videoData.snippet.localized.description}</p>
        <button class="border-0" onClick='getMostPopularVideos()'>Back</button>
      </div>
    </div>
  </div>
</div>
<ul class="nav nav-tabs" id="myTab" role="tablist">
  <li class="nav-item" role="presentation">
    <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="home" aria-selected="true">Playlist</button>
  </li>
  <li class="nav-item" role="presentation">
    <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false">Subscription</button>
  </li>
  <li class="nav-item" role="presentation">
    <button class="nav-link" id="contact-tab" data-bs-toggle="tab" data-bs-target="#contact" type="button" role="tab" aria-controls="contact" aria-selected="false">Activity</button>
  </li>
</ul>
<div class="tab-content" id="myTabContent">
  <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">...</div>
  <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">...</div>
  <div class="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">...</div>
</div>
    `
    
}


