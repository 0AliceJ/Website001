let songs = [];
let current = 0;

function fetchSongsForCycling() {
    fetch("http://localhost:3000/songs")
        .then(response => response.json())
        .then(data => {
            songs = data.map(q => q.text); //Store only text from displayAllSongs
            current = 0;
            if (songs.length > 0) {
                document.getElementById("songs").innerText = songs[current];
            } else {
                document.getElementById("song").innerText = "No songs to display.";
            }
        });
}

function changeSong() {
    if (songs.length === 0) return;
    current = (current + 1) % songs.length;
    document.getElementById("song").innerText = songs[current];
}

function displayAllSongs() {
    fetch("http://localhost:3000/songs")
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById("all-songs");
        container.innerHTML = ""; //Clear previous songs displayed on screen?
        data.forEach(q => {
            const wrapper = document.createElement("div");
            wrapper.className = "song-row";

            const block = document.createElement("song");
            block.innerText = q.text;
            block.className = "song-block";

            const delBtn = document.createElement("button");
            delBtn.innerText = "Delete";
            delBtn.onclick = () => {
                fetch(`http://localhost:3000/songs/${q.id}`, {method: "DELETE"})
                    .then(() => {
                        displayAllSongs(); //Refresh list after deletion
                        fetchsongsForCycling(); //Refresh cycling songs after deletion
                    });
            };

            wrapper.appendChild(delBtn);
            wrapper.appendChild(block);
            container.appendChild(wrapper);
        });
    });
}

//Call when page loads
window.onload = () => {
    fetchSongsForCycling();
    displayAllSongs();
}

document.getElementById("add-song-form").addEventListener("submit", function(e) {
    e.preventDefault();
    const songText = document.getElementById("new-song").value;
    fetch("http://localhost:3000/songs", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({text: songText})
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("new-song").value = "";
        displayAllSongs(); //Refresh the list
        fetchSongsForCycling(); //Refresh cycling songs
    });
});