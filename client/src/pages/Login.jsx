import React, { useState } from 'react'
import TextField from '@mui/material/TextField';
import '../styles.css'
import { Button, FormControl, IconButton, Input, InputAdornment, InputLabel } from '@mui/material';
import { LoadingButton } from '@mui/lab'
import { Link, useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios'
import useUsersContext from '../hooks/use-users-context';

export default function Login() {
    const { updateLoggedIn } = useUsersContext()
    const navigate = useNavigate();

    // State variables
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isEmailValid, setIsEmailValid] = useState(true)
    const [loader, setLoader] = useState(false)
    const [showPassword, setShowPassword] = useState(false);

    // helper variables
    const [emailHelper, setEmailHelper] = useState("")
    const [passwordHelper, setPasswordHelper] = useState("")


    // Events
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (e) => {
        e.preventDefault();
    };

    // Validation
    const validateEmail = (e) => {
        setEmail(e.target.value)
        var emailPattern = /^(\b[a-z]+)+([a-z0-9]+)+([\.-]?[a-z0-9])*@[a-z]+([\.-]?[a-z]+)*(\.[a-z]{1,3})+$/
        var spl = /[!#$%^&*()~`\_\-\+\={}\[\]|\\;:'",/<>?]/g
        if (email.match(emailPattern) && !email.match(spl)) {
            setIsEmailValid(true)
            return
        }
        setIsEmailValid(false)
    }

    const handlePassword = (e) => {
        if (e.target.value.match(/\s/g))
            return
        setPassword(e.target.value)
        setPasswordHelper(null)
    }

    // Click Event
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!isEmailValid)
            return

        // Loader set
        setLoader(true)

        // API request
        const login = await axios.post(import.meta.env.VITE_SERVER + "/login", {
            email,
            password
        })

        console.log("press")

        if (!login.data.result) {
            setLoader(false)
            if (login.data.message === "Invalid email") {
                setIsEmailValid(false)
                setEmailHelper("This email does not exists")
                return
            }
            if (login.data.message === "Invalid Password") {
                setPasswordHelper("Incorrect Password")
                return
            }
        }

        if (login.data.result) {
            setLoader(false)
            localStorage.setItem("auth", login.data.auth)
            localStorage.setItem("auth2", login.data.auth2)
            updateLoggedIn(1)
            navigate('/', { replace: true })
            return
        }
    }

    return (
        <div className="outer-container" id="login">
            <form className="inner-container p-4" id='container' onSubmit={(e) => handleSubmit(e)}>
                <div className='text-center main-text'>
                    <img src={"https://www.akasaair.com/favicon.ico"} className='img-fluid' alt="logo" width="80" />
                </div>
                <div className="row mt-4">

                    <TextField
                        error={isEmailValid ? false : true}
                        required
                        title='Enter your email'
                        label=""
                        placeholder='Email'
                        variant="standard"
                        type='email'
                        onChange={(e) => validateEmail(e)}
                        onBlur={(e) => validateEmail(e)}
                        className='input-field'
                        value={email}
                        helperText={isEmailValid ? null : emailHelper}
                    />
                </div>
                <div className="row">
                    <FormControl
                        required
                        error={passwordHelper ? true : false}
                        className='input-field'
                        title="Enter your password"
                        variant="standard"
                        onPaste={(e) => e.preventDefault()}
                        onCopy={(e) => e.preventDefault()}
                        >
                        <Input
                            className='mt-2'
                            id="password"
                            placeholder="password"
                            type={showPassword ? "text" : "password"}
                            onChange={(e)=>handlePassword(e)}
                            value={password}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                </div>
                <div className="row mt-5">
                    <LoadingButton
                        variant="contained"
                        id="submit-btn"
                        type='submit'
                        size='large'
                        loading={loader}
                    >
                        Login
                    </LoadingButton>
                </div>

                <div className="bottom-area">
                    <div className="bottom-div">

                        <div className='helper-text text-muted'>Or Sign Up using</div>
                        <div className="text-center">
                            <Link to='/signup'>
                                <Button
                                    size='small'
                                >
                                    Signup
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

            </form>

        </div>
    )
}
