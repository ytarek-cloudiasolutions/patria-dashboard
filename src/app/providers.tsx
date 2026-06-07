import { Provider } from "react-redux";
import { store } from "./store";
import { LanguageProvider } from "@/shared/i18n/LanguageProvider";

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <LanguageProvider>{children}</LanguageProvider>
    </Provider>
  );
};

export default AppProviders;