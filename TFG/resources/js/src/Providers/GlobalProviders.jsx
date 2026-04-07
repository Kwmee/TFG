import { HelpersIndexProvider } from "../INDEX/Helpers/HelpersIndex";
import { RouteHelperProvider } from "../ROUTE/Helpers/RouteHelper";
import { HelperTiendaProvider } from "../TIENDA/Helpers/HelperTienda";
import { HelperTicketsProvider } from "../TICKETS/Helper/HelperTickets";
import { HelperModalProvider } from "../Components/Modal/Helper/HelperModal";
import { HelperLoginProvider } from "../LOGIN/Helpers/HelperLogin";

function GlobalProvider({ children }) {
  return (
    <HelperLoginProvider>
      <HelperModalProvider>
        <HelperTicketsProvider>
          <HelperTiendaProvider>
            <RouteHelperProvider>
              <HelpersIndexProvider>
                {children}
              </HelpersIndexProvider>
            </RouteHelperProvider>
          </HelperTiendaProvider>
        </HelperTicketsProvider>
      </HelperModalProvider>
    </HelperLoginProvider>
  );
}

export default GlobalProvider;
