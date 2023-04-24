// api key
const API_KEY = 'AIzaSyAUw9zNp1__NwzmE1nTQlUvcBPnStSoBVI';

//main div where content gets append
const videoCardContainer = document.querySelector('.videoCardContainer');

// youtube api links
let video_http = "https://www.googleapis.com/youtube/v3/videos?";
let channel_http = "https://www.googleapis.com/youtube/v3/channels?";
let playlist_http = "https://www.googleapis.com/youtube/v3/playlists?"
let keyword_http = "https://www.googleapis.com/youtube/v3/search?"
let activity_http = "https://youtube.googleapis.com/youtube/v3/activities?"

// responsive nav
function resNav() {
  document.getElementById("mainNav").style.display = "none"
  document.getElementById("responsiveNav").style.display = "block"
}

function backBtnNav() {
  document.getElementById("mainNav").style.display = "flex"
  document.getElementById("responsiveNav").style.display = "none"
}

const sideBar = document.getElementById("sideNav")
sideBar.style.display = "none"
document.getElementById("sideBarNav").addEventListener("click", () => {
  if (sideBar.style.display === "none") {
    sideBar.style.display = "block"
  }
  else {
    sideBar.style.display = "none"
  }
})

videoCardContainer.addEventListener("click", () => {
  sideBar.style.display = "none"
})



