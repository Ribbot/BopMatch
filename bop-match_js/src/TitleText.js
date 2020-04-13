import React, { useEffect, useState } from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Fade from '@material-ui/core/Fade';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    font: {
        fontSize: "6vh",
        fontWeight: '300',
        lineHeight: 1.2,
        letterSpacing: "-0.00833em"
    }
}));

export default function TitleText() {
    const classes = useStyles()
    const [dynamicText, dynamicTextChange] = useState("mom")

    let userTexts = ["coworker", "brother", "roommate", "neighbor", "sister", "boyfriend", "dentist", "uncle", "girlfriend", "professor", "classmates", "cousin", "friends"] 

    useEffect(() => {
        const delay = ms => new Promise(res => setTimeout(res, ms));

        const cycleText = async () => {
            let delayTime = 500
            for(let i=0; i < userTexts.length; i++){
                await delay(delayTime)
                dynamicTextChange(userTexts[i])
                if (delayTime > 100)
                    delayTime -= 100
            }
        }

        cycleText()
    }, []);

    return(
        <div>
            <Typography className={classes.font}>
                find music that
            </Typography>
            <Typography className={classes.font} >
                {"you and your "}
            </Typography>
            <Typography className={classes.font} color="secondary">
                {dynamicText}
            </Typography>
            <Typography className={classes.font} >
                 both love
            </Typography>
        </div>
    );
}