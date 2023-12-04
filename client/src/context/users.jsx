import { createContext, useState } from "react";

const UsersContext = createContext()

function Provider({ children }) {
    const [loggedIn, setLoggedIn] = useState(0)

    const updateLoggedIn = (status) => {
        setLoggedIn(status)
    }

    const values = {
        loggedIn,
        updateLoggedIn,
    }

    return (
        <UsersContext.Provider value={{ values }}>
            {children}
        </UsersContext.Provider>
    )
}

export { Provider }

export default UsersContext