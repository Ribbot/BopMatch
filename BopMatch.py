import spotipy
import spotipy.util as util

username = 'fissionist'
username2 = 'lemonadeandchives'
playlistName = 'Bop Match: ' + username + ' x ' + username2
token = util.prompt_for_user_token(username, scope='playlist-modify-public', client_id='409994c70c5d4e719eb2c4104755edb5', client_secret='1260f9d85a9f44bc9747f788d4c00a16', redirect_uri='http://localhost/callback')

if token:
    sp = spotipy.Spotify(auth=token)

    sp.user_playlist_create(username, playlistName)

    playlists = sp.user_playlists(username)
    user1Tracks = []

    for playlist in playlists['items']:
        if playlist['owner']['id'] == username:
            if playlist['name'] == playlistName:
                playlistID = playlist['id']
            else:
                print (playlist['name'])
                playlistTracks = sp.user_playlist(username, playlist['id'])
                for track in enumerate(playlistTracks['tracks']['items']):
                    user1Tracks.append(track[1]['track']['id'])

    playlists = sp.user_playlists(username2)
    user2Tracks = []

    for playlist in playlists['items']:
        if playlist['owner']['id'] == username2:
            print (playlist['name'])
            playlistTracks = sp.user_playlist(username2, playlist['id'])
            for track in enumerate(playlistTracks['tracks']['items']):
                user2Tracks.append(track[1]['track']['id'])

    matchingTracks = set(user1Tracks).intersection(user2Tracks)
    print(matchingTracks)
    sp.user_playlist_add_tracks(username, playlistID, matchingTracks)

else:
    print ("Can't get token for", username)

