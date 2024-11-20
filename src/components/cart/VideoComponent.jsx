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
    const streamRef = useRef(null);
    const [capturing, setCapturing] = useState(false);
    const [paused, setPaused] = useState(false);
    const [recordedChunks, setRecordedChunks] = useState([]);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isWebcamReady, setIsWebcamReady] = useState(false);
    const [progress, setProgress] = useState(0);
    const timerRef = useRef(null);

    // Function to stop camera access
    const stopCamera = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }
    }, []);
    const handleStopCaptureClick = useCallback(() => {
        if (recorderRef.current) {
            recorderRef.current.stopRecording(() => {
                const blob = recorderRef.current.getBlob();
                setRecordedChunks([blob]);
                const url = URL.createObjectURL(blob);
                setPreviewUrl(url);
                recorderRef.current = null;
            });
            setCapturing(false);
            clearInterval(timerRef.current);
            stopCamera();
        }
    }, [stopCamera]);

    const handleStartCaptureClick = useCallback(async () => {
        try {
            const constraints = {
                video: true,
                audio: true,
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            webcamRef.current.srcObject = stream;
            streamRef.current = stream;

            recorderRef.current = new RecordRTC(stream, {
                type: 'video',
                mimeType: 'video/webm',
            });
            recorderRef.current.startRecording();

            setCapturing(true);
            setProgress(0);

            timerRef.current = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(timerRef.current);
                        handleStopCaptureClick();
                        return 100;
                    }
                    return prev + 0.166; // Update progress every second for 10 minutes
                });
            }, 1000);
        } catch (error) {
            console.error('Error accessing camera:', error);
            alert('An error occurred while accessing the camera. Please check your permissions and try again.');
        }
    }, [handleStopCaptureClick]);

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
                setProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(timerRef.current);
                        handleStopCaptureClick();
                        return 100;
                    }
                    return prev + 0.166;
                });
            }, 1000);
        }
    }, [handleStopCaptureClick]);


    const handleRetake = useCallback(() => {
        setRecordedChunks([]);
        setPreviewUrl(null);
        setCapturing(false);
        setPaused(false);
        setProgress(0);
        stopCamera();
    }, [stopCamera]);

    useEffect(() => {
        return () => {
            stopCamera(); // Stop the camera when the component unmounts
        };
    }, [stopCamera]);


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
