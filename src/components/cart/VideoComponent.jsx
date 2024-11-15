/* eslint-disable react/prop-types */
import React, { useCallback, useState, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import { Button, Grid, Typography, Box, IconButton, CircularProgress } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faCirclePlay, faCirclePause, faSquare } from '@fortawesome/free-solid-svg-icons';
import RecordRTC from 'recordrtc';

const VideoComponent = ({ handleSubmit, loading }) => {
    const webcamRef = useRef(null);
    const recorderRef = useRef(null);
    const [capturing, setCapturing] = useState(false);
    const [paused, setPaused] = useState(false);
    const [recordedChunks, setRecordedChunks] = useState([]);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isWebcamReady, setIsWebcamReady] = useState(false);
    const [progress, setProgress] = useState(0);
    const timerRef = useRef(null);

    const handleStartCaptureClick = useCallback(async () => {
        setCapturing(true);

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1920 }, // Full HD resolution
                    height: { ideal: 1080 },
                    facingMode: 'user',
                },
                audio: true,
            });

            webcamRef.current.srcObject = stream;


            recorderRef.current = new RecordRTC(stream, {
                type: 'video',
                mimeType: 'video/mp4', // Attempting MP4 format
                bitsPerSecond: 5120000, // High bitrate for better quality (5 Mbps)
            });
            recorderRef.current.startRecording();

            // Automatically stop recording after 10 minutes
            setTimeout(() => {
                if (recorderRef.current) {
                    handleStopCaptureClick();
                }
            }, 600000); // 10 minutes in milliseconds

            setProgress(0);
            timerRef.current = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        handleStopCaptureClick();
                        clearInterval(timerRef.current);
                        return 100;
                    }
                    return prev + 0.166; // Update progress every second for 10 minutes
                });
            }, 1000);
        } catch (error) {
            console.error("Error starting video capture:", error);
            alert("An error occurred while accessing the camera. Please try again.");
            setCapturing(false);
        }
    }, []);


    const handlePauseCaptureClick = useCallback(() => {
        if (recorderRef.current) {
            recorderRef.current.pauseRecording();
            setPaused(true);
            clearInterval(timerRef.current);
        }
    }, []);

    const handleResumeCaptureClick = useCallback(() => {
        if (recorderRef.current) {
            recorderRef.current.resumeRecording();
            setPaused(false);
            timerRef.current = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        handleStopCaptureClick();
                        clearInterval(timerRef.current);
                        return 100;
                    }
                    return prev + 0.166; // Update progress every second for 10 minutes
                });
            }, 1000);
        }
    }, []);

    const handleStopCaptureClick = useCallback(() => {
        if (recorderRef.current) {
            recorderRef.current.stopRecording(() => {
                const blob = recorderRef.current.getBlob();
                setRecordedChunks([blob]);
                const url = URL.createObjectURL(blob);
                setPreviewUrl(url);
                recorderRef.current.getInternalRecorder().destroy();
                recorderRef.current = null;
            });
            setCapturing(false);
            clearInterval(timerRef.current);
        }
    }, []);

    const handleRetake = () => {
        setRecordedChunks([]);
        setPreviewUrl(null);
        setProgress(0);
        setCapturing(false);
        setPaused(false);
    };

    useEffect(() => {
        if (recordedChunks.length) {
            const blob = recordedChunks[0];
            const url = URL.createObjectURL(blob);
            setPreviewUrl(url);
        }
    }, [recordedChunks]);

    return (
        <>
            <Grid container sx={{ display: "flex", justifyContent: "center", padding: "", flexDirection: "column" }}>
                <Typography
                    sx={{
                        fontWeight: 500,
                        color: "rgba(41, 45, 50, 1)",
                        fontFamily: "Manrope",
                        fontSize: { xs: '1.2rem', sm: '1.5rem', md: '2rem' }
                    }}
                >
                    Record a Video
                </Typography>
                <Typography
                    sx={{
                        fontWeight: 500,
                        color: "rgba(152, 142, 169, 1)",
                        fontFamily: "Manrope",
                        fontSize: { xs: '0.8rem', sm: '0.875rem', md: '1rem' }
                    }}
                >
                    Click the button below to start recording
                </Typography>
                <Box
                    sx={{
                        borderRadius: '10px',
                        marginTop: '20px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: "center",
                        flexDirection: 'column',
                        textAlign: 'center',
                        cursor: 'pointer',
                    }}
                >
                    {!previewUrl ? (
                        <>
                            <Webcam
                                audio={true}
                                ref={webcamRef}
                                muted={true}
                                videoConstraints={{
                                    width: { ideal: 1280 },
                                    height: { ideal: 720 }
                                }}
                                style={{ width: '100%', height: 'auto', borderRadius: '10px' }}
                                onLoadedData={() => setIsWebcamReady(true)}
                            />
                            {isWebcamReady && (
                                capturing ? (
                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                                        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                                            <CircularProgress
                                                variant="determinate"
                                                value={progress}
                                                size={60}
                                                thickness={2}
                                                sx={{
                                                    color: "#43B929",
                                                }}
                                            />
                                            {!paused ? (
                                                <IconButton
                                                    onClick={handlePauseCaptureClick}
                                                    sx={{
                                                        position: 'absolute',
                                                        top: '50%',
                                                        left: '50%',
                                                        transform: 'translate(-50%, -50%)',
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faCirclePause} size="2x" color="#FF5A59" />
                                                </IconButton>
                                            ) : (
                                                <IconButton
                                                    onClick={handleResumeCaptureClick}
                                                    sx={{
                                                        position: 'absolute',
                                                        top: '50%',
                                                        left: '50%',
                                                        transform: 'translate(-50%, -50%)',
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faCirclePlay} size="2x" color="#FF5A59" />
                                                </IconButton>
                                            )}
                                        </Box>
                                        {capturing && (
                                            <IconButton
                                                onClick={handleStopCaptureClick}
                                                sx={{ ml: 2, color: "#FF5A59" }}
                                            >
                                                <FontAwesomeIcon icon={faSquare} size="2x" />
                                            </IconButton>
                                        )}
                                    </Box>
                                ) : (
                                    <IconButton
                                        onClick={handleStartCaptureClick}
                                        sx={{ mt: 2 }}
                                    >
                                        <FontAwesomeIcon icon={faCirclePlay} size="3x" color="#FF5A59" />
                                    </IconButton>
                                )
                            )}
                        </>
                    ) : (
                        <>
                            <video src={previewUrl} controls style={{ width: '100%', height: 'auto', borderRadius: '10px' }} />
                            <Button disabled={loading}
                                onClick={() => handleSubmit('video', previewUrl)} sx={{
                                    color: "#fff",
                                    padding: "14px 89px",
                                    fontSize: 16,
                                    borderRadius: "10px",
                                    backgroundColor: "#FF5A59",
                                    mt: 2,
                                    textTransform: "capitalize",
                                    '&:hover': {
                                        backgroundColor: "#E04948",
                                    }
                                }}>
                                {loading ? <><FontAwesomeIcon icon={faSpinner} size="xl" spin color='#fff' /></> : 'Send'}
                            </Button>
                            <Button onClick={handleRetake}
                                className='mt-4'
                                sx={{
                                    padding: "14px 80px",
                                    fontSize: 16,
                                    textAlign: "center",
                                    borderRadius: "10px",
                                    color: "rgba(152, 142, 169, 1)",
                                    border: '2px solid rgba(152, 142, 169, 1)',
                                    textTransform: "capitalize",
                                    '&:hover': {
                                        backgroundColor: "none",
                                    }
                                }}
                            >
                                Retake
                            </Button>
                        </>
                    )}
                </Box>
            </Grid>
        </>
    );
};

export default VideoComponent;
