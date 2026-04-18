import { Helmet } from "react-helmet"
import { SuggestionsComponent } from "../../components/emails/suggestComponent";


const SuggestionsComponentPage = () => {

    return(
        <div>
            <Helmet> <title>  Sugerencias</title>  </Helmet>
                <SuggestionsComponent/>
        </div>
    )
}

export default SuggestionsComponentPage