import React, { useEffect, useState } from 'react';
import Link from '@material-ui/core/Link';
import HelpIcon from '@material-ui/icons/Help';
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import iconOptions from './img/icon_options.png'
import iconOptionsiPhone from './img/icon_options_iphone.png'
import iconOptionsAndroid from './img/icon_options_android.png'


export default function UserIdHelp() {
    const [dialogOpen, dialogOpenChange] = useState(false)

    const handleOpen = () => {
        dialogOpenChange(true);
      };
    
      const handleClose = () => {
        dialogOpenChange(false);
      };

    return(
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'}}
        >
            <HelpIcon />
            <Link onClick={handleOpen}>
                {" How do I find a Spotify user ID"}
            </Link>
            <Dialog 
            open={dialogOpen}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            >
                <DialogTitle>{"Finding a Spotify user ID"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        1. Open the Spotify user profile
                    </DialogContentText>
                    <DialogContentText>
                        2. (Desktop) Click 
                    </DialogContentText>
                    <img src={iconOptions} />
                    <DialogContentText>
                        2. (iOS) Tap 
                    </DialogContentText>
                    <img src={iconOptionsiPhone} />
                    <DialogContentText>
                        {"2. (Android) Tap "}
                    </DialogContentText>
                    <img src={iconOptionsAndroid} />
                    <DialogContentText>
                        3. Click "Share", then "Copy Link"
                    </DialogContentText>
                    <DialogContentText>
                        4. Paste the link into the User ID box
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </div>
        
    );
}