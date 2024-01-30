---
name: Sounds
slug: sound-test
---
<h1>Player</h1>
<button onclick="kenkuFM.playlist_pause()">⏸️ Pause Playlist</button></br>
<button onclick="kenkuFM.playlist_resume()">▶️ Resume Playlist</button></br>
<button onclick="kenkuFM.playlist_previous()">⏮️ Previous Track</button></br>
<button onclick="kenkuFM.playlist_next()">⏭️ Next Track</button></br>
<button onclick="kenkuFM.playlist_mute()">🔇 Mute Playlist</button></br>
<button onclick="kenkuFM.playlist_mute(false)">🔊 Unmute Playlist</button></br>
<label for="volumeSlider">🔊 Set Volume:</label>
<input type="range" id="volumeSlider" min="0" max="1" step="0.01" value="0.5"
        oninput="kenkuFM.playlist_set_volume(this.value)"></br>
<label for="repeatMode">🔁 Repeat Mode:</label>
<select id="repeatMode" onchange="kenkuFM.playlist_repeat(this.value)">
    <option value="off">Off</option>
    <option value="track">Track</option>
    <option value="playlist">Playlist</option>
</select></br>
<label for="shuffleCheckbox">🔀 Shuffle Mode:</label>
<input type="checkbox" id="shuffleCheckbox" onchange="kenkuFM.playlist_shuffle(this.checked)">


<h1>Sounds:</h1>
<kenku-sound id="92ac26d4-b630-4c0f-bafa-87c27989d10a"></kenku-sound>
<h1>Soundboards:</h1>
<kenku-soundboard id="10cc862a-249b-42c4-bd8a-9a3e4490f23c"></kenku-soundboard>
<kenku-soundboard id="39ffc82a-3866-4234-b875-c225bbf659ba" class="full"></kenku-soundboard>

<h1>Playlists:</h1>
<kenku-playlist id="190cfdd3-40c6-4abb-8d0b-0ec1c7f005de"></kenku-playlist>
<kenku-playlist id="190cfdd3-40c6-4abb-8d0b-0ec1c7f005de" class="full"></kenku-playlist>

<h1>Tracks:</h1>
<kenku-track id="c995ac6e-d934-464c-847a-c72d5e7ed403"></kenku-track>