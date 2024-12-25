console.log("welcome to spotify")
let currfolder;
let song;
async function getSong(folder) {
    currfolder = folder;
    //get url address from live preview server(when running the html code)
    const fetchsong = await fetch(`http://127.0.0.1:3000/Spotify/${currfolder}/`)
    const response = await fetchsong.text()
    console.log(response)
    //parsing to use that songs
    let div = document.createElement("div")
    div.innerHTML = response
    const as = div.getElementsByTagName("a")
    console.log(as)

    song = []
    /*traverse all a(anchor tag) and search all href from anchor tag which have .mp3 and push
    to the array
    */
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            song.push(element.href.split(`/Spotify/${currfolder}/`)[1])//1 is index of splited text
            console.log(element.href)
        }
    }

    //it display all the songs in playlist
    const songul = document.querySelector(".your-playlist").getElementsByTagName("ul")[0]
    songul.innerHTML = ""
    for (let s of song) {
        const originalTitle = s;

    // Clean the song title for display
    const cleanedTitle = s
        .replaceAll("%20", " ")
        .replace(/^\d+-| \d+|\.mp3$/g, "")
        .replace("Kbps", "");

        // s = s.replaceAll("%20", " ").replace(/^\d+-| \d+|\.mp3$/g, "").replace("Kbps", "");
        // Add the cleaned song title to the playlist
        songul.innerHTML += `<li class="song-list" data-original-title="${originalTitle}">
                            <img class="m-symbol invert" src="/Spotify/Img/music.svg" alt="img">
                            <div class="song-info font">
                                <div>${cleanedTitle}</div>
                                <div>sapna</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="playlist-playbtn invert" src="/Spotify/Img/listplay.svg" alt="">
                            </div>      
                        </li>`;
    }
    //play song when click on song from playlist
    const songList = document.querySelector(".your-playlist").getElementsByTagName("li")
    Array.from(songList).forEach(element => {
        element.addEventListener("click", e => {
            const originalTitle = element.getAttribute("data-original-title");
            let playlist_playbtn=element.querySelector(".playlist-playbtn");
            // console.log(element.querySelector(".song-info").firstElementChild.innerHTML)
            // playMusic(element.querySelector(".song-info").firstElementChild.innerHTML)
            playMusic(originalTitle);
        });
    });
}
function formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60); // Get whole minutes
    const remainingSeconds = Math.floor(seconds % 60); // Get remaining seconds
    const minstart = String(minutes).padStart(2, "0");
    const secStrat = String(remainingSeconds).padStart(2, "0");
    // Pad with leading zero if seconds is less than 10
    return `${minstart}:${secStrat}`;
}
//for play song
let currentSong = new Audio();
const playMusic = (track, pause = false) => {
    currentSong.src = `/Spotify/${currfolder}/` + track;

    const sinfo = track
        .replaceAll("%20", " ")
        .replace(/^\d+-| \d+|\.mp3$/g, "")
        .replace("Kbps", "");

    if (!pause) {
        currentSong.play();
        play.src = "Img/play.svg";
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(sinfo);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}

//display all the albums on the page
async function displayAlbum() {
    const fetchsong = await fetch(`http://127.0.0.1:3000/Spotify/songs/`)
    const response = await fetchsong.text()
    console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    console.log(div)
    const anchors = div.getElementsByTagName("a")
    console.log(anchors)
    let cardContainer = document.querySelector(".cardcontainer")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("/songs")) {
            let folder = e.href.split("/").slice(-2)[0]
            console.log(folder)
            console.log("sapna....")
            /*
              0          1            2          3
            ['', '127.0.0.1:3000', 'songs', 'ashique2', '']
              1          2            3          4
            ['', '127.0.0.1:3000', 'songs', 'rockstar', '']
            ashique2---> folder name is on 4 place, on 3rd index as per array
            rockstar---> folder name is on 4 place, on 3rd index as per array
             */
            const fetchsong = await fetch(`/Spotify/songs/${folder}/info.json/`)
            const response = await fetchsong.json()
            console.log(response)
            cardContainer.innerHTML = cardContainer.innerHTML + `
                    <div data-folder='${folder}' class="card">
                        <img src="/Spotify/songs/${folder}/cover.jpg" alt="img">
                        <img class="play-btn" src="/Spotify/Img/button.svg" alt="play">
                        <span class="title">${response.title}</span>
                        <span class="descript">${response.Description}</span>
                    </div>
                `
        }
    }
    //load songs from folder
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            console.log(item.currentTarget, item.currentTarget.dataset)
            song = await getSong(`songs/${item.currentTarget.dataset.folder}`)
            console.log(song)
            document.querySelector(".left").style.left = "0"
            playMusic(song[0])
        })
    })
}

async function main() {
    //just represent song in proper list
    await getSong("songs/rockstar")
    console.log(song)
    playMusic(song[0], true)

    await displayAlbum()
    //play, pause,previous,next
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = 'Img/play.svg';
        }
        else {
            currentSong.pause()
            play.src = 'Img/paused.svg';
        }
    })

    //time, duration of song
    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${formatDuration(currentSong.currentTime)}/${formatDuration(currentSong.duration)}`
        //update seekbar while song is playing;
        let c = document.querySelector(".seekbar").value = (currentSong.currentTime / currentSong.duration * 100)
        console.log(c)
    })

    const seek = document.querySelector(".seekbar").addEventListener("click", e => {
        // seek.value=(e.offsetX/e.target.getBoundingClientRect().width)*100
        const percentage = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".seekbar").value = percentage
        console.log(percentage)
        // console.log(e.target.getBoundingClientRect().width,e.offsetX)
        currentSong.currentTime = ((currentSong.duration) * percentage) / 100
    })

    //Add eventlistner for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
        document.querySelector(".hamburger").style.display="none"
    })

    //close menu
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-110%"
        document.querySelector(".hamburger").style.display="block"
    })

    //eventListener for pevious
    previous.addEventListener("click", () => {
        currentSong.pause()
        play.src = 'Img/paused.svg';
        console.log("previous")
        console.log(currentSong.src)
        console.log(song)
        console.log(song.indexOf(currentSong.src.split("/").slice(-1)[0]))
        let index = song.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(song[index - 1])
        }
    })

    //play next
    next.addEventListener("click", () => {
        let index = song.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < song.length) {
            playMusic(song[index + 1])
        }
    })

}
main();
