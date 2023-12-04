import React, { useState } from 'react'
import TextField from '@mui/material/TextField';
import '../styles.css'
import { Button, FormControl, IconButton, Input, InputAdornment, InputLabel } from '@mui/material';
import { LoadingButton } from '@mui/lab'
import { Link } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Alert from '@mui/material/Alert';
import axios from 'axios'


export default function Signup() {
    // State variables
    const [fullname, setFullname] = useState("")
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loader, setLoader] = useState(false)
    const [showPassword, setShowPassword] = useState(false);

    // Error Variables
    const [nameError, setNameError] = useState(null)
    const [userNameError, setUsernameError] = useState(null)
    const [emailError, setEmailError] = useState(null)
    const [passError, setPassError] = useState(null)
    const [conPassError, setConPassError] = useState(null)
    const [signupError, setSignupError] = useState(false)
    const [signupSuccess, setSignupSuccess] = useState(false)

    // Events
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (e) => {
        e.preventDefault();
    };

    const handleSingup = async (e) => {
        e.preventDefault()

        setSignupError(false)
        setSignupSuccess(false)

        if (!setNameError && !setEmailError && !setPassError && !setConPassError && !setUsernameError)
        return

        // Loader set
        setLoader(true)

        console.log({
            full_name: fullname,
            email,
            password,
            username
        })

        // API request
        const signup = await axios.post(import.meta.env.VITE_SERVER + "/signup", {
            full_name: fullname,
            email,
            password,
            username
        })

        if (signup.data.result) {
            setSignupSuccess(true)
            setFullname("")
            setEmail("")
            setPassword("")
            setConfirmPassword("")
            setUsername("")
        }
        else {
            setSignupError(signup.data.message)
        }

        setLoader(false)
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    }

    // Validation
    const validateName = (e) => {
        let name = e.target.value

        var spl = /[!@#$%^&*()~`\_\-\+\={}\[\]|\\;:'",./<>?]/g
        var numbers = /[0-9]/g
        if (!(name.match(numbers) || name.match(spl))) {
            setFullname(name)
        }

        var msg = ""
        if (name.length < 2)
            msg += "Minimum 2 characters"

        setNameError(msg)

        if (name.length >= 2) {
            setNameError(null)
            return
        }

    }

    const validateUsername = (e) => {
        let user_name = e.target.value;
        
        var invalidChars = /[^a-z0-9_]/g;
        
        if (user_name.match(invalidChars)) {
            console.log(user_name)
            user_name = user_name.replace(invalidChars, "");
            setUsername(user_name);
        }
        else{
            setUsername(user_name)
        }
    
        var msg = "";
        if (user_name.length < 2) {
            msg += "Minimum 2 characters";
        }
    
        setUsernameError(msg);
    
        if (user_name.length >= 2) {
            setUsernameError(null);
            return;
        }
    }
    

    const validateEmail = (e) => {
        let emailStr = e.target.value

        var spl = /[!#$%^&*()~`\_\-\+\={}\[\]|\\;:'",/<>?]/g
        if (!(emailStr.match(spl) || emailStr.match(/\s/g))) {
            setEmail(emailStr)
        }

        var emailPattern = /^(\b[a-z]+)+([a-z0-9]+)+([\.-]?[a-z0-9])*@[a-z]+([\.-]?[a-z]+)*(\.[a-z]{2,3})+$/

        if (!emailStr.match(emailPattern))
            setEmailError("Invalid email")
        else
            setEmailError(null)

    }

    const validatePassword = (e) => {
        let passwordStr = e.target.value
        var lowercase = /[a-z]/g
        var uppercase = /[A-Z]/g
        var num = /[0-9]/g
        var spl = /[!@#$%^&*()~`\_\-\+\={}\[\]|\\;:'",./<>?]/g

        setPassword(passwordStr)

        var msg = ``

        if (!passwordStr.match(num))
            msg += `<div>• Add a minimum of 1 numeric character [0-9] </div>`

        if (!passwordStr.match(uppercase))
            msg += `<div>• Add a minimum of 1 upper case letter [A-Z] </div>`

        if (!passwordStr.match(lowercase))
            msg += `<div>• Add a minimum of 1 lower case letter [a-z] </div>`

        if (!passwordStr.match(spl))
            msg += `<div>• Add 1 special character: ~\`!@#$%^&*()-_+={}[]|;:\"<>,./? </div>`

        if (passwordStr.length < 8)
            msg += `<div>• Minimum 8 characters </div>`

        setPassError(msg)

        if (passwordStr.match(num) && passwordStr.match(uppercase) && passwordStr.match(lowercase) && passwordStr.match(spl) && passwordStr.length >= 8) {
            setPassError(null)
            return
        }
    }

    const validateConfirmPassword = (e) => {
        let passwordStr = e.target.value
        setConfirmPassword(passwordStr)

        if (passError) {
            setConPassError("Password must be strong")
            return
        }
        if (confirmPassword == null || confirmPassword === "") {
            setConPassError("This field is mandatory")
            return
        }
        if (confirmPassword == password) {
            setConPassError(null)
            return
        }
        setConPassError("Password does not match")
    }

    return (
        <div className="outer-container" id="signup">
            <form className="inner-container p-4" id='container' onSubmit={(e) => handleSingup(e)}>
                {signupError ?
                    <Alert severity="error" className='mb-4'>Signup failed, Please try again later <br /> {signupError}</Alert>
                    : null
                }
                {signupSuccess ?
                    <Alert severity="success" className='mb-4'>Signup Successful, <Link to='/login'>Login</Link> to continue!</Alert>
                    : null
                }
                <div className='text-center main-text'>
                <img src={"https://www.akasaair.com/favicon.ico"} className='img-fluid' alt="logo" width="80" />
                </div>
                <div className="row mt-4">
                    <TextField
                        required
                        error={nameError ? true : false}
                        title='Enter your full name'
                        label=""
                        placeholder="Full Name"
                        variant="standard"
                        onInput={(e) => validateName(e)}
                        type='text'
                        value={fullname}
                        onBlur={(e) => validateName(e)}
                        className='input-field'
                        helperText={nameError}
                    />
                </div>
                <div className="row mt-4">
                    <TextField
                        required
                        error={userNameError ? true : false}
                        title='Enter your username'
                        label=""
                        placeholder="Username"
                        variant="standard"
                        onInput={(e) => validateUsername(e)}
                        type='text'
                        value={username}
                        onBlur={(e) => validateUsername(e)}
                        className='input-field'
                        helperText={userNameError}
                    />
                </div>
                <div className="row mt-4">
                    <TextField
                        required
                        error={emailError ? true : false}
                        title='Enter your email'
                        label=""
                        placeholder="Email"
                        variant="standard"
                        onInput={(e) => validateEmail(e)}
                        onBlur={(e) => validateEmail(e)}
                        type='email'
                        value={email}
                        className='input-field'
                        autoComplete='email'
                        helperText={emailError}
                    />
                </div>
                <div className="row">

                    <FormControl
                        required
                        error={passError ? true : false}
                        className='input-field'
                        title="Enter your password"
                        variant="standard"
                    >
                        <Input
                            className='mt-2'
                            placeholder='Password'
                            autoComplete="current-password"
                            onPaste={(e) => e.preventDefault()}
                            onCopy={(e) => e.preventDefault()}
                            onInput={(e) => validatePassword(e)}
                            id="password"
                            value={password}
                            type={showPassword ? "text" : "password"}
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
                <div>
                    {passError ? <div dangerouslySetInnerHTML={{ __html: passError }}></div> : null}
                </div>
                <div className="row mt-4">
                    <TextField
                        required
                        error={conPassError ? true : false}
                        className='input-field'
                        title="Re-Enter your password"
                        label=""
                        placeholder="Confirm Password"
                        type="password"
                        value={confirmPassword}
                        onInput={(e) => validateConfirmPassword(e)}
                        onBlur={(e) => validateConfirmPassword(e)}
                        variant="standard"
                        autoComplete="current-password"
                        helperText={conPassError}
                    />
                </div>
                <div className="row mt-5 mb-4">
                    <LoadingButton
                        variant="contained"
                        id="submit-btn"
                        type='submit'
                        size='large'
                        loading={loader}
                    >
                        Signup
                    </LoadingButton>
                </div>

                <div className="row mt-5 mb-4">
                    <div className="text-center">
                        <div className='helper-text text-muted'>Already Signed up?</div>
                        <div className="text-center">
                            <Link to='/login'>
                                <Button
                                    size='small'
                                >
                                    Login
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

            </form>

        </div>
    )
}