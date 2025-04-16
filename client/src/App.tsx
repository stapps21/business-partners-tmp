import {CssBaseline, Theme, ThemeProvider} from "@mui/material";
import {ColorModeContext, useMode} from "./theme";
import {router} from "./routes.tsx";
import {RouterProvider} from "react-router-dom";
import {QueryClient, QueryClientProvider} from "react-query";
import toast, {useToasterStore} from "react-hot-toast";
import {useEffect} from "react";

const queryClient = new QueryClient()

export default function App() {
    const [theme, colorMode] = useMode();

    const {toasts} = useToasterStore();

    const TOAST_LIMIT = 3

    useEffect(() => {
        toasts
            .filter((t) => t.visible) // Only consider visible toasts
            .filter((_, i) => i >= TOAST_LIMIT) // Is toast index over limit?
            .forEach((t) => toast.dismiss(t.id)); // Dismiss – Use toast.remove(t.id) for no exit animation
    }, [toasts]);

    return (
        <QueryClientProvider client={queryClient}>
            <ColorModeContext.Provider value={colorMode as { toggleColorMode: () => void }}>
                <ThemeProvider theme={theme as Theme}>
                    <CssBaseline/>
                    <RouterProvider router={router}/>
                </ThemeProvider>
            </ColorModeContext.Provider>
        </QueryClientProvider>
    );
}