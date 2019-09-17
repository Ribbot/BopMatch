import spotipy
import spotipy.util as util
import argparse


def get_playlist_tracks(username):
    '''Download user playlist data, extract all tracks, and return as a list'''
    trackList = []

    playlists = sp.user_playlists(username)
    for playlist in playlists['items']:
        if playlist['owner']['id'] == username:
            print(playlist['name'])
            playlistData = sp.user_playlist(username, playlist['id'])
            for track in enumerate(playlistData['tracks']['items']):
                trackList.append(track[1]['track'])

    return trackList


def match_tracks(trackList1, trackList2, matchType):
    '''Find tracks from track lists that match based on track ID (0), album (1), or artist (2)
    Return IDs of matching tracks.
    '''
    matchingTrackIDs = []

    for track1 in enumerate(trackList1):
        for track2 in enumerate(trackList2):

            if matchType == 2:
                for artist1 in enumerate(track1[1]['artists']):
                    for artist2 in enumerate(track2[1]['artists']):
                        if artist1[1]['id'] == artist2[1]['id']:
                            matchingTrackIDs.append(track1[1]['id'])

            elif matchType == 1:
                if track1[1]['album']['id'] == track2[1]['album']['id']:
                    matchingTrackIDs.append(track1[1]['id'])

            elif matchType == 0:
                if track1[1]['id'] == track2[1]['id']:
                    matchingTrackIDs.append(track1[1]['id'])

    return matchingTrackIDs


def chunk_track_list(trackList):
    '''Split list of tracks into 100 track chunks.  
    Spotify only allows 100 tracks to be added to a playlist at a time.
    '''
    for i in range(0, len(trackList), 100):
        yield trackList[i:i + 100]


parser = argparse.ArgumentParser(description='Find matching tracks between two Spotify user accounts.')
parser.add_argument('username1', type=str, help='Username of first account for track matching. The BopMatch playlist is created in username1\'s library. Authentication for the account will be required.')
parser.add_argument('username2', type=str, help='Username of second account for track matching. Only used for track matching, no authentication required.')
parser.add_argument('matchType', type=int, help='0 = Match by Track, 1 = Match by Album, 2 = Match by Artist')
args = parser.parse_args()

#Obtain permission to create and modify playlists for username1
token = util.prompt_for_user_token(args.username1, scope='playlist-modify-public', client_id='409994c70c5d4e719eb2c4104755edb5', client_secret='1260f9d85a9f44bc9747f788d4c00a16', redirect_uri='http://localhost/callback')
if token:
    sp = spotipy.Spotify(auth=token)

    #Download user playlist data and extract all tracks
    user1Tracks = get_playlist_tracks(args.username1)
    user2Tracks = get_playlist_tracks(args.username2)

    #Find matching tracks by artist, album, or track
    matchingTrackIDs = []
    matchingTrackIDs.extend(match_tracks(user1Tracks, user2Tracks, args.matchType))
    matchingTrackIDs.extend(match_tracks(user2Tracks, user1Tracks, args.matchType))
    
    #Remove any duplicate track IDs
    matchingTrackIDs = list(set(matchingTrackIDs))

    if (len(matchingTrackIDs) > 0):
        #Create BopMatch playlist
        playlistName = 'Bop Match: ' + args.username1 + ' x ' + args.username2
        sp.user_playlist_create(args.username1, playlistName)

        #Find BopMatch playlist ID
        playlists = sp.user_playlists(args.username1)
        for playlist in playlists['items']:
            if (playlist['owner']['id'] == args.username1 and playlist['name'] == playlistName):
                playlistID = playlist['id']

        #Split track list into 100 track chunks and add to playlist
        matchingTrackIDs = chunk_track_list(matchingTrackIDs)    
        for trackChunk in enumerate(matchingTrackIDs):
            sp.user_playlist_add_tracks(args.username1, playlistID, trackChunk[1])

    else:
        print("No matching songs found :(")

else:
    print ("Can't get token for", args.username1)
