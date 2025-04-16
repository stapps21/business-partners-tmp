import { useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { toast } from 'react-hot-toast';
import { Box, Button, LinearProgress, TextField, Typography } from '@mui/material';
import zxcvbn from 'zxcvbn';
import api from '../api/axios';

export const ResetPasswordPage = () => {
    const { otp } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [passwordError, setPasswordError] = useState('');

    const passwordStrengthColors = ['#ff3e36', '#ff691f', '#f6bf26', '#0f9d58'];

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        const strength = zxcvbn(newPassword);
        setPasswordStrength(strength.score);
        //setPasswordError(strength.score < 3 ? 'Add more characters or symbols to strengthen your password' : '');
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (passwordStrength < 3) {
            setPasswordError('Password is too weak');
            return;
        }
        try {
            await api.post('/auth/password-reset', { otp, password });
            toast.success('Password reset successfully!');
            navigate('/login');
        } catch (error) {
            toast.error('Failed to reset password. Please try again.');
        }
    };

    return (
        <Box sx={{ maxWidth: 400, mx: 'auto', mt: 5 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>Reset Your Password</Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label="New Password"
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    error={passwordError !== ''}
                    helperText={passwordError || 'Use 8+ characters with a mix of letters, numbers & symbols'}
                    sx={{ mb: 2 }}
                />
                <LinearProgress variant="determinate" value={(passwordStrength) * 25} style={{ backgroundColor: '#ddd', marginBottom: 2, height: 10, borderRadius: 5, color: passwordStrengthColors[passwordStrength] }} />
                <Typography variant="body2" color={passwordStrengthColors[passwordStrength]}>
                    Password strength: {['Too Weak', 'Weak', 'Fair', 'Good', 'Strong'][passwordStrength]}
                </Typography>
                <Button disabled={passwordStrength < 3} type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                    Reset Password
                </Button>
            </form>
        </Box>
    );
}

export default ResetPasswordPage;
