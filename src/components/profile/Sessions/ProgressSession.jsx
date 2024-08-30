/* eslint-disable react/prop-types */
import React, { useRef, useEffect, useState } from 'react';
import { Grid, Divider, Typography, Button, Card, CardContent, Box, Avatar } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { PlayArrow, Pause } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Player, ControlBar, BigPlayButton } from 'video-react';
import "video-react/dist/video-react.css";
import { Link } from 'react-router-dom';
import { GetAllBookedSesssion } from '../../../services/sessions';

const ProgressSession = ({ id, type }) => {
    const audioRef = useRef(null);
    const [data, setData] = useState([]);
    const [audio, setAudio] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const commonFontSize = {
        xs: '0.9rem',
        sm: '1.5rem',
        md: '1.8rem',
    };

    useEffect(() => {
        const fetchResponse = async () => {
            try {
                const response = await GetAllBookedSesssion(localStorage.getItem('token'), id);
                if (type === 'completed') {
                    setData(response.data.session[1]);
                    setAudio(response.data.session[1]?.chatMediaMessage);
                } else {
                    setData(response.data.session[0]);
                    setAudio(response.data.session[0]?.chatMediaMessage);
                }
            } catch (error) {
            }
        }
        fetchResponse();
    }, [id, type]);

    const handlePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const waveAnimation = {
        scale: isPlaying ? [1, 1.1, 1] : 1,
        transition: {
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse"
        }
    };

    return (
        <Grid className='container mb-4 mt-5' sx={{ padding: "0px 35px 0px 40px" }}>
            <Grid sx={{ ml: -0.5 }}>
                <Link to={'/sessions'}>
                    <img src='/images/backArrow.svg' alt="Back" style={{ cursor: "pointer" }} />
                </Link>
            </Grid>
            <Grid container justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
                <Typography fontFamily={'Manrope'} fontWeight={300} fontSize={commonFontSize}>
                    Watch your {data.orderType}
                    <br />with {data.expertUserName}
                </Typography>
                {type === 'completed' && (
                    <Button
                        startIcon={<AddIcon />}
                        className='mt-3'
                        sx={{
                            padding: { md: "6px 12px", sx: "3px 8px" },
                            color: "rgba(152, 142, 169, 1)",
                            fontSize: { md: "16px", sx: "12px" },
                            fontFamily: "Manrope",
                            fontWeight: 400,
                            mb: 1.5,
                            borderRadius: "15px",
                            border: '1px solid rgba(152, 142, 169, 1)',
                            textTransform: "none",
                            textAlign: "center",
                            '&:hover': {
                                backgroundColor: "none",
                            }
                        }}
                    >
                        Book {data.expertUserName} again
                    </Button>
                )}
            </Grid>
            <Grid container>
                <Grid item xs={12} md={8}>
                    <Card sx={{ p: 0, mt: 2, boxShadow: "none", backgroundColor: "rgba(255, 252, 249, 1)" }}>
                        <CardContent sx={{ p: 0 }}>
                            {data.chatType === 'video' ?
                                <Player
                                    playsInline
                                    src={data.chatMediaMessage}
                                    fluid
                                    aspectRatio='16:9'
                                >
                                    <track
                                        kind="captions"
                                        src="/captions.vtt"
                                        srcLang="en"
                                        label="English"
                                        default
                                    />
                                    <ControlBar autoHide />
                                    <BigPlayButton position="center" />
                                </Player>
                                : data.chatType === 'audio' ?
                                    <Box sx={{ position: 'relative', mt: 1, width: { md: 400, sm: '100%' } }}>
                                        <Card sx={{
                                            padding: 1.5,
                                            display: 'flex',
                                            alignItems: 'start',
                                            backgroundColor: "transparent",
                                            border: '1px solid rgba(51, 46, 60, 1)',
                                        }}>
                                            <Box sx={{ mt: 0.5 }} onClick={handlePlayPause} style={{ cursor: 'pointer' }}>
                                                {isPlaying ? <Pause fontSize='large' sx={{ marginRight: "10px" }} /> : <PlayArrow fontSize='large' sx={{ marginRight: "10px" }} />}
                                            </Box>
                                            <Divider orientation="vertical" flexItem sx={{
                                                borderColor: 'rgba(51, 46, 60, 1)',
                                            }} />
                                            <Grid container justifyContent={'space-between'} flexDirection={'row'}>
                                                <Grid item sx={{ ml: 4, mt: 0.4 }}>
                                                    <Typography sx={{ fontSize: { md: '0.8rem', xs: '0.8rem' }, fontFamily: "Manrope" }}>{data.expertUserName}</Typography>
                                                    <Typography sx={{ fontSize: { md: '0.8rem', xs: '0.8rem' }, fontFamily: "Manrope" }}>{data.orderType}</Typography>
                                                </Grid>
                                                <Grid item>
                                                    <motion.img
                                                        src="/images/waves.svg"
                                                        alt="Waveform"
                                                        animate={waveAnimation}
                                                        style={{ width: '100%' }}
                                                    />
                                                </Grid>
                                            </Grid>
                                            <audio ref={audioRef} src={audio} onEnded={() => setIsPlaying(false)} />
                                        </Card>
                                    </Box>
                                    : null}
                            {data.chatTextMessage &&
                                <Box sx={{ position: 'relative', mt: 1, width: { md: 400, sm: '100%' } }}>
                                    <Card sx={{
                                        padding: 2.5,
                                        display: 'flex',
                                        borderRadius: '5px',
                                        alignItems: 'start',
                                        backgroundColor: "transparent",
                                        border: '1px solid rgba(142, 142, 142, 1)',
                                    }}>
                                        <Grid container justifyContent={'start'} flexDirection={'column'} alignItems={'start'}>
                                            <Typography gutterBottom sx={{ fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' }, fontFamily: "Manrope", fontWeight: 600 }}>
                                                Note from {data.userName}
                                            </Typography>
                                            <Typography gutterBottom sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem', fontFamily: "Manrope", fontWeight: 400 } }}>
                                                {data.chatTextMessage}
                                            </Typography>
                                            <Avatar sx={{ mt: 0.5, width: { xs: 24, sm: 32, md: 40 }, height: { xs: 24, sm: 32, md: 40 } }} src={data?.profilePicture} />
                                        </Grid>
                                    </Card>
                                </Box>

                            }
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <Grid item>
                <Typography
                    variant="body1"
                    fontFamily="Manrope"
                    sx={{
                        color: "#332E3C",
                        fontWeight: 600,
                        fontSize: { xs: '0.9rem', sm: '0.9rem', md: '1.2rem' }
                    }}
                >
                    {data.creditCreatedAt}
                </Typography>
                <Typography
                    variant="body1"
                    fontFamily="Manrope"
                    sx={{
                        color: "#332E3C",
                        fontWeight: 600,
                        lineHeight: "1rem",
                        fontSize: { xs: '0.9rem', sm: '0.9rem', md: '1.2rem' }
                    }}
                >
                    ${data.price}
                </Typography>
            </Grid>
        </Grid>
    )
}

export default ProgressSession;
