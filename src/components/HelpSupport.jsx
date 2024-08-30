import { Accordion, AccordionSummary, AccordionDetails, Grid, Typography, Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const HelpSupport = () => {
    const commonFontSize = {
        xs: '1.8rem',
        sm: '2rem',
        md: '2.5rem',
        lg: '2.5rem',
        xl: '2.5rem'
    };

    const imageSize = {
        xs: '1.5rem',
        sm: '2rem',
        md: '3rem',
        lg: '3rem',
        xl: '3rem'
    };

    const [expanded, setExpanded] = useState([]);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? [...expanded, panel] : expanded.filter(item => item !== panel));
    };

    const handleViewAll = () => {
        if (expanded.length === questions.length) {
            setExpanded([]);
        } else {
            setExpanded(questions.map((_, index) => `panel${index}`));
        }
    };

    const questions = [
        { question: "How do I contact My Music Industry?", answer: "You can reach a My Music Industry representative by emailing us at <span style='color: rgba(255, 90, 89, 1);'>support@myindustry.io</span>" },
        { question: "I haven’t received anything from my expert. What should I do?", answer: "" },
        { question: "How do I change my payment information?", answer: "" },
        { question: "How do I enable notifications?", answer: "" },
    ];

    return (
        <>
            <Grid className='container mt-4' sx={{ display: "flex", justifyContent: "space-between", padding: "0px 40px 0px 40px" }}>
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
                <Grid item>
                    <Typography fontSize={commonFontSize} fontFamily={'Manrope'} fontWeight={500}>HELP & SUPPORT</Typography>
                </Grid>
                <Grid item>
                </Grid>
            </Grid>
            <Grid className='container mt-4' sx={{ display: "flex", justifyContent: "space-between", padding: "0px 40px 0px 40px" }}>
                <Grid item>
                    <Typography sx={{ color: 'rgba(51, 46, 60, 1)', fontFamily: "Manrope", fontWeight: 600, fontSize: { xs: '0.95rem', md: '1rem', lg: '1.4rem' } }}> Top Questions</Typography>
                </Grid>
                <Grid item sx={{ cursor: "pointer" }}>
                    <Typography onClick={handleViewAll} sx={{ color: 'rgba(255, 90, 89, 1)', fontFamily: "Manrope", fontWeight: 600, fontSize: { xs: '0.95rem', md: '1rem', lg: '1.4rem' } }}>
                        {expanded.length === questions.length ? 'Collapse All' : 'View All'}
                    </Typography>
                </Grid>
            </Grid>
            <Grid className='container mt-4' sx={{ display: "flex", justifyContent: "center", padding: "0px 40px 0px 40px", flexDirection: "column" }}>
                {questions.map((item, index) => (
                    <Box key={index} sx={{ mb: 2, borderRadius: 2.5, overflow: 'hidden', border: "2px solid rgba(152, 142, 169, 1)" }}>
                        <Accordion
                            expanded={expanded.includes(`panel${index}`)}
                            onChange={handleChange(`panel${index}`)}
                            sx={{
                                boxShadow: 'none',
                                backgroundColor: "rgba(255, 252, 249, 1)",
                                '&:before': {
                                    display: 'none',
                                },
                                '&:first-of-type': {
                                    borderTopLeftRadius: 2.5,
                                    borderTopRightRadius: 2.5,
                                },
                                '&:last-of-type': {
                                    borderBottomLeftRadius: 2.5,
                                    borderBottomRightRadius: 2.5,
                                }
                            }}
                        >
                            <AccordionSummary
                                expandIcon={expanded.includes(`panel${index}`) ? <RemoveIcon sx={{ color: "rgba(255, 90, 89, 1)" }} /> : <AddIcon sx={{ color: "rgba(255, 90, 89, 1)" }} />}
                                aria-controls={`panel${index}bh-content`}
                                id={`panel${index}bh-header`}
                                sx={{
                                    borderRadius: 2.5
                                }}
                            >
                                <Typography sx={{ fontFamily: "Manrope", fontWeight: 600 }}>{item.question}</Typography>
                            </AccordionSummary>
                            <AccordionDetails
                                sx={{
                                    borderRadius: 2.5
                                }}
                            >
                                <Typography sx={{ fontFamily: "Manrope" }} dangerouslySetInnerHTML={{ __html: item.answer }}>
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    </Box>
                ))}
            </Grid>
        </>
    );
}

export default HelpSupport;
