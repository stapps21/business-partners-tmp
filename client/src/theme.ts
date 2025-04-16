import { createContext, useEffect, useMemo, useState } from "react";
import { createTheme, PaletteOptions, ThemeOptions } from "@mui/material/styles";
import MyCustomFooter from "./components/MyCustomFooter";
// Imported because of: https://mui.com/x/react-data-grid/getting-started/#typescript

// color design tokens export
export const tokens = () => ({
    primary: {
        0: "#000000",
        5: "#00004E",
        10: "#01006E",
        15: "#01008C",
        20: "#0200AC",
        25: "#191DB5",
        30: "#282FBF",
        35: "#363ECB",
        40: "#444CD7",
        50: "#5E67F2",
        60: "#7C84FF",
        70: "#9EA3FF",
        80: "#BFC2FF",
        90: "#E0E0FF",
        95: "#F1EFFF",
        98: "#FBF8FF",
        99: "#FFFBFF",
        100: "#FFFFFF"
    },
    secondary: {
        0: "#000000",
        5: "#0C0E2A",
        10: "#171935",
        15: "#212340",
        20: "#2C2E4B",
        25: "#373957",
        30: "#434463",
        35: "#4E506F",
        40: "#5A5C7C",
        50: "#737496",
        60: "#8D8EB0",
        70: "#A7A8CC",
        80: "#C3C3E8",
        90: "#E0E0FF",
        95: "#F1EFFF",
        98: "#FBF8FF",
        99: "#FFFBFF",
        100: "#FFFFFF"
    },
    tertiary: {
        0: "#000000",
        5: "#28001F",
        10: "#35092B",
        15: "#411435",
        20: "#4E1F41",
        25: "#5B2A4C",
        30: "#683658",
        35: "#754164",
        40: "#834D71",
        50: "#9E658A",
        60: "#BA7EA5",
        70: "#D798C0",
        80: "#F5B3DC",
        90: "#FFD8ED",
        95: "#FFECF4",
        98: "#FFF8F9",
        99: "#FFFBFF",
        100: "#FFFFFF"
    },
    neutral: {
        0: "#000000",
        5: "#111114",
        10: "#1B1B1F",
        15: "#262529",
        20: "#303034",
        25: "#3C3B3F",
        30: "#47464A",
        35: "#535256",
        40: "#5F5E62",
        50: "#78767A",
        60: "#929094",
        70: "#ADAAAF",
        80: "#C8C5CA",
        90: "#E5E1E6",
        95: "#F3EFF4",
        98: "#FCF8FD",
        99: "#FFFBFF",
        100: "#FFFFFF"
    },
    neutralVariant: {
        0: "#000000",
        5: "#101018",
        10: "#1B1B23",
        15: "#25252D",
        20: "#303038",
        25: "#3B3B43",
        30: "#46464F",
        35: "#52515B",
        40: "#5E5D67",
        50: "#777680",
        60: "#918F9A",
        70: "#ACAAB4",
        80: "#C7C5D0",
        90: "#E4E1EC",
        95: "#F2EFFA",
        98: "#FBF8FF",
        99: "#FFFBFF",
        100: "#FFFFFF"
    }
}
);

export interface MyCustomThemeOptions extends ThemeOptions {
    palette: MyCustomPaletteOptions
}

interface MyCustomPaletteOptions extends PaletteOptions {
    sidenav: {
        bgColor: string,
        textColor: string,
        bgColorHover: string,
        textColorHover: string,
        bgColorActive: string,
        textColorActive: string,
        textColorHeadlines: string,
    },
    topbar: {
        bgColor: string,
    }
}