// getting channel icon
const getChannelIcon = (video_data) => {
  const loading = document.createElement("span")
  loading.innerHTML = '<div class="d-flex align-items-center justify-content-center mt-5"><div class="spinner-border"></div></div>'
  videoCardContainer.appendChild(loading)
  fetch(channel_http + new URLSearchParams({
    key: API_KEY,
    part: 'snippet',
    id: video_data.snippet.channelId
  }))
    .then(res => res.json())
    .then(data => {
      let channelIcon = data.items[0].snippet.thumbnails.default.url;
      makeVideoCard(video_data, channelIcon);
      videoCardContainer.removeChild(loading)
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
    if (data.id.kind === 'youtube#channel') {
      getChannelDetails(data.snippet.channelId)
    }
    else if (typeof data.id === "string") {
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



// filter
var filterButtons = document.querySelectorAll(".search-filter")
filterButtons.forEach((btn) => btn.addEventListener("click", async (e) => {
  let filterValue = e.target.firstChild.nodeValue
  localStorage.setItem("recent", JSON.stringify(filterValue))
  localStorage.setItem("channelId", null)
  const fetchURL = await fetch(`${keyword_http}part=snippet&maxResults=10&q=${filterValue}&key=${API_KEY}`)
  const data = await fetchURL.json()
  filterFunc()
  videoCardContainer.innerHTML = ""

  videoCardContainer.classList = "videoCardContainer row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4 mt-3"
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



// to get most popular videos
async function getMostPopularVideos() {
  try {
    videoCardContainer.innerHTML = ""
    videoCardContainer.classList = "videoCardContainer row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4 mt-3"
    localStorage.setItem("recent", JSON.stringify("Most Popular"))
    localStorage.setItem("channelId", null)
    filterFunc()
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
  e.preventDefault()
  if (searchInput.value.length) {
    const fetchURL = await fetch(`${keyword_http}part=snippet&maxResults=10&q=${searchInput.value}&key=${API_KEY}`)
    const data = await fetchURL.json()

    localStorage.setItem("recent", JSON.stringify(searchInput.value))
    localStorage.setItem("channelId", null)
    filterFunc()

    videoCardContainer.innerHTML = ""
    videoCardContainer.classList = "videoCardContainer row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4 mt-3"
    data.items.forEach(item => {
      getChannelIcon(item);
    })
  }
  else {
    alert("Type Something to Search...!")
  }
})



//Responsive navbar form
const searchInputRes = document.querySelector('.search-bar-res');
const searchBtnRes = document.querySelector('.search-btn-res');
const formObjRes = document.getElementById("myFormRes")

formObjRes.addEventListener("submit", async (e) => {
  e.preventDefault()
  if (searchInputRes.value.length) {
    const fetchURL = await fetch(`${keyword_http}part=snippet&maxResults=10&q=${searchInputRes.value}&key=${API_KEY}`)
    const data = await fetchURL.json()

    localStorage.setItem("recent", JSON.stringify(searchInputRes.value))
    localStorage.setItem("channelId", null)
    filterFunc()

    videoCardContainer.innerHTML = ""
    videoCardContainer.classList = "videoCardContainer row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4 mt-3"
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
  const loading = document.createElement("span")
  loading.innerHTML = '<div class="d-flex align-items-center justify-content-center mt-5"><div class="spinner-border"></div></div>'
  videoCardContainer.appendChild(loading)
  
  const fetchURL = await fetch(`${video_http}part=snippet%2CcontentDetails%2Cstatistics&id=${id}&key=${API_KEY}`)
  const data = await fetchURL.json()
  const videoData = data.items[0]

  videoCardContainer.removeChild(loading)

  let lengthNum = (videoData.snippet.description).split("").length
  let description = (videoData.snippet.description).split("").slice(0, 200).join("")
  let rest = (videoData.snippet.description).split("").slice(200, lengthNum).join("")

  const cardDiv = document.createElement("div")
  cardDiv.classList = "card"
  cardDiv.style.width = "100%"

  const iframeDiv = document.createElement("iframe")
  iframeDiv.classList = "youtubeVideo card-img-top"
  iframeDiv.src = `https://www.youtube.com/embed/${videoData.id}`
  iframeDiv.setAttribute("allowFullscreen", "")
  iframeDiv.setAttribute("frameborder", "0")
  iframeDiv.title = "YouTube video player";
  iframeDiv.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";

  const bodyDiv = document.createElement("div")
  bodyDiv.classList = "card-body"
  cardDiv.append(iframeDiv, bodyDiv)

  const title = document.createElement("h5")
  title.classList = "card-title"
  title.innerText = videoData.snippet.title

  let views = videoData.statistics.viewCount
  let comments = videoData.statistics.commentCount
  let likes = videoData.statistics.likeCount
  let statsCount = [views, comments, likes].map((stat) => {
    if (stat < 1000000 && stat >= 1000) {
      return stat = `${(stat / 1000).toFixed(3)}K`
    }
    else if (stat >= 1000000 && stat < 1000000000) {
      return stat = `${(stat / 1000000).toFixed(2)}M`
    }
    else if (stat >= 1000000000) {
      return stat = `${(stat / 1000000000).toFixed(1)}B`
    }
    else {
      return stat = stat
    }
  })

  const stats = document.createElement("h6")
  stats.classList = "card-text"
  stats.innerHTML = `${statsCount[0]} views <small class="text-muted">${(videoData.snippet.publishedAt).split("").slice(0, 10).join("")}</small>  <br/> <i class="fa-regular fa-thumbs-up" style="color: #0f0f10;"></i> ${statsCount[2]} Comments ${statsCount[1]}
  `

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

  const backBtn = document.createElement("button")
  backBtn.classList = "ms-2"
  backBtn.innerText = "Back"
  backBtn.addEventListener("click", () => {
    let id = JSON.parse(localStorage.getItem("channelId"))
    if (id) {
      getChannelDetails(id)
    }
    else {
      localStorage.setItem("channelId", null)
      backBtnFunc()
    }
  })

  bodyDiv.append(title, stats, pTag, readBtn, backBtn)
  videoCardContainer.appendChild(cardDiv)

  var dots = document.getElementById("dots");
  var moreText = document.getElementById("more");
  var btnText = document.getElementById("myBtn");

  if (lengthNum < 200) {
    dots.style.display = "none";
    btnText.style.display = "none";
  }

  readBtn.addEventListener("click", (e) => {
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



// back btn
async function backBtnFunc() {
  const recent = localStorage.getItem("recent")
  const fetchURL = await fetch(`${keyword_http}part=snippet&maxResults=10&q=${recent}&key=${API_KEY}`)
  const data = await fetchURL.json()
  filterFunc()
  videoCardContainer.innerHTML = ""
  videoCardContainer.classList = "videoCardContainer row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4 mt-3"
  data.items.forEach(item => {
    getChannelIcon(item);
  })

}



// get channel details
async function getChannelDetails(id) {
  videoCardContainer.innerHTML = ""
  videoCardContainer.classList = "videoCardContainer"
  const loading = document.createElement("span")
  loading.innerHTML = '<div class="d-flex align-items-center justify-content-center mt-5"><div class="spinner-border"></div></div>'
  videoCardContainer.appendChild(loading)
  
  // channel details
  const fetchURL = await fetch(`${channel_http}part=snippet%2CcontentDetails%2Cstatistics&id=${id}&key=${API_KEY}`)
  const data = await fetchURL.json()
  const videoData = data.items[0]

  // channel playlist
  const playlistURL = await fetch(`${playlist_http}part=snippet%2CcontentDetails&channelId=${id}&key=${API_KEY}`)
  const playlistData = await playlistURL.json()
  playlistCard = playlistData.items

  // activity
  const activityURL = await fetch(`${activity_http}part=snippet%2CcontentDetails&channelId=${id}&key=${API_KEY}`)
  const activityData = await activityURL.json()
  activityCard = activityData.items

  videoCardContainer.removeChild(loading)
  
  let videoCount = videoData.statistics.videoCount
  if (videoCount === 1) {
    videoCount = `${videoCount} Video`
  }
  else {
    videoCount = `${videoCount} Videos`
  }

  let viewCount = videoData.statistics.viewCount
  let subsCount = videoData.statistics.subscriberCount
  let statsCount = [viewCount, subsCount].map((stat) => {
    if (stat < 1000000 && stat >= 1000) {
      return stat = `${(stat / 1000).toFixed(3)}K`
    }
    else if (stat >= 1000000 && stat < 1000000000) {
      return stat = `${(stat / 1000000).toFixed(2)}M`
    }
    else if (stat >= 1000000000) {
      return stat = `${(stat / 1000000000).toFixed(1)}B`
    }
    else {
      return stat = stat
    }
  })

  let countryName = videoData.snippet.country
  if (countryName === undefined) {
    countryName = "N/A"
  }

  // channel info card
  const cardDiv = document.createElement("div")
  cardDiv.classList = "card mb-3 p-2 mt-3"

  const rowDiv = document.createElement("div")
  rowDiv.classList = "row g-0"
  cardDiv.appendChild(rowDiv)

  const colDiv1 = document.createElement("div")
  colDiv1.classList = "col-md-4"

  const backBtn2 = document.createElement("button")
  backBtn2.innerHTML = '<i class="fa-solid fa-arrow-left fa-lg" style="color: #111213;"></i>'
  backBtn2.addEventListener("click", () => {
    localStorage.setItem("channelId", null)
    backBtnFunc()
  })

  const channelIcon = document.createElement("img")
  channelIcon.src = videoData.snippet.thumbnails.default.url
  channelIcon.classList = 'channelIcon rounded-circle'
  channelIcon.alt = videoData.snippet.title

  colDiv1.append(backBtn2, channelIcon)

  const colDiv2 = document.createElement("div")
  colDiv2.classList = 'col-md-8'

  const cardBodyDiv = document.createElement("div")
  cardBodyDiv.classList = 'card-body'

  const head4 = document.createElement("h4")
  head4.classList = 'card-title position-relative'
  head4.innerHTML = `${videoData.snippet.title} 
  <small class="text-muted">
  ${videoData.snippet.customUrl}
  </small>
  <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" title="country">
  ${countryName}
  <span class="visually-hidden">country</span>
</span> `

  const head5 = document.createElement("h4")
  head5.classList = 'card-title'
  head5.innerHTML = `${statsCount[1]} Subscribers ${videoCount} <br/> ${statsCount[0]} Views`

  const para = document.createElement("p")
  para.classList = 'card-text'
  para.innerHTML = `${videoData.snippet.localized.description}`

  cardBodyDiv.append(head4, head5, para)
  colDiv2.appendChild(cardBodyDiv)

  rowDiv.append(colDiv1, colDiv2)
  cardDiv.appendChild(rowDiv)

  videoCardContainer.appendChild(cardDiv)


  // nav tabs for channel playlist , recent activity , about 
  const navTab = document.createElement("nav")
  const navDiv = document.createElement('div')
  navDiv.classList = "nav nav-tabs"
  navDiv.id = "nav-tab"
  navDiv.role = 'tablist'

  let tabs = ['playlist', 'activity', 'about']
  tabs.forEach((tab) => {
    const buttonEle = document.createElement('button')
    buttonEle.id = `nav-${tab}-tab`;
    if (tab === "playlist") {
      buttonEle.classList = "nav-link active";
      buttonEle.ariaSelected = "true";
    }
    else {
      buttonEle.classList = "nav-link";
      buttonEle.ariaSelected = "false";
    }
    buttonEle.setAttribute('data-bs-toggle', 'tab')
    buttonEle.setAttribute('data-bs-target', `#nav-${tab}`)
    buttonEle.type = 'button'
    buttonEle.role = "tab"
    buttonEle.setAttribute('aria-controls', `nav-${tab}`)
    buttonEle.innerText = `${tab}`
    buttonEle.style.textTransform = "capitalize"
    navDiv.append(buttonEle)
  })

  navTab.appendChild(navDiv)
  videoCardContainer.appendChild(navTab)


  // tabs content
  const contentDiv = document.createElement('div')
  contentDiv.classList = "tab-content"
  contentDiv.id = "nav-tabContent"
  tabs.forEach((tab) => {
    const tabDiv = document.createElement('div')
    if (tab === "playlist") {
      tabDiv.classList = "tab-pane fade show active"
    }
    else {
      tabDiv.classList = "tab-pane fade"
    }
    tabDiv.id = `nav-${tab}`
    tabDiv.role = 'tabpanel'
    tabDiv.setAttribute('aria-labelledby', `nav-${tab}-tab`)

    const rowDivContent = document.createElement('div')
    if (tab === "about") {
      rowDivContent.classList = "card mb-3"
      rowDivContent.style.maxWidth = "540px"
    }
    else {
      rowDivContent.classList = "row row-cols-1 row-cols-md-2 g-4"
    }

    rowDivContent.id = tab
    tabDiv.appendChild(rowDivContent)
    contentDiv.append(tabDiv)
  })

  videoCardContainer.appendChild(contentDiv)

  const playlistContentTab = document.getElementById("playlist")
  const activityContentTab = document.getElementById("activity")
  const aboutContentTab = document.getElementById("about")

  // adding playlist
  if (playlistCard.length > 0) {
    playlistCard.forEach((playlist) => {
      const colDiv = document.createElement("div")
      colDiv.classList = "col"
      const cardDiv = document.createElement("div")
      cardDiv.classList = 'card'
      const thumbnail = document.createElement("img")
      thumbnail.classList = 'card-img-top'
      thumbnail.src = playlist.snippet.thumbnails.high.url
      thumbnail.alt = playlist.snippet.title

      const cardBody = document.createElement('div')
      cardBody.classList = "card-body"
      cardBody.innerHTML = `
    <h5 class="card-title">${playlist.snippet.title}</h5>
    <small>${playlist.contentDetails.itemCount} Videos</small>`
      cardDiv.append(thumbnail, cardBody)
      colDiv.appendChild(cardDiv)
      playlistContentTab.append(colDiv)
    })
  }
  else {
    playlistContentTab.innerHTML = "<h2>No data found</h2>"
  }

  // adding recent activity
  if (activityCard.length > 0) {
    activityCard.forEach((activity) => {
      const colDiv = document.createElement("div")
      colDiv.classList = "col"
      const cardDiv = document.createElement("div")
      cardDiv.classList = 'card'
      const thumbnail = document.createElement("img")
      thumbnail.classList = 'card-img-top'
      thumbnail.src = activity.snippet.thumbnails.high.url
      thumbnail.alt = activity.snippet.title
      thumbnail.addEventListener("click", () => {

        try {
          watchVideo(activity.contentDetails.upload.videoId)
          localStorage.setItem("channelId", JSON.stringify(id))
        } catch (error) {
          console.log({ "message": error })
          watchVideo(activity.contentDetails.playlistItem.resourceId.videoId)
          localStorage.setItem("channelId", JSON.stringify(id))
        }

      })
      thumbnail.cursor = "pointer"
      const cardBody = document.createElement('div')
      cardBody.classList = "card-body"
      cardBody.innerHTML = `
    <h5 class="card-title">${activity.snippet.title}</h5>
    <small>${(activity.snippet.publishedAt).split("").slice(0, 10).join("")} Upload</small>`
      cardDiv.append(thumbnail, cardBody)
      colDiv.appendChild(cardDiv)
      activityContentTab.append(colDiv)
    })
  }
  else {
    activityContentTab.innerHTML = "<h2>No data found</h2>"
  }

  // adding about info
  aboutContentTab.innerHTML += `
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
</div>`
}
