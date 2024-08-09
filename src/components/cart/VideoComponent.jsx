/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useState, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import { Button, Grid, Typography, Box, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faCirclePlay, faCirclePause } from '@fortawesome/free-solid-svg-icons';

const VideoComponent = ({ handleSubmit, loading }) => {
    const webcamRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const [capturing, setCapturing] = useState(false);
    const [recordedChunks, setRecordedChunks] = useState([]);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleStartCaptureClick = useCallback(() => {
        setCapturing(true);
        mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
            mimeType: "video/webm"
        });
        mediaRecorderRef.current.addEventListener("dataavailable", handleDataAvailable);
        mediaRecorderRef.current.start();
    }, [webcamRef, setCapturing, mediaRecorderRef]);

    const handleDataAvailable = useCallback(
        ({ data }) => {
            if (data.size > 0) {
                setRecordedChunks((prev) => prev.concat(data));
            }
        },
        [setRecordedChunks]
    );

    const handleStopCaptureClick = useCallback(() => {
        mediaRecorderRef.current.stop();
        setCapturing(false);
    }, [mediaRecorderRef, webcamRef, setCapturing]);

    const handleRetake = () => {
        setRecordedChunks([]);
        setPreviewUrl(null);
    };


    useEffect(() => {
        if (recordedChunks.length) {
            const blob = new Blob(recordedChunks, { type: "video/webm" });
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
                            />
                            {capturing ? (
                                <IconButton onClick={handleStopCaptureClick} sx={{ mt: 2 }}>
                                    <FontAwesomeIcon icon={faCirclePause} size="3x" color="#FF5A59" />
                                </IconButton>
                            ) : (
                                <IconButton onClick={handleStartCaptureClick} sx={{ mt: 2 }}>
                                    <FontAwesomeIcon icon={faCirclePlay} size="3x" color="#FF5A59" />
                                </IconButton>
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
                                    fontSize: 16, // Responsive font size
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