// mui theme settings
export const themeSettings = (mode: "light" | "dark"): MyCustomThemeOptions => {
    //const colors = tokens();
    return {
        palette: {
            mode: mode,
            ...(mode === "light"
                ? {
                    primary: {
                        main: '#565992'
                    },
                    secondary: {
                        main: '#5C5D72',
                    },
                    neutral: {
                        main: '#777680',
                    },
                    background: {
                        default: '#FBF8FF',
                        paper: '#E4E1EC'
                    },
                    sidenav: {
                        bgColor: '#f3f6fc',
                        textColor: '#444746',
                        bgColorHover: '#5C5D72',
                        textColorHover: '#001d35',
                        bgColorActive: '#c2e7ff',
                        textColorActive: '#5C5D72',
                        textColorHeadlines: '#777680',
                    },
                    topbar: {
                        bgColor: '#F1EFFF'
                    }
                } :
                {
                    primary: {
                        main: '#BFC2FF'
                    },
                    secondary: {
                        main: '#C5C4DD',
                    },
                    neutral: {
                        main: '#918F9A',
                    },
                    background: {
                        default: '#131318',
                        paper: '#46464F'
                    },
                    sidenav: {
                        bgColor: '#2d2f31',
                        textColor: '#a7a9a9',
                        bgColorHover: '#303038',
                        textColorHover: '#C7C5D0',
                        bgColorActive: '#004a77',
                        textColorActive: '#c2e7ff',
                        textColorHeadlines: '#918F9A',
                    },
                    topbar: {
                        bgColor: '#111114'
                    }
                }),
        },
        shape: {
            //borderRadius: 28, // Set your desired border radius here
        },
        typography: {
            fontFamily: [
                "-apple-system",
                "BlinkMacSystemFont",
                "Segoe UI",
                "Roboto",
                "Helvetica",
                "Arial",
                "sans-serif",
                "Apple Color Emoji",
                "Segoe UI Emoji",
                "Segoe UI Symbol"
            ].join(","),
            fontSize: 16,
            h1: {
                fontFamily: [
                    "-apple-system",
                    "BlinkMacSystemFont",
                    "Segoe UI",
                    "Roboto",
                    "Helvetica",
                    "Arial",
                    "sans-serif",
                    "Apple Color Emoji",
                    "Segoe UI Emoji",
                    "Segoe UI Symbol"
                ].join(","),
                fontSize: 48,
                fontWeight: 'bold'
            },
            h2: {
                fontFamily: [
                    "-apple-system",
                    "BlinkMacSystemFont",
                    "Segoe UI",
                    "Roboto",
                    "Helvetica",
                    "Arial",
                    "sans-serif",
                    "Apple Color Emoji",
                    "Segoe UI Emoji",
                    "Segoe UI Symbol"
                ].join(","),
                fontSize: 40,
                fontWeight: 'bold'
            },
            h3: {
                fontFamily: [
                    "-apple-system",
                    "BlinkMacSystemFont",
                    "Segoe UI",
                    "Roboto",
                    "Helvetica",
                    "Arial",
                    "sans-serif",
                    "Apple Color Emoji",
                    "Segoe UI Emoji",
                    "Segoe UI Symbol"
                ].join(","),
                fontSize: 32,
                fontWeight: 'bold'
            },
            h4: {
                fontFamily: [
                    "-apple-system",
                    "BlinkMacSystemFont",
                    "Segoe UI",
                    "Roboto",
                    "Helvetica",
                    "Arial",
                    "sans-serif",
                    "Apple Color Emoji",
                    "Segoe UI Emoji",
                    "Segoe UI Symbol"
                ].join(","),
                fontSize: 24,
                fontWeight: 'bold'
            },
            h5: {
                fontFamily: [
                    "-apple-system",
                    "BlinkMacSystemFont",
                    "Segoe UI",
                    "Roboto",
                    "Helvetica",
                    "Arial",
                    "sans-serif",
                    "Apple Color Emoji",
                    "Segoe UI Emoji",
                    "Segoe UI Symbol"
                ].join(","),
                fontSize: 20,
                fontWeight: 'bold'
            },
            h6: {
                fontFamily: [
                    "-apple-system",
                    "BlinkMacSystemFont",
                    "Segoe UI",
                    "Roboto",
                    "Helvetica",
                    "Arial",
                    "sans-serif",
                    "Apple Color Emoji",
                    "Segoe UI Emoji",
                    "Segoe UI Symbol"
                ].join(","),
                fontSize: 18,
                fontWeight: 'bold'
            },
        },

        components: {
            MuiDataGrid: {
                defaultProps: {
                    rowSelection: false,
                },
                slots: {
                    pagination: MyCustomFooter, // Your custom footer component
                },
                styleOverrides: {
                    root: {
                        backgroundColor: '#505058',
                        borderRadius: 28,
                        boxShadow: 'none',
                        border: 'none'
                    },
                    main: {
                        borderTopLeftRadius: 28,
                        borderTopRightRadius: 28,
                        backgroundColor: '#303038'
                    },
                    row: {
                        cursor: 'pointer',
                        borderBottom: '1px solid white',
                        ":active": {
                            backgroundColor: '#39393f'
                        }
                    },
                    columnHeader: {
                        backgroundColor: '#505058',
                        borderBottom: '3px solid white',
                    },
                    footerContainer: {
                        borderColor: 'white !important',
                        borderTop: '1px solid white',
                    },
                    cell: {
                        borderBottom: '1px solid white',
                        ":focus": {
                            outline: 'none'
                        },
                        maxWidth: '100%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    }
                }
            },
            MuiTable: {
                styleOverrides: {
                    root: {
                    }
                }
            },
            MuiTableRow: {
                styleOverrides: {
                    root: {
                    }
                }
            },
            MuiTableCell: {
                styleOverrides: {
                    root: {
                        borderBottom: '1px solid grey'
                    }
                }
            },
            MuiPaper: {
                styleOverrides: {
                    root: {
                        borderRadius: 28,
                        boxShadow: 'none'
                    }
                }
            },
            MuiButton: {
                styleOverrides: {
                    root: {
                        boxShadow: 'none',
                        ":hover": {
                            boxShadow: 'none',
                        },
                        textTransform: 'none',
                        height: 40,
                        borderRadius: 20,
                        paddingLeft: 24,
                        paddingRight: 24
                    },
                    sizeSmall: {
                        height: 40,
                        fontSize: '1rem',
                        padding: '6px 12px',
                    },
                    // Override styles for the "medium" size button (default size)
                    sizeMedium: {
                        height: 48,
                        fontSize: '1rem',
                        padding: '8px 16px',
                    },
                    // Override styles for the "large" size button
                    sizeLarge: {
                        height: 56,
                        fontSize: '1rem',
                        padding: '10px 20px',
                    },
                }
            },
            MuiInput: {
                styleOverrides: {
                    root: {
                        height: 56,
                        paddingTop: 8,
                        paddingBottom: 8,
                        paddingLeft: 16,
                        paddingRight: 16,
                    }
                }
            }
        },
    };
};

// context for color mode
export const ColorModeContext = createContext({
    toggleColorMode: () => {
    },
});

export const useMode = () => {
    const getInitialTheme = (): "dark" | "light" => {
        // Check if user preference is stored in localStorage
        const storedTheme = localStorage.getItem('theme') as "dark" | "light";
        if (storedTheme) {
            return storedTheme;
        }

        // If no stored preference, check the system preference
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return prefersDarkMode ? 'dark' : 'light';
    };

    const [mode, setMode] = useState<"dark" | "light">(getInitialTheme());


    // Update localStorage when theme changes
    useEffect(() => {
        localStorage.setItem('theme', mode);
    }, [mode]);


    const colorMode = useMemo(
        () => ({
            toggleColorMode: () =>
                setMode((prev) => (prev === "light" ? "dark" : "light")),
        }),
        []
    );

    const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
    return [theme, colorMode];
};