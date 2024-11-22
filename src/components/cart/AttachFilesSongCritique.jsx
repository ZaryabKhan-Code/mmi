/* eslint-disable react/prop-types */
import { Button, TextField, Grid, Typography, Box, IconButton } from '@mui/material';
import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link, useNavigate } from 'react-router-dom';
import { AddMessage } from '../../services/chat';
import { useCookies } from 'react-cookie';
import { GetCreditStatus } from '../../services/sessions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import SendingFile from './SendingFile';

const AttachFilesSongCritique = ({ type, orderId, expertId, creditId }) => {
    const imageSize = {
        xs: '1.5rem',
        sm: '2rem',
        md: '3rem',
        lg: '3rem',
        xl: '3rem'
    };

    const [cookies] = useCookies(['user']);
    const userData = cookies.user;
    const userId = userData ? userData.id : null;
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [charCount, setCharCount] = useState(0);
    const [errorFiles, setErrorFiles] = useState('');
    const maxChars = 200;
    const [progessLoader, setProgressLoader] = useState(0)
    const { getRootProps, getInputProps } = useDropzone({
        multiple: false,
        accept: {
            'audio/mpeg': [],
            'audio/wav': [],
            'audio/aiff': [],
            'video/mp4': [],
            'video/quicktime': [] // Adding support for .mov files
        },
        maxSize: 52428800, // 50 MB limit
        onDrop: (acceptedFiles, fileRejections) => {
            if (fileRejections.length > 0) {
                setErrorFiles('Please upload files in MP3, WAV, AIFF, MP4, or MOV format, each not exceeding 50MB.');
            } else {
                setFile(acceptedFiles[0]);
                setErrorFiles('');
            }
        },
        disabled: loading
    });


    const handleInputChange = (event) => {
        const value = event.target.value;
        if (value.length <= maxChars) {
            setMessage(value);
            setCharCount(value.length);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        const uploadedFile = formData.get('file');
        const response = await fetch(file);

        // Determine the file type
        const filetype = uploadedFile.type || 'application/octet-stream';
        const filename = uploadedFile.name || 'unknown_file';
        const fileExtension = filename.split('.').pop().toLowerCase();

        console.log('TYPE FILE:', uploadedFile.type)
        console.log('fileExtension:', fileExtension)

        formData.append('userId', userId);
        formData.append('expertUserId', expertId);
        formData.append('orderNo', orderId);
        formData.append('message', message);
        formData.append('messageType', 'file');
        formData.append('fileType', fileExtension)
        formData.append('orderType', type);

        try {
            // Get ArrayBuffer for the file
            const fileBuffer = await file.arrayBuffer();
            console.log("fileBUffer", fileBuffer)
            const response = await AddMessage(localStorage.getItem('token'), formData);

            const presignedUrl = response.data.presignedUrl;
            const uploadResponse = await axios.put(presignedUrl, fileBuffer, {
                headers: {
                    'Content-Type': filetype,
                },
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setProgressLoader(progress)
                },
            });
            setProgressLoader(0);
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
        <>{progessLoader > 0 ?
            <SendingFile progessLoader={progessLoader} /> :
            <>
                <Grid className='container mt-4' sx={{ display: "flex", justifyContent: "space-between", padding: "0px 60px 0px 40px" }}>
                    <Grid item sx={{ mt: 1 }}>
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
                <Grid className='container mt-4' sx={{ display: "flex", justifyContent: "center", padding: "0px 50px 0px 50px", flexDirection: "column" }}>
                    <Typography
                        sx={{
                            fontWeight: 500,
                            color: "rgba(41, 45, 50, 1)",
                            fontFamily: "Manrope",
                            fontSize: { xs: '1.2rem', sm: '1.5rem', md: '2rem' }
                        }}
                    >
                        Upload files
                    </Typography>
                    <Typography
                        sx={{
                            fontWeight: 500,
                            color: "rgba(152, 142, 169, 1)",
                            fontFamily: "Manrope",
                            fontSize: { xs: '0.8rem', sm: '0.875rem', md: '1rem' }
                        }}
                    >
                        Select and upload the files of your choice
                    </Typography>
                    <Box
                        {...getRootProps()}
                        sx={{
                            border: '2px dashed rgba(41, 45, 50, 0.5)',
                            borderRadius: '10px',
                            paddingTop: "50px",
                            paddingBottom: "50px",
                            marginTop: '20px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: "center",
                            flexDirection: 'column',
                            textAlign: 'center',
                            cursor: 'pointer',
                        }}
                    >
                        <input {...getInputProps()} />
                        <Box
                            sx={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                border: '2px solid rgba(203, 208, 220, 1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '5px'
                            }}
                        >
                            <Box component={'img'} width={20} src="/images/uploadFile.svg" />
                        </Box>
                        <Typography
                            gutterBottom
                            sx={{
                                fontWeight: 500,
                                color: "rgba(41, 45, 50, 1)",
                                fontFamily: "Manrope",
                                fontSize: { xs: '0.725rem', sm: '0.875rem', md: '1rem' }
                            }}
                        >
                            Choose a file or drag & drop it here
                        </Typography>
                        {!file ? (
                            <Typography
                                gutterBottom
                                sx={{
                                    fontWeight: 500,
                                    color: "rgba(152, 142, 169, 1)",
                                    fontFamily: "Manrope",
                                    fontSize: { xs: '0.725rem', sm: '0.875rem', md: '1rem' }
                                }}
                            >
                                MP3, WAV, AIFF, and MP4 formats, up to 50MB
                            </Typography>
                        ) : (
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '100%',
                                    textAlign: 'center'
                                }}
                            >
                                <Typography
                                    gutterBottom
                                    sx={{
                                        fontWeight: 500,
                                        color: "rgba(152, 142, 169, 1)",
                                        fontFamily: "Manrope",
                                        fontSize: { xs: '0.725rem', sm: '0.875rem', md: '1rem' }
                                    }}
                                >
                                    {file.name}
                                </Typography>
                                <Box
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        setFile(null);
                                    }}
                                    sx={{ ml: 0.5, color: "rgba(152, 142, 169, 1)" }}
                                >
                                    <DeleteIcon fontSize='small' className='mb-1' />
                                </Box>
                            </Box>
                        )}
                        <Button sx={{
                            padding: "2px 15px",
                            color: "rgba(84, 87, 92, 1)",
                            fontSize: { xs: '0.725rem', sm: '0.875rem', md: '1rem' },
                            fontFamily: "Manrope",
                            fontWeight: 400,
                            mt: 1,
                            borderRadius: "10px",
                            border: '2px solid rgba(152, 142, 169, 1)',
                            textTransform: "capitalize",
                            textAlign: "center",
                            '&:hover': {
                                backgroundColor: "none",
                            }
                        }}>Browse File</Button>
                    </Box>
                    {errorFiles && (
                        <Typography color="error" sx={{ mt: 2 }}>
                            {errorFiles}
                        </Typography>
                    )}
                    <Typography gutterBottom className='mt-5' sx={{
                        fontWeight: 500,
                        color: "rgba(41, 45, 50, 1)",
                        fontFamily: "Manrope",
                        fontSize: { xs: '1rem', sm: '1.2rem', md: '1.6rem' }
                    }}
                    >Include a message</Typography>
                    <TextField
                        className='mb-1'
                        variant='outlined'
                        multiline
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
                            mb: 3,
                            fontWeight: 500,
                            color: "rgba(152, 142, 169, 1)",
                            fontFamily: "Manrope",
                            ml: 0.2,
                            fontSize: { xs: '0.725rem', sm: '1rem', md: '1rem' },
                            textAlign: 'left'
                        }}
                    >
                        {charCount}/{maxChars}
                    </Typography>
                    <Grid sx={{ margin: '0px auto', mb: 1.2 }}>
                        <Button
                            onClick={handleSubmit}
                            disabled={!message || !file || loading}
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
                            {loading ? <><FontAwesomeIcon icon={faSpinner} size="xl" spin color='#fff' /></> : 'Send'}
                        </Button>
                    </Grid>
                </Grid>
            </>
        }
        </>
    );
}

export default AttachFilesSongCritique;
