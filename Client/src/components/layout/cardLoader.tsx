
import "../../style/dashboard.css"

export const CardLoader = () => (
    <div className="dashboard-card card-loading">
        <div className="card-main-content">
            <div className="card-loading-content">
                <div className="loader-spinner">
                    <div className="spinner-dot"></div>
                    <div className="spinner-dot"></div>
                    <div className="spinner-dot"></div>
                </div>
                <p className="loading-text">Cargando...</p>
            </div>
        </div>
    </div>
);
 