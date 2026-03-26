import { Helmet } from "react-helmet"
import { ChartContainer } from "../components/charts/chartContainer"




export const ResumeChart = () => {

    return(
        <div className="container-pages">
            <Helmet> <title> Estadisticas </title> </Helmet>
            <ChartContainer/>
        </div>
    )
}