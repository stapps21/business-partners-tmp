import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { FormattedMessage } from "react-intl";
import { loginService } from "../services/authService.ts";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.ts";
import toast from "react-hot-toast";
import useToggle from '../hooks/useToggle.ts';
import useInput from '../hooks/useInput.ts';

function Copyright() {
    return (
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 4, mb: 4 }}>
            {'Copyright © '}
            <Link color="inherit" href="https://steffen-singer.tech/" target="_blank">
                Steffen Singer
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

export default function LoginPage() {

    const { login: setUser } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const loginResponse = await loginService(data.get('mail') as string, data.get('password') as string)
        if (loginResponse) {
            setUser(loginResponse.data.accessToken, loginResponse.data.firstName, loginResponse.data.lastName, loginResponse.data.mail)
            navigate(from, { replace: true });
        } else {
            toast.error("Invalid credentials")
        }
    };

    const [mail, resetMail, mailAttribs] = useInput("userMail", "")
    const [isChecked, toggleCheck] = useToggle("persist", false);

    const handleToggleCheck: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        toggleCheck(event.target.checked);
    };

    return (
        <Container maxWidth="xs">
            <Box
                sx={{
                    marginTop: 16,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    <FormattedMessage
                        id="auth.signIn"
                        defaultMessage="Sign in"
                    />
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="mail"
                        value={mailAttribs.value}
                        onChange={mailAttribs.onChange}
                        label={
                            <FormattedMessage
                                id="auth.mail"
                                defaultMessage="EMail"
                            />
                        }
                        name="mail"
                        autoComplete="mail"
                        autoFocus={mailAttribs.value === ""}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label={
                            <FormattedMessage
                                id="auth.password"
                                defaultMessage="Password"
                            />
                        }
                        type="password"
                        id="password"
                        autoFocus={mailAttribs.value !== ""}
                    />
                    <FormControlLabel
                        control={<Checkbox checked={isChecked} onChange={handleToggleCheck} value="remember" color="primary" />}
                        label="Remember me"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        <FormattedMessage
                            id="auth.signIn"
                            defaultMessage="Sign in"
                        />
                    </Button>
                    {/* <Grid container>
                        <Grid item xs>
                            <Link href="#" variant="body2">
                                Forgot password?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href="#" variant="body2">
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid> */}
                </Box>
            </Box>
            <Copyright />
        </Container>
    );
}