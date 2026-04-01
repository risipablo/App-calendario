import { Helmet } from "react-helmet"
import { GoalMaster } from "../components/goals/goalMaster"


 const GoalPage = () => {

    return(
        <>
            <Helmet>
                <title> Metas </title>
            </Helmet>
            <GoalMaster/>
        </>
    )
}

export default GoalPage