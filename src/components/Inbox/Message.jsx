/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Box, Avatar, Typography, TextField, Divider } from '@mui/material';
import { GetChatRoomId, GetConverstation, SendMessage, GetSingleAssistant } from '../../services/chat';

const Message = ({ assistantId, userId, userName }) => {
    const [userMessage, setUserMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [user, setUser] = useState({});
    const [assistant, setAssistant] = useState({});
    const [chatRoomId, setChatRoomId] = useState(null);
    const [staticData, setStaticData] = useState({});

    useEffect(() => {
        const fetchAgent = async () => {
            try {
                const assistantRecord = await GetSingleAssistant(localStorage.getItem('token'), assistantId);
                console.log(assistantRecord.data);
                setStaticData(assistantRecord.data.assistants);
            } catch (error) {
                console.log(error);
            }
        };
        const fetchResponse = async () => {
            try {
                const response = await GetChatRoomId(localStorage.getItem('token'), userId, assistantId);
                if (response.status === 200) {
                    setChatRoomId(response.data.chatRoomId);
                    const conversation = await GetConverstation(localStorage.getItem('token'), response.data.chatRoomId);
                    setMessages(conversation.data.messages);
                    setUser(conversation.data.user);
                    setAssistant(conversation.data.assistant);
                }
            } catch (error) {
                console.log(error);
            }
        };
        const fetchData = async () => {
            try {
                await Promise.all([fetchResponse(), fetchAgent()]);
            } catch (error) {
                console.log("Error in fetching data", error);
            }
        };

        fetchData();
    }, [assistantId, userId]);

    const assistantMessage = {
        name: `${staticData.name} - MMI Assistant`,
        avatar: staticData.profilePicture,
        message: `Hey, ${userName}. ${staticData.name} from MMI here. I’ll be here for any questions you might have. Let me know how things are going with your experience.`,
        sender: staticData.name,
    };

    const handleSendMessage = async () => {
        if (userMessage.trim()) {
            try {
                const data = {
                    userId,
                    assistantId,
                    message: userMessage,
                    sender: 'user',
                    receiver: 'assistant',
                };

                const response = await SendMessage(localStorage.getItem('token'), data);
                if (response.status === 200) {
                    setMessages([...messages, data]);
                    setUserMessage('');
                }
            } catch (error) {
                console.log(error);
            }
        }
    };

    return (
        <>
            {/* Static Assistant Message */}
            <Box sx={{ display: 'flex', alignItems: 'start', gap: 0.5, mt: 2 }}>
                <Avatar
                    src={assistantMessage.avatar}
                    alt={assistantMessage.name}
                    sx={{
                        width: { xs: 60, sm: 70 },
                        height: { xs: 60, sm: 70 },
                    }}
                />
                <Typography
                    variant="subtitle1"
                    sx={{
                        fontWeight: '500',
                        fontFamily: "Manrope",
                        color: "rgba(0, 0, 0, 1)",
                        fontSize: { xs: '0.9rem', sm: '1.25rem' }  // Responsive font size
                    }}
                >
                    {assistantMessage.name}
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'start', mt: 2, flexDirection: "column" }}>
                <Typography
                    gutterBottom
                    variant="subtitle1"
                    sx={{
                        fontWeight: '400',
                        color: "rgba(0, 0, 0, 1)",
                        fontFamily: "Manrope",
                        fontSize: { xs: '0.8rem', sm: '1.25rem' }  // Responsive font size
                    }}
                >
                    {assistantMessage.message}
                </Typography>
                <Typography
                    gutterBottom
                    variant="subtitle1"
                    sx={{
                        mt: 2,
                        fontWeight: '400',
                        color: "rgba(0, 0, 0, 1)",
                        fontFamily: "Manrope",
                        fontSize: { xs: '0.8rem', sm: '1.25rem' }  // Responsive font size
                    }}
                >
                    - {assistantMessage.sender}
                </Typography>
            </Box>

            {/* Dynamic Messages */}
            <Box sx={{ display: 'flex', alignItems: 'start', mt: 2, flexDirection: "column" }}>
                {messages.map((msg, index) => (
                    <React.Fragment key={index}>
                        <Box sx={{ display: 'flex', alignItems: 'start', gap: 0.5, mt: 2 }}>
                            <Avatar
                                src={msg.sender === 'user' ? user.profilePicture : assistant.profilePicture}
                                alt={msg.sender === 'user' ? user.name : assistant.name}
                                sx={{
                                    width: { xs: 60, sm: 70 },
                                    height: { xs: 60, sm: 70 },
                                }}
                            />
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    fontWeight: '500',
                                    fontFamily: "Manrope",
                                    color: "rgba(0, 0, 0, 1)",
                                    fontSize: { xs: '0.9rem', sm: '1.25rem' }  // Responsive font size
                                }}
                            >
                                {msg.sender === 'user' ? user.name : `${assistant.name} - MMI Assistant`}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'start', mt: 2, flexDirection: "column" }}>
                            <Typography
                                gutterBottom
                                variant="subtitle1"
                                sx={{
                                    fontWeight: '400',
                                    color: "rgba(0, 0, 0, 1)",
                                    fontFamily: "Manrope",
                                    fontSize: { xs: '0.8rem', sm: '1.25rem' }  // Responsive font size
                                }}
                            >
                                {msg.message}
                            </Typography>
                            <Typography
                                gutterBottom
                                variant="subtitle1"
                                sx={{
                                    mt: 1,
                                    fontWeight: '400',
                                    color: "rgba(0, 0, 0, 1)",
                                    fontFamily: "Manrope",
                                    fontSize: { xs: '0.8rem', sm: '1.25rem' }  // Responsive font size
                                }}
                            >
                                - {msg.sender === 'user' ? user.name : assistant.name}
                            </Typography>
                        </Box>
                        <Divider sx={{ mt: 2 }} />
                    </React.Fragment>
                ))}
            </Box>

            {/* Input Box for Sending Messages */}
            <Typography
                gutterBottom
                variant="subtitle1"
                sx={{
                    mt: 2,
                    fontWeight: '500',
                    color: "rgba(0, 0, 0, 1)",
                    fontFamily: "Manrope",
                    fontSize: { xs: '0.8rem', sm: '1.25rem' }  // Responsive font size
                }}
            >
                Reply to {assistant.name}
            </Typography>
            <form style={{ width: "100%" }} onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}>
                <TextField
                    multiline
                    minRows={5}
                    fullWidth
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)} // Update state on input change
                    InputProps={{ style: { borderRadius: "10px" } }}
                    sx={{
                        '& .MuiInputBase-root': {
                            fontSize: { xs: '0.8rem', sm: '1rem' }, // Adjust font size for responsiveness
                            padding: '10px' // Adjust padding for better spacing
                        }
                    }}
                />
                <Box sx={{ display: 'flex', justifyContent: "flex-end", mt: 1.5, cursor: "pointer", mb: 5 }} onClick={handleSendMessage}>
                    <img src="/images/sendArrow.svg" style={{ width: "1.5rem", height: "1.58rem" }} alt="Send" />
                    <Typography sx={{ ml: 1, fontSize: '1.1rem' }} >Send</Typography>
                </Box>
            </form>
        </>
    );
}

export default Message;
