---
name: Autoplay
slug: autoplay-example
---

<script>
    function autoplay() {
        kenkuFM.soundboard_play('92ac26d4-b630-4c0f-bafa-87c27989d10a') // Can be a soundboard or a sound from a soundboards
        kenkuFM.playlist_pause() // Playing the same track/playlist multiple times can fail if not paused first
        kenkuFM.playlist_play('c995ac6e-d934-464c-847a-c72d5e7ed403')  // Can be a playlist or a track
    
    }
</script>
