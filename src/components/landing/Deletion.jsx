import React from 'react';
import { Grid, Typography } from '@mui/material';

const Deletion = () => {
    return (
        <Grid container spacing={2} justifyContent="center" alignItems="flex-start" style={{ padding: '20px' }}>
            <Grid item xs={12} md={8}>
                <Typography variant="h4" gutterBottom>
                    User Deletion Policy
                </Typography>

                <Typography variant="h6" gutterBottom>
                    1. Overview
                </Typography>
                <Typography variant="body1" paragraph>
                    At My Industry, we respect your right to privacy and data management. This User Deletion Policy outlines the procedures and conditions under which you can request the deletion of your account and associated data.
                </Typography>

                <Typography variant="h6" gutterBottom>
                    2. Account Deletion Process
                </Typography>
                <Typography variant="body1" paragraph>
                    If you wish to delete your account, you may do so by following these steps:
                </Typography>
                <Typography variant="body1" paragraph>
                    1. **Submit a Request:** Contact our support team at support@myindustry.io with the subject line "Account Deletion Request". Please include your account details and the reason for your request.
                </Typography>
                <Typography variant="body1" paragraph>
                    2. **Verification:** Our team will verify your identity and the ownership of the account in question. This may involve answering security questions or providing additional information.
                </Typography>
                <Typography variant="body1" paragraph>
                    3. **Processing:** Upon successful verification, we will initiate the deletion process. This may take up to 14 business days to complete. You will receive a confirmation email once your account and associated data have been deleted.
                </Typography>

                <Typography variant="h6" gutterBottom>
                    3. Data Retention After Deletion
                </Typography>
                <Typography variant="body1" paragraph>
                    Once your account is deleted, the following data retention policies apply:
                </Typography>
                <Typography variant="body1" paragraph>
                    - **Personal Data:** All personal data associated with your account will be permanently deleted from our systems, except where required by law for legal, regulatory, or security purposes.
                </Typography>
                <Typography variant="body1" paragraph>
                    - **Anonymized Data:** Any data that has been anonymized or aggregated for statistical analysis will not be deleted, as it cannot be traced back to you personally.
                </Typography>

                <Typography variant="h6" gutterBottom>
                    4. Revocation of Deletion Request
                </Typography>
                <Typography variant="body1" paragraph>
                    If you change your mind after submitting a deletion request, you may revoke your request by contacting us at support@myindustry.io before the deletion process is completed. Once the process is finalized, it cannot be undone.
                </Typography>

                <Typography variant="h6" gutterBottom>
                    5. Contact Information
                </Typography>
                <Typography variant="body1" paragraph>
                    If you have any questions or concerns about this User Deletion Policy, please contact us at:
                </Typography>
                <Typography variant="body1" paragraph>
                    Email: support@myindustry.io
                </Typography>
            </Grid>
        </Grid>
    );
}

export default Deletion;
