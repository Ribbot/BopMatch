import React, { useEffect, useState } from 'react';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import { makeStyles, Typography } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles(theme => ({
    table: {
        marginTop: theme.spacing(3),
        margin: 'auto',
        justifyContent: 'center',
    },
    paper: {
        margin: 'auto',
        height: '50vh',
        width: '95%',
        overflow: 'auto',
        maxHeight: '10%',
    }
  }));

export default function SongList(props) {
    const classes = useStyles()

    const renderArtists = (track) => {
        let artistsText = track.artists[0].name
        for (let i = 1; i < track.artists.length; i++)
            artistsText += ", " + track.artists[i].name
        return(<TableCell width="30%">{artistsText}</TableCell>)
    }

    const getArtistsText = (track) => {
        let artistsText = track.artists[0].name
        for (let i = 1; i < track.artists.length; i++)
            artistsText += ", " + track.artists[i].name
        return artistsText
    }

    return(
        <div>
            <Paper className={classes.paper}>
                <List>
                    {props.tracks.map(track => 
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar src={track.album.images[0].url} variant="square" />
                            </ListItemAvatar>
                            <ListItemText 
                                primary={track.name}
                                secondary={getArtistsText(track) + " • " + track.album.name}
                                secondaryTypographyProps={{ noWrap: true }}
                            />
                        </ListItem>
                    )}
                </List>
            </Paper>
        </div>
    );
}