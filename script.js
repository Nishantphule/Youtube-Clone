let API_KEY = 'AIzaSyCU7LomXvsy8Q-atxxHJmH3ZuAiPceVoXc'
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
        let channelIcon = data.items[0].snippet.thumbnails.default.url;
        makeVideoCard(video_data,channelIcon);
    })
}

const makeVideoCard = (data,channelIcon) => {
    videoCardContainer.innerHTML += `
    <div class="col">
    <div class="card">
    <iframe class="video card-img-top" src="https://www.youtube.com/embed/${data.id}"></iframe>
        <div class="content card-body">
        <img src="${channelIcon}" class="channel-icon" alt="">
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


