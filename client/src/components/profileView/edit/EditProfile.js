import React, { useContext, useState } from 'react';
import FileBase from 'react-file-base64'
import Grid from '@material-ui/core/Grid';
import * as api from '../../../api'
import { Button, LinearProgress, TextField } from '@material-ui/core';
import { useStyles } from './style';
import { GlobalContext } from '../../../context/global/GlobalStates';
import Axios from 'axios';

export const EditProfile = ({ user, setEdit }) => {
    document.title = 'edit user'
    const classes = useStyles();
    const { editUser } = useContext(GlobalContext)
    const [changes, setChanges] = useState({ name: user.name, email: user.email, status: user.status, profilePicture: user.profilePicture })

    const [loading, setLoading] = useState(false);
    const handleChanges = async (e) => {
        console.log(changes);
        e.preventDefault();
        setLoading(true);
        if(changes.profilePicture.includes('https')){
            const {data} = await api.updateProfile(user._id, changes);
            editUser(data);
            window.location.reload();
        }else{
            const formData = new FormData();
            formData.append("file", changes.profilePicture);
            formData.append("upload_preset", "fq1cudxt")
            Axios.post("https://api.cloudinary.com/v1_1/dtexbsyml/image/upload", formData).then((res) => {
                const cng_data = { ...changes, profilePicture: res.data.secure_url }
                const {data} = api.updateProfile(user._id, cng_data);
                editUser(data);
                window.location.reload();
            });
        }
    }
    if (loading) {
        return (
            <LinearProgress />
        )
    }
    return (
        <div className={classes.root}>
            <Grid container spacing={1}>
                <Grid item xs={12} sm={4}>
                    <div className={classes.header}>
                        <img className={classes.image} src={changes.profilePicture} alt={changes.name} />
                        <div className={classes.fileInput}>
                            <FileBase accept="image/*" type='file' multiple={false} onDone={({ base64 }) => setChanges({ ...changes, profilePicture: base64 })} />
                        </div>
                    </div>
                </Grid>
                <Grid item xs={12} sm={8}>
                    <Grid style={{ marginTop: '7px' }} container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                disabled
                                fullWidth
                                label="USERNAME :"
                                value={user.username}
                                variant='outlined'
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="NAME"
                                value={changes.name}
                                variant='outlined'
                                onChange={e => setChanges({ ...changes, name: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                disabled
                                fullWidth
                                label="EMAIL"
                                type='email'
                                value={changes.email}
                                variant='outlined'
                            // onChange={e => setChanges({ ...changes, email: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="STATUS"
                                value={changes.status}
                                variant='outlined'
                                onChange={e => setChanges({ ...changes, status: e.target.value })}
                            />
                        </Grid>
                        <Button
                            variant='contained'
                            color='primary'
                            fullWidth
                            type='submit'
                            onClick={handleChanges}
                            className={classes.margin}>
                            &nbsp;Save Changes
                        </Button>
                        <Button
                            variant='contained'
                            color='secondary'
                            fullWidth
                            onClick={() => setEdit(prev => !prev)}
                            className={classes.margin}>
                            &nbsp;Cancel
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
}
