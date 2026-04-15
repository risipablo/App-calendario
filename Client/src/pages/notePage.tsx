import { Helmet } from "react-helmet"

import { NoteMaster } from "../components/notes/noteMaster";


 const NotePage = () => {

    return(
        <>
            <Helmet>
                <title> Notas Rapidas </title>
            </Helmet>
            <NoteMaster/>
        </>
    )
}

export default NotePage