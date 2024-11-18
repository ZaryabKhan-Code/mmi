/* eslint-disable react/prop-types */
import { Button, TextField, Grid, Typography, Box, IconButton, Tooltip, Card } from '@mui/material';
import React, { useState, useRef, useEffect } from 'react';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import MicIcon from '@mui/icons-material/Mic';
import MessageIcon from '@mui/icons-material/Message';
import { LiveAudioVisualizer } from 'react-audio-visualize';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import useAudioRecorder from './useAudioRecorder';
import { useMediaQuery } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { AddMessage } from '../../services/chat';
import { GetCreditStatus } from '../../services/sessions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useCookies } from 'react-cookie';
import VideoComponent from './VideoComponent';
import axios from 'axios';

const AttachFilesQuickHit = ({ type, orderId, expertId, creditId }) => {
    const [activeComponent, setActiveComponent] = useState('video');
    const [activeIcon, setActiveIcon] = useState('video');
    const [loading, setLoading] = useState(false);
    const [cookies] = useCookies(['user']);
    const userData = cookies.user;
    const userId = userData ? userData.id : null;
    const navigate = useNavigate();
    const imageSize = {
        xs: '1.5rem',
        sm: '2rem',
        md: '3rem',
        lg: '3rem',
        xl: '3rem'
    };


    const handleAudioRecord = () => {
        setActiveComponent('audio');
        setActiveIcon('audio');
    };

    const handleMessageWrite = () => {
        setActiveComponent('message');
        setActiveIcon('message');
    };

    const handleVideoRecord = () => {
        setActiveComponent('video');
        setActiveIcon('video');
    };

    const handleSubmit = async (messageType, data) => {
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('userId', userId);
            formData.append('expertUserId', expertId);
            formData.append('orderNo', orderId);
            formData.append('messageType', messageType);
            formData.append('orderType', type);

            // Determine file type and extension
            const fileExtension = messageType === 'audio' ? 'audio/mp3' : 'video/mp4'; // Assuming .mp3 for audio, .mp4 for video
            let fileBlob;
            if (messageType === 'audio' || messageType === 'video') {
                const response = await fetch(data);
                fileBlob = await response.blob();
                formData.append('file', fileBlob, `${messageType}${fileExtension}`);
            } else {
                formData.append('message', data);
            }

            // Send the form data to your API to get the presigned S3 URL
            const response = await AddMessage(localStorage.getItem('token'), formData);
            console.log('Response', response.data);
            console.log('FILEBLOB TYPE', fileBlob.type)
            const presignedUrl = response.data.presignedUrl; // Get presigned URL
            const filetype = fileExtension || 'application/octet-stream'; // Get MIME type of the file

            // Convert the file into an ArrayBuffer for uploading
            const fileBuffer = await fileBlob.arrayBuffer();
            console.log('fileBuffer', fileBuffer)
            // Upload the file to S3 using the presigned URL
            const uploadResponse = await axios.put(presignedUrl, fileBuffer, {
                headers: {
                    'Content-Type': filetype, // Set the correct file type
                },
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                },
            });
            console.log('File uploaded successfully:', uploadResponse.status);
            // Navigate or perform any other actions upon successful upload
            navigate(`/cart?isSent=true&orderId=${orderId}&type=${type}&expertName=${response.data.name}`);
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('An error occurred while uploading the file. Please try again.');
        } finally {
            setLoading(false);
        }
    };


    const [isValidCredit, setIsValidCredit] = useState(true);

    useEffect(() => {
        const checkCreditStatus = async () => {
            if (creditId && userId) {
                const token = localStorage.getItem('token');
                try {
                    const response = await GetCreditStatus(token, userId, creditId);
                    if (!response.data.status) {
                        setIsValidCredit(false);
                        navigate('/expert');
                    }
                } catch (error) {
                    setIsValidCredit(false);
                    navigate('/expert');
                }
            }
        };

        checkCreditStatus();
    }, [creditId, userId, navigate]);

    if (!isValidCredit) return null;

    return (
        <>
            <Grid className='container mt-4' sx={{ display: "flex", justifyContent: "space-between", padding: "0px 40px 0px 40px" }}>
                <Grid item sx={{ mt: 1, mb: 2 }}>
                    <Link to={'/expert'}>
                        <img
                            src='/images/backArrow.svg'
                            alt="Back"
                            style={{
                                cursor: "pointer",
                                width: imageSize.xs,
                                height: imageSize.xs,
                            }}
                        />
                    </Link>
                </Grid>
            </Grid>
            <Grid className='container mt-2' sx={{ padding: "0px 50px 0px 50px" }}>
                {activeComponent === 'video' && <VideoComponent handleSubmit={handleSubmit} loading={loading} />}
                {activeComponent === 'audio' && <AudioComponent handleSubmit={handleSubmit} loading={loading} />}
                {activeComponent === 'message' && <TextMessage handleSubmit={handleSubmit} loading={loading} />}
            </Grid>
            <Grid className='container mt-4' sx={{ display: "flex", justifyContent: "flex-end", padding: "0px 40px 0px 40px" }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, position: 'fixed', top: '50%', transform: 'translateY(50%)' }}>
                    <Tooltip title="Record Video" placement="left">
                        <IconButton
                            onClick={handleVideoRecord}
                            sx={{
                                backgroundColor: activeIcon === 'video' ? '#E04948' : '#FF5A59',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: activeIcon === 'video' ? '#D0393B' : '#e04e4d',
                                },
                            }}
                        >
                            <VideoCameraFrontIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Record Audio" placement="left">
                        <IconButton
                            onClick={handleAudioRecord}
                            sx={{
                                backgroundColor: activeIcon === 'audio' ? '#E04948' : '#FF5A59',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: activeIcon === 'audio' ? '#D0393B' : '#e04e4d',
                                },
                            }}
                        >
                            <MicIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Write Message" placement="left">
                        <IconButton
                            onClick={handleMessageWrite}
                            sx={{
                                backgroundColor: activeIcon === 'message' ? '#E04948' : '#FF5A59',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: activeIcon === 'message' ? '#D0393B' : '#e04e4d',
                                },
                            }}
                        >
                            <MessageIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Grid>
        </>
    );
};


