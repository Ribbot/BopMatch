import React, { useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import * as $ from "jquery";
import SongList from './SongList'
import { makeStyles } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import UserIdHelp from './UserIdHelp'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(theme => ({
    button: {
        margin: theme.spacing(1)
    },
    textField: {
        margin: theme.spacing(1)
    },
    paper: {
        margin: theme.spacing(1)
    },
    songList: {
        margin: theme.spacing(1)
    }
}));

export default function MatchInput(props) {
    const classes = useStyles()

    const [hostUserId, hostUserIdChange] = useState("")
    const [user1Id, user1IdChange] = useState("")
    const [user2Id, user2IdChange] = useState("")
    const [user1Tracks, user1TracksChange] = useState([])
    const [user2Tracks, user2TracksChange] = useState([])
    const [matchedTracks, matchedTracksChange] = useState([])
    const [snackbarOpen, snackbarOpenChange] = useState(false);
    const [errorDialogOpen, errorDialogOpenChange] = useState(false)
    const [errorDialogText, errorDialogTextChange] = useState("")
    const [matchClicked, matchClickedChange] = useState(false)

    const handleErrorOpen = () => {
        errorDialogOpenChange(true);
    };
    
    const handleErrorClose = () => {
        errorDialogOpenChange(false);
    };

    const updateUser1Id = event => {
        if (event.target.value.startsWith('https://open.spotify.com/user/'))
            user1IdChange(event.target.value.split("https://open.spotify.com/user/")[1].split("?")[0])
        else
            user1IdChange(event.target.value)
    }
    const updateUser2Id = event => {
        if (event.target.value.startsWith('https://open.spotify.com/user/'))
            user2IdChange(event.target.value.split("https://open.spotify.com/user/")[1].split("?")[0])
        else
            user2IdChange(event.target.value)
    }

    // Automatically fill in user1 textfield with logged in display name
    useEffect(() => {
        $.ajax({
            url: "https://api.spotify.com/v1/me/",
            type: "GET",
            beforeSend: (xhr) => {
                xhr.setRequestHeader("Authorization", "Bearer " + props.token);
            },
            success: data => {
                hostUserIdChange(data.id)
                user1IdChange(data.id)
            }
        });
    }, []);

    // Retrieve all tracks from given user's public playlists
    const getTracks = (user_id, userTracksChange) => {
        // Get playlists
        let userPlaylists = []
        $.ajax({
            url: "https://api.spotify.com/v1/users/" + user_id + "/playlists",
            type: "GET",
            beforeSend: (xhr) => {
                xhr.setRequestHeader("Authorization", "Bearer " + props.token);
            },
            success: data => {
                userPlaylists = data.items;
            },
            async: false
        });

        // Get tracks from playlists
        let userTracks = []
        for (var i = 0; i < userPlaylists.length; i++) {
            $.ajax({
                url: "https://api.spotify.com/v1/playlists/" + userPlaylists[i].id + "/tracks",
                type: "GET",
                beforeSend: (xhr) => {
                    xhr.setRequestHeader("Authorization", "Bearer " + props.token);
                },
                success: data => {
                    userTracks = userTracks.concat(data.items.map(item => item.track))
                },
                async: false
            });
        }
        userTracksChange(userTracks)
    }

    const matchTracks = () => {
        if (matchClicked == true){
            if (user1Tracks.length == 0) {
                errorDialogTextChange("No tracks found for user 1. Please double-check that user ID is correct.")
                handleErrorOpen()
            }
            else if (user2Tracks.length == 0){
                errorDialogTextChange("No tracks found for user 2. Please double-check that user ID is correct.")
                handleErrorOpen()
            }
            else {
                // Find matching artists
                let user1ArtistsSet = new Set()
                user1Tracks.forEach(track => {
                    track.artists.forEach(artist => {
                        user1ArtistsSet.add(artist.id)
                    })
                })
                let user2ArtistsSet = new Set()
                user2Tracks.forEach(track => {
                    track.artists.forEach(artist => {
                        user2ArtistsSet.add(artist.id)
                    })
                })
                let matchArtistSet = new Set([...user1ArtistsSet].filter(artist => user2ArtistsSet.has(artist)))

                // Find tracks by matching artists
                let matchTracks = []
                user1Tracks.forEach(track => {
                    track.artists.forEach(artist => {
                        if (matchArtistSet.has(artist.id)){
                            matchTracks.push(track)
                        }
                    })
                })
                user2Tracks.forEach(track => {
                    track.artists.forEach(artist => {
                        if (matchArtistSet.has(artist.id)){
                            matchTracks.push(track)
                        }
                    })
                })

                if(matchTracks.length == 0){
                    errorDialogTextChange("Sorry, no matching tracks found. Try a different user!")
                    handleErrorOpen()
                }

                // Remove duplicate tracks
                const uniqueTracks = Array.from(new Set(matchTracks.map(a => a.id)))
                    .map(id => {
                    return matchTracks.find(a => a.id === id)
                    })

                matchedTracksChange(uniqueTracks)
            }
        }        
    }

    useEffect(() => {
        //console.log(user2Tracks)
        matchTracks()
    }, [user2Tracks])

    const matchUsers = () => {
        matchClickedChange(true)
        getTracks(user1Id, user1TracksChange)
        getTracks(user2Id, user2TracksChange)
    }

    const createPlaylist = () => {
        // Create playlist
        let matchPlaylistId = "";
        $.ajax({
            url: "https://api.spotify.com/v1/users/" + hostUserId + "/playlists",
            method: "POST",
            data: JSON.stringify({
                'name': "BopMatch: " + user1Id + " X " + user2Id,
                'public': true
            }),
            dataType: 'json',
            headers: {
                'Authorization': 'Bearer ' + props.token,
                'Content-Type': 'application/json'
            },
            success: data => {
                //console.log(data)
                matchPlaylistId = data.id
            },
            error: data => {
                //console.log(data)
            },
            async: false
        });

        // Chunk match array into 100 track chunks (spotify only allows adding 100 tracks to a playlist at a time)
        let tempArray = []
        let i, j, chunk = 100
        for (i = 0, j = matchedTracks.length; i<j; i += chunk) {
            tempArray = matchedTracks.slice(i, i + chunk)
            // Add match tracks
            $.ajax({
                url: "https://api.spotify.com/v1/playlists/" + matchPlaylistId + "/tracks",
                method: "POST",
                data: JSON.stringify({
                    'uris': tempArray.map(track => track.uri)
                }),
                dataType: 'json',
                headers: {
                    'Authorization': 'Bearer ' + props.token,
                    'Content-Type': 'application/json'
                },
                success: data => {
                    //console.log(data)
                },
                error: data => {
                    //console.log(data)
                },
                async: false
            });
        }

        snackbarOpenChange(true)
    }

    const handleSnackbarClose = (event, reason) => {
        snackbarOpenChange(false);
    };

    return(
        <div>
            <br />
            <TextField
                label="User 1 ID"
                className={classes.textField}
                type="text"
                variant="outlined"
                value={user1Id}
                onChange={updateUser1Id}
            />
            <TextField 
                label="User 2 ID"
                className={classes.textField}
                type="text"
                variant="outlined"
                value={user2Id}
                onChange={updateUser2Id}
            />
            <br />
            <Button onClick={matchUsers} className={classes.button} variant="contained" color="secondary">
                Match
            </Button>
            <br />
            <UserIdHelp />
            <Dialog 
                open={errorDialogOpen}
                onClose={handleErrorClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle>{errorDialogText}</DialogTitle>
            </Dialog>
            {matchedTracks.length > 0 && (
                <div>
                    <br />
                    <SongList tracks={matchedTracks} className={classes.songList}/>
                    <Button onClick={createPlaylist} className={classes.button} variant="contained" color="secondary" >
                        Add Playlist
                    </Button>
                    <Snackbar
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        open={snackbarOpen}
                        onClose={handleSnackbarClose}
                        autoHideDuration={6000}
                        message="Playlist Created! Check your Spotify account."
                    />
                </div>
            )}
        </div>
    );
}