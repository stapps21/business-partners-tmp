import React from 'react'
import ReactDOM from 'react-dom/client'
import { IntlProvider } from 'react-intl';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './main.css'
import App from "./App.tsx";
import AuthProvider from './contexts/AuthContext.tsx';

// Importing locale data
import en from './locales/en.json';
import de from './locales/de.json';
import { Toaster } from "react-hot-toast";

// Locale detection logic (simplified example)
const locale = navigator.language;
let messages;
switch (locale) {
    case 'de':
    case 'de-DE':
        messages = de;
        break;
    case 'en':
    case 'de-GB':
    case 'de-US':
        messages = en;
        break;
    default:
        messages = de;
        break;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Toaster
            position="top-center"
            reverseOrder={false}
            gutter={8}
            containerClassName=""
            containerStyle={{}}
            toastOptions={{
                // Define default options
                className: '',
                duration: 5000,
                style: {
                    background: '#363636',
                    color: '#fff',
                },

                // Default options for specific types
                success: {
                    duration: 3000,
                    /*theme: {
                        primary: 'green',
                        secondary: 'black',
                    },*/
                },
            }}
        />
        <IntlProvider locale={locale} messages={messages}>
            <AuthProvider>
                <App />
            </AuthProvider>
        </IntlProvider>
    </React.StrictMode>,
)
