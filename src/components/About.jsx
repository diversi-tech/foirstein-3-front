// About.js
import React from 'react';
import { Container, Typography } from '@mui/material';

const About = () => {
    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                ברוכים הבאים לעמוד אודות
            </Typography>
            <Typography variant="body1" component="p">
                כאן תוכלו למצוא מידע נוסף על האתר שלנו.
            </Typography>
        </Container>
    );
};

export default About;
