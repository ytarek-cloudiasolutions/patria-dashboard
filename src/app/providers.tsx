import { Provider } from "react-redux";
import { store } from "./store";
import { LanguageProvider } from "@/shared/i18n/LanguageProvider";
import ToastProvider from "@/shared/components/ToastProvider";

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <LanguageProvider>
        <ToastProvider>{children}</ToastProvider>
      </LanguageProvider>
    </Provider>
  );
};

export default AppProviders;
