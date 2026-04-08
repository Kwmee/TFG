import { createContext, useEffect, useState } from "react";


// eslint-disable-next-line react-refresh/only-export-components
export const RouteHelperContext = createContext();

export const RouteHelperProvider = ({ children }) => {
    let [conciertos, setConciertos] = useState([]);

    async function filtrar(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const params = new URLSearchParams(formData);

        const response = await fetch(`https://tfg-production-5282.up.railway.app/filtro?${params}`);

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


