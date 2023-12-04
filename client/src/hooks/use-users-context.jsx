import { useContext } from "react";
import UsersContext from "../context/users";

function useUsersContext() {
    return useContext(UsersContext).values
}

export default useUsersContext