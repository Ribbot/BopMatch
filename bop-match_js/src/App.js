import React, { useEffect, useState } from 'react';
import { authEndpoint, clientId, redirectUri, scopes } from "./config";
import hash from "./hash";
import MatchInput from './MatchInput';
import Button from '@material-ui/core/Button';
import { makeStyles, Typography } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CssBaseline from '@material-ui/core/CssBaseline';
import TitleText from "./TitleText"
import 'typeface-roboto';


const useStyles = makeStyles(theme => ({
    root: {
        textAlign: 'center',
    },
    title: {
        padding: theme.spacing(4)
    },
    loginButton: {
        background: '#1db954',
        borderRadius: '2em',
        border: '0.2em solid #1db954',
        bottom: '10%',
        color: '#FFFFFF',
        cursor: 'pointer',
        fontSize: '2.5vmax',
        fontFamily: 'Arial, Helvetica, sans-serif',
        left: '10%',
        margin: 'auto',
        padding: '0.7em 1.5em',
        position: 'absolute',
        right: '10%',
        textTransform: 'uppercase',
        transition: 'all 0.25s ease',
        textDecoration: 'none',
        '&:hover': {
            background: '#1ed760',
            border: '0.2em solid #1ed760'
          },
    },
}));

function App() {
    const classes = useStyles()
    const [token, tokenChange] = useState("")

    useEffect(() => {
        let _token = hash.access_token;

        if (_token) {
            tokenChange(_token)
        }
    }, []);

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar position="sticky" color="secondary">
                <Toolbar>
                    <Typography variant="h5" color="inherit">
                        BopMatch
                    </Typography>
                </Toolbar>
            </AppBar>
            {!token && (
                <div>
                    <br />
                    <TitleText className={classes.title}/>
                    <br />
                    <Button
                    className={classes.loginButton}
                    href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
                        "%20"
                    )}&response_type=token&show_dialog=true`}
                    >
                        Login to Spotify
                    </Button>
                </div>
            )}    
            {token && (
                <div>
                    <MatchInput token={token}/>
                </div>
            )}    
        </div>
    );
}

export default App;