const AudioComponent = ({ handleSubmit, loading }) => {
    const {
        isRecording,
        isPaused,
        audioURL,
        startRecording,
        pauseRecording,
        stopRecording,
        mediaRecorder,
    } = useAudioRecorder();
    const [recordingTime, setRecordingTime] = useState(0);
    const isLargeScreen = useMediaQuery('(min-width:600px)'); // Media query for larger screens

    useEffect(() => {
        let timer;
        if (isRecording && !isPaused) {
            timer = setInterval(() => {
                setRecordingTime(prevTime => prevTime + 1);
            }, 1000);
        } else if (!isRecording || isPaused) {
            clearInterval(timer);
        }
        return () => clearInterval(timer);
    }, [isRecording, isPaused]);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <Card sx={{ boxShadow: 0, border: '1px solid rgba(152, 142, 169, 1)', borderRadius: "8px", p: 2, mb: 2, mt: 2 }}>
            <Typography
                gutterBottom
                sx={{
                    textAlign: 'center',
                    fontWeight: 500,
                    color: "rgba(51, 46, 60, 1)",
                    fontFamily: "Manrope",
                    fontSize: { xs: '1rem', sm: '1.5rem', md: '2rem' }
                }}
            >
                Record your message
            </Typography>
            <Box sx={{ boxShadow: 0, border: '1px solid rgba(152, 142, 169, 1)', borderRadius: "8px", textAlign: 'center', p: 1, pt: 2, pb: 2 }}>
                <Grid container alignItems="center" spacing={1} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                    <Grid item sx={{ mb: 1 }}>
                        <div onClick={isRecording && !isPaused ? pauseRecording : startRecording} color="primary">
                            {isRecording && !isPaused ?
                                <PauseCircleOutlineIcon fontSize={isLargeScreen ? 'large' : 'large'} sx={{ color: "black" }} />
                                :
                                <PlayCircleOutlineIcon fontSize={isLargeScreen ? 'large' : 'large'} sx={{ color: "black" }} />
                            }
                        </div>
                    </Grid>
                    <Grid item>
                        {mediaRecorder && !isPaused && (
                            <LiveAudioVisualizer
                                width={isLargeScreen ? 200 : 100}
                                barColor='grey'
                                height={isLargeScreen ? 60 : 40}
                                mediaRecorder={mediaRecorder}
                            />
                        )}
                        {(!mediaRecorder || isPaused) && (
                            <img style={{ marginBottom: "5px" }}
                                src={isLargeScreen ? "/wave.png" : "/wave2.png"}
                            />
                        )}
                    </Grid>
                    <Grid item>
                        <Typography
                            sx={{
                                mb: 0.8,
                                fontWeight: 500,
                                color: "rgba(255, 138, 138, 1)",
                                fontFamily: "Manrope",
                                fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.5rem' }
                            }}
                        >
                            {formatTime(recordingTime)}
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: "center", mt: 2 }}>
                <Button
                    onClick={() => handleSubmit('audio', audioURL)}
                    disabled={!audioURL || loading}
                    sx={{
                        backgroundColor: "#FF5A59",
                        padding: "14px 120px",
                        color: "#fff",
                        fontSize: "16px",
                        borderRadius: "10px",
                        textTransform: "capitalize",
                        textAlign: "center",
                        '&:hover': {
                            backgroundColor: "#E04948",
                        },
                        '&.Mui-disabled': {
                            backgroundColor: "rgba(255, 138, 138, 1)",
                            color: "#fff",
                            boxShadow: "rgba(0, 0, 0, 0.25)",
                        }
                    }}
                >
                    {loading ? <FontAwesomeIcon icon={faSpinner} size="xl" spin color='#fff' /> : 'Send'}
                </Button>
            </Box>
        </Card>
    );
};


