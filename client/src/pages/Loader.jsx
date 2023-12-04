import React, { useEffect } from 'react'
import '../styles.css'
import useUsersContext from '../hooks/use-users-context'
import axios from 'axios';

export default function Loader() {
    const { updateLoggedIn } = useUsersContext()

    useEffect(() => {
        setTimeout(() => {
            setTimeout(window.dispatchEvent(new Event("storage")), 3000)
        }, 2000)
    }, [])

    window.addEventListener('storage', async () => {
        // logout validation
        if (!localStorage.getItem("auth") || !localStorage.getItem("auth2")) {
            localStorage.removeItem("auth")
            localStorage.removeItem("auth2")
            updateLoggedIn(-1)
            return
        }

        const verify = await axios.post(import.meta.env.VITE_SERVER + "/verify", {
            auth: localStorage.getItem("auth"),
            auth2: localStorage.getItem("auth2")
        })

        if (await verify.data.result === 1) {
            console.log("verified")
            updateLoggedIn(1)
            return
        }
        else {
            localStorage.removeItem("auth")
            localStorage.removeItem("auth2")
            updateLoggedIn(-1)
        }

    })
    return (
        <div className='d-flex justify-content-center align-items-center loader-container'>
            <div className="loader"><div></div><div></div><div></div></div>
        </div>
    )
}