import spotipy
import spotipy.util as util

checkArtist = 1
checkAlbum = 0
checkID = 0

username = 'fissionist'
username2 = 'madeline701'
playlistName = 'Bop Match: ' + username + ' x ' + username2
token = util.prompt_for_user_token(username, scope='playlist-modify-public', client_id='409994c70c5d4e719eb2c4104755edb5', client_secret='1260f9d85a9f44bc9747f788d4c00a16', redirect_uri='http://localhost/callback')

if token:
    sp = spotipy.Spotify(auth=token)

    user1Tracks = []

    playlists = sp.user_playlists(username)
    for playlist in playlists['items']:
        if playlist['owner']['id'] == username:

            print (playlist['name'])
            playlistTracks = sp.user_playlist(username, playlist['id'])
            for track in enumerate(playlistTracks['tracks']['items']):
                user1Tracks.append(track[1]['track'])

    matchingTrackIDs = []

    playlists = sp.user_playlists(username2)
    for playlist in playlists['items']:
        if playlist['owner']['id'] == username2:

            print (playlist['name'])
            playlistTracks = sp.user_playlist(username, playlist['id'])
            for track in enumerate(playlistTracks['tracks']['items']):

                if (checkArtist == 1):
                    for i in enumerate(track[1]['track']['artists']):
                        for j in enumerate(user1Tracks):
                            for k in enumerate(j[1]['artists']):
                                if(i[1]['id'] == k[1]['id']):
                                    matchingTrackIDs.append(track[1]['track']['id'])

                elif (checkAlbum == 1 and any(x['album']['name'] == track[1]['track']['album']['name'] for x in user1Tracks)):
                    matchingTrackIDs.append(track[1]['track']['id'])

                elif (checkID == 1 and any(x['id'] == track[1]['track']['id'] for x in user1Tracks)):
                    matchingTrackIDs.append(track[1]['track']['id'])
                
    matchingTrackIDs = list(set(matchingTrackIDs))
    print(matchingTrackIDs)

    if (len(matchingTrackIDs) > 0):
        sp.user_playlist_create(username, playlistName)

        playlists = sp.user_playlists(username)
        for playlist in playlists['items']:
            if (playlist['owner']['id'] == username and playlist['name'] == playlistName):
                playlistID = playlist['id']

        sp.user_playlist_add_tracks(username, playlistID, matchingTrackIDs)
    else:
        print("No matching songs found :(")

else:
    print ("Can't get token for", username)

