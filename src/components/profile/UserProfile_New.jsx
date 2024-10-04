import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Autocomplete, Chip, Box, Card, Typography, Button, IconButton, TextField, InputAdornment, Divider, Select, MenuItem, Grid, FormControl, FormHelperText } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { useCookies } from 'react-cookie';
import CancelIcon from '@mui/icons-material/Cancel';
import { UpdateUserProfile } from '../../services/user';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { jwtDecode } from 'jwt-decode';
import { styled } from '@mui/material/styles';
const UserProfile = () => {
    const commonFontSize = {
        xs: '1.4rem',
        sm: '1.5rem',
        md: '1.5rem',
        lg: '1.5rem',
        xl: '1.5rem'
    };
    const commonFontSizeSmall = {
        xs: '0.9rem',
        sm: '1rem',
        md: '1rem',
        lg: '1rem',
        xl: '1rem'
    };

    const [cookies, setCookie] = useCookies(['user']);
    const userData = cookies.user;
    const Email = userData ? userData?.email : null;
    const fieldsCompeleteStatus = userData ? userData?.fieldsCompeleteStatus : null;

    const [loading, setLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(userData.profilePicture || userData.profileUrl);
    const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm({
        defaultValues: {
            firstName: userData.firstName,
            lastName: userData.lastName,
            phoneNumber: userData.phoneNo,
            interest: userData.areaOfInterest,
            dob: userData.ageGroup
        }
    });

    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {

        if (userData?.id !== parseInt(id, 10)) {
            navigate(`/profile/${userData.id}/new`, { replace: true });
        }
        setSelectedImage(userData.profilePicture || userData.profileUrl); // Set the selected image on component mount
    }, [id, navigate, userData]);

    const onSubmit = async (data) => {
        setLoading(true)
        try {
            const formData = new FormData();
            formData.append('id', userData?.id)
            formData.append('email', userData?.email)
            formData.append('firstName', data.firstName)
            formData.append('lastName', data.lastName)
            formData.append('phoneNo', data.phoneNumber)
            formData.append('areaOfInterest', tags)
            formData.append('ageGroup', data.dob)
            if (selectedImage) {
                const response = await fetch(selectedImage);
                const blob = await response.blob();
                formData.append('profilePicture', blob, 'profileImage.jpg');
            }

            const response = await UpdateUserProfile(localStorage.getItem("token"), formData)
            localStorage.setItem('token', response.data.token)
            const decodedToken = jwtDecode(response.data.token);
            setCookie('user', JSON.stringify(decodedToken), {
                path: "/",
                expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                sameSite: 'none',
                secure: true,
            });
            navigate('/expert')
        } catch (error) {
        } finally {
            setLoading(false)
        }
    };
    const [tags, setTags] = useState([]);

    const [inputValue, setInputValue] = useState('');
    const CustomChip = styled(Chip)({
        '& .MuiChip-deleteIcon': {
            color: '#fff',
        },
    });
    useEffect(() => {
        if (userData && typeof userData.areaOfInterest === 'string') {
            setTags(userData.areaOfInterest.split(',').map(tag => tag.trim()).filter(tag => tag));
        }
    }, [userData]);

    const Industry = [
        { title: 'Musicians' },
        { title: 'Producers' },
        { title: 'Engineers' },
        { title: 'MGMT' },
        { title: 'Labels' },
        { title: 'PR' },
    ];
    const handleInputKeyDown = (event) => {
        if ((event.key === 'Enter' || event.key === ' ' || event.key === ',') && inputValue.trim() !== '') {
            event.preventDefault();
            addTag(inputValue.trim());
        }
    };
    const addTag = (tag) => {
        if (tag && tags.length < 5 && !tags.includes(tag)) {
            setTags([...tags, tag]);
            setInputValue('');
        }
    };

    const handleBlur = () => {
        addTag(inputValue.trim());
    };
    const handleInputChange = (event, newInputValue) => {
        if (newInputValue.endsWith(' ') || newInputValue.endsWith(',')) {
            addTag(newInputValue.trim().replace(/,$/, ''));
        } else {
            setInputValue(newInputValue);
        }
    };

    const getFilteredOptions = () => {
        const selectedTitles = tags.map(tag => tag);
        return Industry.map(option => option.title).filter(option => !selectedTitles.includes(option));
    };

    const smallFont = {
        xs: '17px',
        sm: '18px',
        md: '22px',
        lg: '22px',
        xl: '22px'
    }
    const firstName = watch('firstName');
    const lastName = watch('lastName');

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);

            setSelectedImage(imageUrl);
        }
    };

    const paddingValue = '0px 30px 0px 15px';

    const formatPhoneNumber = (value) => {
        if (!value) return value;
        const phoneNumber = value.replace(/[^\d]/g, '');
        const phoneNumberLength = phoneNumber.length;
        if (phoneNumberLength < 4) return phoneNumber;
        if (phoneNumberLength < 7) {
            return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
        }
        return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
    };

    return (

        <AnimatePresence>
            <Grid className='container mt-4' sx={{ display: "flex", justifyContent: "space-between", padding: paddingValue }}>
                <Link to={'/'}>
                    <img src="/images/logo.svg" alt="Logo" width={50} />
                </Link>
                <div>
                    <Button
                        onClick={() => navigate('/logout')}
                        sx={{ textTransform: "capitalize", border: "1px solid #FF5A59", padding: "5px 20px", color: "#FF5A59", borderRadius: "8px" }}>
                        logout
                    </Button>
                </div>
            </Grid>

            <Grid className='container' sx={{
                display: "flex", justifyContent: fieldsCompeleteStatus === false ? "center" : "space-between",
                alignItems: "center", margin: "0px auto", marginTop: "40px", padding: "0px 45px 0px 25px"
            }}>
                {fieldsCompeleteStatus === false ? null : (
                    <Grid item>
                        <Link to={'/profile'}>
                            <img src='/images/backArrow.svg' alt="Back" style={{ cursor: "pointer" }} />
                        </Link>
                    </Grid>
                )}
                <Grid item>
                    <Typography sx={{ color: "rgba(51, 46, 60, 1)", marginLeft: fieldsCompeleteStatus === false ? 2 : 0 }} fontSize={smallFont} fontWeight={'500'} className='mt-1'>{fieldsCompeleteStatus ? <>Update Profile</> : <>Create Profile</>}</Typography>
                </Grid>
                <Grid item>
                </Grid>
            </Grid>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ease: "easeIn", duration: 0.6 }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }} className='mt-1'>
                    <Card sx={{ maxWidth: "500px", width: "100%", padding: 2, textAlign: 'center', boxShadow: "none", backgroundColor: "rgba(255, 252, 249, 1)" }}>
                        <Box sx={{ position: 'relative', display: 'inline-block', marginBottom: 2, }}>
                            <Box
                                component="img"
                                src={selectedImage || "/images/defaultAvatar.jpg"}
                                alt="Profile Picture"
                                onError={(e) => { e.target.src = '/images/defaultAvatar.jpg'; }} // Fallback if the image fails to load
                                sx={{
                                    width: 100,
                                    height: 100,
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    border: "1px solid #FFE6E6"
                                }}
                            />
                            <IconButton
                                component="label"
                                sx={{
                                    position: 'absolute',
                                    bottom: 0,
                                    right: 0,
                                    backgroundColor: '#FF5A59',
                                    color: 'white',
                                    borderRadius: '50%',
                                    padding: '5px',
                                    '&:hover': {
                                        backgroundColor: '#FF5A59',
                                    },
                                }}
                            >
                                <PhotoCamera />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    hidden
                                />
                            </IconButton>
                        </Box>
                        <Typography variant="body1" gutterBottom sx={{ color: "rgba(51, 46, 60, 1)" }}>Upload Picture</Typography>
                        <Typography variant="h6" sx={{ color: "rgba(51, 46, 60, 1)", fontFamily: "manrope" }} fontSize={commonFontSize} fontWeight={700}>
                            {firstName || lastName ? `${firstName} ${lastName}` : `${userData?.firstName || ''} ${userData?.lastName || ''}`}
                        </Typography>
                        <Typography variant="p" sx={{ color: "rgba(177, 190, 188, 1)" }} fontSize={commonFontSizeSmall} fontWeight={400}>{Email}</Typography>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Box sx={{ display: 'flex', flexDirection: "column", }}>
                                <Controller
                                    name="firstName"
                                    control={control}
                                    rules={{ required: 'First name is required' }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            className='mt-4'
                                            placeholder='First name'
                                            error={!!errors.firstName}
                                            helperText={errors.firstName ? errors.firstName.message : ''}
                                            sx={{
                                                '& .MuiInputBase-input::placeholder': {
                                                    fontSize: '1rem',
                                                    fontWeight: '400',
                                                    fontFamily: 'DM Sans, sans-serif',
                                                    color: 'rgba(152, 142, 169, 1)'
                                                },
                                                '& .MuiOutlinedInput-root': {
                                                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                                                    backgroundColor: "#fff",
                                                    '& fieldset': {
                                                        border: 'none',
                                                    },
                                                },
                                            }} InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position='start'>

                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                    )}
                                />
                                <Controller
                                    name="lastName"
                                    control={control}
                                    rules={{ required: 'Last name is required' }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            className='mt-3'
                                            placeholder='Last name'
                                            error={!!errors.lastName}
                                            helperText={errors.lastName ? errors.lastName.message : ''}
                                            sx={{
                                                '& .MuiInputBase-input::placeholder': {
                                                    fontSize: '1rem',
                                                    fontWeight: '400',
                                                    fontFamily: 'DM Sans, sans-serif',
                                                    color: 'rgba(152, 142, 169, 1)'
                                                },
                                                '& .MuiOutlinedInput-root': {
                                                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                                                    backgroundColor: "#fff",
                                                    '& fieldset': {
                                                        border: 'none',
                                                    },
                                                },
                                            }} InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position='start'>

                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                    )}
                                />
                                <Controller
                                    name="phoneNumber"
                                    control={control}
                                    rules={{
                                        required: 'Phone number is required',
                                        validate: value => {
                                            const formatted = formatPhoneNumber(value);
                                            return formatted.length === 14 || 'Phone number is not valid';
                                        }
                                    }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            className='mt-3'
                                            placeholder='Phone number'
                                            error={!!errors.phoneNumber}
                                            helperText={errors.phoneNumber ? errors.phoneNumber.message : ''}
                                            onChange={(e) => field.onChange(formatPhoneNumber(e.target.value))}
                                            sx={{
                                                '& .MuiInputBase-input::placeholder': {
                                                    fontSize: '1rem',
                                                    fontWeight: '400',
                                                    fontFamily: 'DM Sans, sans-serif',
                                                    color: 'rgba(152, 142, 169, 1)'
                                                },
                                                '& .MuiOutlinedInput-root': {
                                                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                                                    backgroundColor: "#fff",
                                                    '& fieldset': {
                                                        border: 'none',
                                                    },
                                                },
                                            }} InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position='start'>
                                                        <img src="/images/phoneIcon.svg" />
                                                        <Divider sx={{ height: 28, ml: 1, mr: 1 }} orientation="vertical" />
                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                    )}
                                />
                                <Autocomplete
                                    multiple
                                    className="mt-3"
                                    options={getFilteredOptions()}
                                    freeSolo
                                    value={tags}
                                    onChange={(event, newValue) => {
                                        setTags(newValue);
                                    }}
                                    inputValue={inputValue}
                                    onInputChange={handleInputChange}
                                    renderTags={(value, getTagProps) =>
                                        value.map((option, index) => {
                                            const { key, onDelete, ...tagProps } = getTagProps({ index });
                                            return (
                                                <CustomChip
                                                    variant="outlined"
                                                    label={option}
                                                    key={key}
                                                    sx={{ color: "#fff", backgroundColor: "#FF5A59" }}
                                                    {...tagProps}
                                                    deleteIcon={<CancelIcon />}
                                                    onDelete={() => {
                                                        const newTags = tags.filter((tag, i) => i !== index);
                                                        setTags(newTags);
                                                    }}
                                                />
                                            );
                                        })
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            placeholder={tags.length === 0 ? "Areas of interest" : ""}
                                            inputProps={{ ...params.inputProps, readOnly: tags.length >= 5 }}
                                            onBlur={handleBlur}
                                            onKeyDown={handleInputKeyDown}
                                            error={false}
                                            helperText={''}
                                            sx={{
                                                '& .MuiInputBase-input::placeholder': {
                                                    fontSize: '1rem',
                                                    fontWeight: '400',
                                                    fontFamily: 'Manrope',
                                                    color: 'rgba(152, 142, 169, 1)'
                                                },
                                                '& .MuiOutlinedInput-root': {
                                                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                                                    backgroundColor: "#fff",
                                                    paddingLeft: "15px",
                                                    '& fieldset': {
                                                        border: 'none',
                                                    },
                                                },
                                            }}
                                        />
                                    )}
                                />
                                {errors.interest && <FormHelperText sx={{ ml: 2, fontSize: '0.75rem', color: '#d32f2f', fontWeight: 400 }}>{errors.interest.message}</FormHelperText>}
                                <FormControl
                                    error={!!errors.dob}
                                    className='mt-3'
                                    sx={{
                                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                                        backgroundColor: "#fff",
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            border: 'none',
                                        },
                                        '& .MuiSelect-select': {
                                            textAlign: "start",
                                            marginLeft: "10px"
                                        },
                                    }}
                                >
                                    <Controller
                                        name="dob"
                                        control={control}
                                        rules={{ required: 'Age group is required' }}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                displayEmpty
                                                renderValue={(selected) => {
                                                    if (!selected) {
                                                        return (
                                                            <span style={{
                                                                fontSize: '1rem',
                                                                fontWeight: '400',
                                                                fontFamily: 'DM Sans, sans-serif',
                                                                color: 'rgba(212, 208, 222, 1)'
                                                            }}>
                                                                Age group
                                                            </span>
                                                        );
                                                    }

                                                    return selected;
                                                }}
                                            >
                                                <MenuItem value="18 to 32">18 to 32</MenuItem>
                                                <MenuItem value="33 to 45">33 to 45</MenuItem>
                                                <MenuItem value="46 to 60">46 to 60</MenuItem>
                                                <MenuItem value="60+">60+</MenuItem>
                                            </Select>
                                        )}
                                    />
                                </FormControl>
                                {errors.dob && <FormHelperText sx={{ ml: 2, fontSize: '0.75rem', color: '#d32f2f', fontWeight: 400 }}>{errors.dob.message}</FormHelperText>}
                            </Box>
                            <Grid sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                                <Button
                                    disabled={loading}
                                    type="submit"
                                    sx={{
                                        backgroundColor: "#FF5A59",
                                        width: "60%",
                                        padding: "14px 0px",
                                        color: "#fff",
                                        fontSize: "15px",
                                        borderRadius: "10px",
                                        textTransform: "capitalize",
                                        textAlign: "center",
                                        '&:hover': {
                                            backgroundColor: "#E04948",
                                        },
                                        '&.Mui-disabled': {
                                            backgroundColor: "#FF5A59",
                                            color: "#fff",
                                        }
                                    }}
                                    className='mt-4'
                                >
                                    {loading ? (
                                        <FontAwesomeIcon icon={faSpinner} size="xl" spin />
                                    ) : (
                                        fieldsCompeleteStatus ? (
                                            <>Update Profile</>
                                        ) : (
                                            <>Create Profile</>
                                        )
                                    )}
                                </Button>
                            </Grid>
                        </form>
                    </Card>
                </Box>
            </motion.div>
        </AnimatePresence>
    );
};

export default UserProfile;
