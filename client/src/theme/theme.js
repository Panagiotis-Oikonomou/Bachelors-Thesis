import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        mode: "dark",
        divider: "rgba(255,255,255,0.4)",
        primary: {
            main: "#1b2632",
        },
        background: {
            default: "#1b2632",
            paper: "#1b2632",
        }
    },
    components: {
        MuiTextField: {
            defaultProps: {
                variant: "outlined",
            },
            styleOverrides: {
                root: {
                    fontSize: "1.2rem"
                }
            }
        },

        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "white",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#90caf9 !important",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#90caf9",
                    },
                },
            },
        },

        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: "white",
                    fontSize: "1rem",

                    "&.Mui-focused": {
                        color: "#90caf9",
                    },

                    ".MuiFormControl-root:hover &": {
                        color: "#90caf9"
                    },
                },
            },
        },

        MuiCheckbox: {
            styleOverrides: {
                root: {
                    color: "white",

                    "&.Mui-checked": {
                        color: "#90caf9",
                    },
                },
            },
        },

        MuiFormControlLabel: {
            styleOverrides: {
                label: {
                    color: "white",
                },
            },
        },

        MuiFormHelperText: {
            styleOverrides: {
                root: {
                    fontSize: "0.9rem",
                },
            },
        },

        MuiSelect: {
            styleOverrides: {
                select: {
                    color: "white",
                },
                icon: {
                    color: "white",
                },
            },
        },

        MuiInputBase: {
            styleOverrides: {
                root: {
                    fontSize: "1.1rem",
                },
            },
        },

        MuiAppBar: {
            styleOverrides: {
                root: ({ theme }) => ({
                    backgroundColor: theme.palette.background.default,
                }),
            },
        },

        MuiDrawer: {
            styleOverrides: {
                paper: ({ theme }) => ({
                    backgroundColor: theme.palette.background.paper,
                }),
            },
        },
    }
});

export default theme;