class KenkuAPI {
    constructor(address, port) {
        this.baseAddress = `http://${address}:${port}/v1`;
    }

    async _request(method, path, data) {
        const url = `${this.baseAddress}${path}`;
        let options
        if (data) {
            options = {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            };
        } else {
            options = {
                method: method,
            };
        }


        const response = await fetch(url, options);
        const jsonResponse = await response.json();

        if (response.status !== 200) {
            throw new Error(`${response.status}: ${jsonResponse}`);
        }

        return jsonResponse;
    }

    async _put(path, data) {
        return this._request('PUT', path, data);
    }

    async _post(path, data) {
        return this._request('POST', path, data);
    }

    async _get(path) {
        return this._request('GET', path);
    }

    get playlists() {
        return this._get('/playlist');
    }

    playlist_play(id) {
        return this._put('/playlist/play', { id });
    }

    get playlist_playback_state() {
        return this._get('/playlist/playback');
    }

    playlist_resume() {
        return this._put('/playlist/playback/play');
    }

    playlist_pause() {
        return this._put('/playlist/playback/pause');
    }

    playlist_next() {
        return this._post('/playlist/playback/next');
    }

    playlist_previous() {
        return this._post('/playlist/playback/previous');
    }

    playlist_mute(mute = true) {
        return this._put('/playlist/playback/mute', { mute });
    }

    playlist_set_volume(volume) {
        return this._put('/playlist/playback/volume', { volume });
    }

    playlist_shuffle(shuffle = true) {
        return this._put('/playlist/playback/shuffle', { shuffle });
    }

    playlist_repeat(mode) {
        if (!["track", "playlist", "off"].includes(mode)) {
            throw new Error("Invalid mode");
        }
        return this._put('/playlist/playback/repeat', { repeat: mode });
    }

    get soundboards() {
        return this._get('/soundboard');
    }

    soundboard_play(id) {
        return this._put('/soundboard/play', { id });
    }

    soundboard_stop(id) {
        return this._put('/soundboard/stop', { id });
    }

    get soundboard_playback_state() {
        return this._get('/soundboard/playback');
    }
}

const kenkuFM = new KenkuAPI('localhost', 3333)

function listToObject(list) {
    const result = {};

    for (const obj of list) {
        if (obj.hasOwnProperty('id')) {
            result[obj.id] = obj;
        }
    }

    return result;
}

button_status = {
}

function toggle_button(id, start, stop) {
    button_status[id] = !button_status[id]
    for (const tag of document.querySelectorAll(`#button-${id}`)) {
        if (button_status[id]) {
            tag.innerHTML = "⏹️"
            start.bind(kenkuFM)(id)
        } else {
            tag.innerHTML = "▶️"
            stop.bind(kenkuFM)()
        }
    }
}

async function stop_soundboard(id) {
    soundboard_data = listToObject((await kenkuFM.soundboards).soundboards)
    for (const sound of soundboard_data[id].sounds) {
        kenkuFM.soundboard_stop(sound)
        for (const tag of document.querySelectorAll(`#button-${sound}`)) {
            tag.innerHTML = "▶️"
        }
    }
}

async function render() {
    sound_tags = document.querySelectorAll("kenku-sound")
    soundboard_tags = document.querySelectorAll("kenku-soundboard")
    track_tags = document.querySelectorAll("kenku-track")
    playlist_tags = document.querySelectorAll("kenku-playlist")

    res = await kenkuFM.soundboards
    sound_data = listToObject(res.sounds)
    soundboard_data = listToObject(res.soundboards)
    res = await kenkuFM.playlists
    track_data = listToObject(res.tracks)
    playlist_data = listToObject(res.playlists)

    // Sounds
    for (const tag of sound_tags) {
        sound = sound_data[tag.id]
        button_status[tag.id] = false
        tag.innerHTML = `<button id="button-${sound.id}" onclick="toggle_button('${sound.id}', () => kenkuFM.soundboard_play('${sound.id}'), () => kenkuFM.soundboard_stop('${sound.id}'))">▶️</button>${sound.title}</br>`
    }

    // Sound boards
    for (const tag of soundboard_tags) {
        soundboard = soundboard_data[tag.id]

        if (tag?.className != "full") {
            tag.innerHTML = `<button id="button-${soundboard.id}" onclick="toggle_button('${soundboard.id}', () => kenkuFM.soundboard_play('${soundboard.id}'), () => stop_soundboard('${soundboard.id}'))">▶️</button>${soundboard.title}</br>`
            continue
        }
        else {

            html = `<h2>${soundboard.title}:</h2>`

            for (const sound_id of soundboard.sounds) {
                sound = sound_data[sound_id]
                html += `<button id="button-${sound.id}" onclick="toggle_button('${sound.id}', () => kenkuFM.soundboard_play('${sound.id}'), () => kenkuFM.soundboard_stop('${sound.id}'))">▶️</button>${sound.title}</br>`
            }
            tag.innerHTML = html + "</br>"
        }
    }

    // Tracks
    for (const tag of track_tags) {
        track = track_data[tag.id]
        button_status[tag.id] = false
        tag.innerHTML = `<button id="button-${track.id}" onclick="toggle_button('${track.id}', () => kenkuFM.playlist_play('${track.id}'), () => kenkuFM.playlist_pause())">▶️</button>${track.title}</br>`
    }

    // Playlists
    for (const tag of playlist_tags) {
        playlist = playlist_data[tag.id]

        if (tag?.className != "full") {
            tag.innerHTML = `<button id="button-${playlist.id}" onclick="toggle_button('${playlist.id}', () => kenkuFM.playlist_play('${playlist.id}'), () => kenkuFM.playlist_pause())">▶️</button>${playlist.title}</br>`
            continue
        }
        else {

            html = `<h2>${playlist.title}:</h2>`
            for (const track_id of playlist.tracks) {
                track = track_data[track_id]
                html += `<button id="button-${track.id}" onclick="toggle_button('${track.id}', () => kenkuFM.playlist_play('${track.id}'), () => kenkuFM.playlist_pause())">▶️</button>${track.title}</br>`
            }
            tag.innerHTML = html + "</br>"
        }
    }

}

window.onload = () => {
    render();
    if (typeof autoplay != "undefined") {
        autoplay()
    }
}