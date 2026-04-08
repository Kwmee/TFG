import { createContext, useState } from "react";
import { ROUTE_API_BASE_URL, buildApiUrl } from "../../config/api";


// eslint-disable-next-line react-refresh/only-export-components
export const RouteHelperContext = createContext();

export const RouteHelperProvider = ({ children }) => {
    let [conciertos, setConciertos] = useState([]);

    async function filtrar(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const params = new URLSearchParams(formData);

        const response = await fetch(buildApiUrl(ROUTE_API_BASE_URL, `/filtro?${params}`));

        const data = await response.json();
        setConciertos(data);
        console.log(data);
        
    }



    return (
        <RouteHelperContext.Provider value={{ conciertos, setConciertos, filtrar }}>
            {children}
        </RouteHelperContext.Provider>
    )
}