const TextMessage = ({ handleSubmit, loading }) => {
    const [message, setMessage] = useState('');
    const [charCount, setCharCount] = useState(0);
    const maxChars = 500;

    const handleInputChange = (event) => {
        const value = event.target.value;
        if (value.length <= maxChars) {
            setMessage(value);
            setCharCount(value.length);
        }
    };

    return (
        <Grid>
            <Typography
                gutterBottom
                sx={{
                    textAlign: 'center',
                    fontWeight: 500,
                    color: "rgba(51, 46, 60, 1)",
                    fontFamily: "Manrope",
                    fontSize: { xs: '1rem', sm: '1.5rem', md: '2rem' }
                }}
            >
                Write your message
            </Typography>
            <TextField
                className='mb-1 mt-1'
                variant='outlined'
                multiline
                label='Message'
                fullWidth
                maxRows={5}
                minRows={5}
                value={message}
                onChange={handleInputChange}
                InputProps={{
                    style: {
                        borderRadius: "10px",
                    }, inputProps: {
                        style: {
                            fontSize: { xs: '0.725rem', sm: '1rem', md: '1rem' }
                        }
                    }
                }}
            />
            <Typography
                gutterBottom
                sx={{
                    mb: 1,
                    fontWeight: 500,
                    color: "rgba(152, 142, 169, 1)",
                    fontFamily: "Manrope",
                    mr: 0.5,
                    fontSize: { xs: '0.725rem', sm: '1rem', md: '1rem' },
                    textAlign: 'right'
                }}
            >
                {charCount}/{maxChars}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: "center", mt: 2 }}>
                <Button
                    onClick={() => handleSubmit('text', message)}
                    disabled={!message || loading}
                    sx={{
                        backgroundColor: "#FF5A59",
                        padding: "14px 120px",
                        color: "#fff",
                        fontSize: "16px",
                        borderRadius: "10px",
                        textTransform: "capitalize",
                        textAlign: "center",
                        '&:hover': {
                            backgroundColor: "#E04948",
                        },
                        '&.Mui-disabled': {
                            backgroundColor: "rgba(255, 138, 138, 1)",
                            color: "#fff",
                            boxShadow: "rgba(0, 0, 0, 0.25)",
                        }
                    }}
                >
                    {loading ? <FontAwesomeIcon icon={faSpinner} size="xl" spin color='#fff' /> : 'Send'}
                </Button>
            </Box>
        </Grid>
    );
};

export default AttachFilesQuickHit;
