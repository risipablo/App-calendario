import { Helmet } from "react-helmet"
import { ChartContainer } from "../../components/charts/chartContainer";





const ResumeChart = () => {

    return(
        <div>
            <Helmet> <title> Estadisticas </title> </Helmet>
            <ChartContainer/>
        </div>
    )
}

export default ResumeChart