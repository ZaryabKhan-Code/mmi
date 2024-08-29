import React from 'react';
import { Grid, Typography } from '@mui/material';

const Privacy = () => {
    return (
        <Grid container spacing={2} justifyContent="center" alignItems="flex-start" style={{ padding: '20px', mt: 5 }}>
            <Grid item xs={12} md={8}>
                <Typography variant="h4" gutterBottom>
                    Privacy Policy
                </Typography>

                <Typography variant="h6" gutterBottom>
                    1. Introduction
                </Typography>
                <Typography variant="body1" paragraph>
                    Welcome to My Industry. We value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and share information when you log in to our services using your Facebook account.
                </Typography>

                <Typography variant="h6" gutterBottom>
                    2. Information We Collect
                </Typography>
                <Typography variant="body1" paragraph>
                    When you choose to log in through Facebook, we collect the following information:
                </Typography>
                <Typography variant="body1" paragraph>
                    <strong>Basic Profile Information:</strong> Your name, profile picture, gender, user ID, and email address.
                </Typography>
                <Typography variant="body1" paragraph>
                    <strong>Public Profile Data:</strong> Any other information you have made publicly available on your Facebook profile, such as your friend list or likes.
                </Typography>
                <Typography variant="body1" paragraph>
                    <strong>Activity Information:</strong> Information related to your use of our services, such as interactions with content, features, or other users.
                </Typography>

                <Typography variant="h6" gutterBottom>
                    3. How We Use Your Information
                </Typography>
                <Typography variant="body1" paragraph>
                    The information collected through Facebook is used to:
                </Typography>
                <Typography variant="body1" paragraph>
                    <strong>Authenticate Your Account:</strong> Allow you to log in and access our services.
                </Typography>
                <Typography variant="body1" paragraph>
                    <strong>Personalize Your Experience:</strong> Provide tailored content, recommendations, and features based on your Facebook profile.
                </Typography>
                <Typography variant="body1" paragraph>
                    <strong>Communication:</strong> Send notifications, updates, and promotional messages related to your account and our services.
                </Typography>
                <Typography variant="body1" paragraph>
                    <strong>Improvement of Services:</strong> Analyze usage data to improve and enhance our platform, ensuring a better user experience.
                </Typography>

                <Typography variant="h6" gutterBottom>
                    4. Sharing Your Information
                </Typography>
                <Typography variant="body1" paragraph>
                    We do not sell or rent your personal information to third parties. However, we may share your information with:
                </Typography>
                <Typography variant="body1" paragraph>
                    <strong>Service Providers:</strong> Trusted third-party service providers who assist us in operating our platform, such as hosting services, data analytics, and customer support.
                </Typography>
                <Typography variant="body1" paragraph>
                    <strong>Legal Requirements:</strong> Authorities or legal entities if required by law, or to protect our rights, property, and safety.
                </Typography>
                <Typography variant="body1" paragraph>
                    <strong>Facebook:</strong> Certain data may be shared back with Facebook to enhance your experience or comply with their policies.
                </Typography>

                <Typography variant="h6" gutterBottom>
                    5. Your Choices
                </Typography>
                <Typography variant="body1" paragraph>
                    You have the following choices regarding your Facebook login:
                </Typography>
                <Typography variant="body1" paragraph>
                    <strong>Review and Modify Permissions:</strong> You can review and adjust the permissions you grant to our application within your Facebook settings.
                </Typography>
                <Typography variant="body1" paragraph>
                    <strong>Revoke Access:</strong> You can revoke our access to your Facebook account at any time through your Facebook settings, which will prevent us from collecting further data.
                </Typography>
                <Typography variant="body1" paragraph>
                    <strong>Data Deletion:</strong> If you wish to delete your account or any associated data, please contact us at [Your Contact Information].
                </Typography>

                <Typography variant="h6" gutterBottom>
                    6. Security
                </Typography>
                <Typography variant="body1" paragraph>
                    We take reasonable steps to protect your information from unauthorized access, disclosure, alteration, or destruction. However, no method of transmission over the internet is completely secure.
                </Typography>

                <Typography variant="h6" gutterBottom>
                    7. Changes to This Policy
                </Typography>
                <Typography variant="body1" paragraph>
                    We may update this Privacy Policy from time to time. Any changes will be posted on this page, and we encourage you to review it periodically.
                </Typography>

                <Typography variant="h6" gutterBottom>
                    8. Contact Us
                </Typography>
                <Typography variant="body1" paragraph>
                    If you have any questions or concerns about this Privacy Policy or our practices, please contact us at:
                </Typography>
                <Typography variant="body1" paragraph>
                    Email: support@myindustry.io
                </Typography>
            </Grid>
        </Grid>
    );
}

export default Privacy;
