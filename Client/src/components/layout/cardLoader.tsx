import { ClipLoader } from "react-spinners";
import "../../style/dashboard.css"

export const CardLoader = () => (
    <div className="dashboard-card card-loading">
        <div className="card-main-content">
            <div className="card-loading-content">
                <ClipLoader color="#8e7cc3" size={40} />
                <p className="loading-text">Cargando...</p>
            </div>
        </div>
    </div>
)