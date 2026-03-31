import { Helmet } from "react-helmet"
import { GoalMaster } from "../components/goals/goalMaster"


 const GoalPage = () => {

    return(
        <div>
            <Helmet>
                <title> Metas </title>
            </Helmet>
            <GoalMaster/>
        </div>
    )
}

export default GoalPage