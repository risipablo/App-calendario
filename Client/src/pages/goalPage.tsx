import { Helmet } from "react-helmet"
import { GoalMaster } from "../components/goals/goalMaster"


export const GoalPage = () => {

    return(
        <div className="container-pages">
            <Helmet>
                <title> Metas </title>
            </Helmet>
            <GoalMaster/>
        </div>
    )
}