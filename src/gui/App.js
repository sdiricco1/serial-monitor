import React from "react";
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme, StylesProvider } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import styles from "./App.module.css";
import TextField from "@material-ui/core/TextField";

const mainTheme = createMuiTheme({
  overrides: {
    MuiInput: {
      root: {
      },
    },
    MuiFormHelperText: {
      root: {

      },
      marginDense: {

      },
      contained: {

      },
    },
    MuiButton: {
      root: {

      },
      text: {

      },
      sizeSmall: {

      },

    },
    MuiButtonBase: {
      root: {

      },
    },
    MuiFormLabel: {
      root: {

      },
    },
    MuiOutlinedInput: {
      root: {
        borderRadius: "0px"
      },
      input: {
        
      },
      inputMarginDense: {
        padding: "4px",
        paddingTop: "4px",
        paddingBottom: "4px",
      },
    },
    MuiInputLabel: {
      root: {

      },
      input: {
 
      },
    },
    MuiTypography: {
      root: {

      },
    },
  },
  typography: {
    fontSize: "12px",
  },
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.name = "Serial Monitor";
  }
  render() {
    return (
      <ThemeProvider theme={mainTheme}>
        <div className={styles.mainContainer}>
          <div className={styles.senderContainer}>
            <div className={styles.input}>
              <TextField variant="outlined" fullWidth size="small"></TextField>
            </div>
            <div className={styles.button}>
              <Button variant="outlined" size="small">Send</Button>
            </div>
          </div>
          <div className={styles.viewer}>viewer</div>
          <div className={styles.options}>options</div>
        </div>
      </ThemeProvider>
    );
  }
}

export default App;
