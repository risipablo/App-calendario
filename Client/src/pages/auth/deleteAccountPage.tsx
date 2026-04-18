import type { FC } from "react";
import { DeleteAccountButton } from "../../components/auth/user/deleteAccount";
import type { AuthenticatedProps } from "../../App";


const DeleteAccountPage: FC<AuthenticatedProps> = ({ setIsAuthenticated, isAuthenticated }) => {

    return(
        <DeleteAccountButton setIsAuthenticated={setIsAuthenticated} isAuthenticated={isAuthenticated} />
    )
}

export default DeleteAccountPage