import { createContext, useContext, useState } from "react";
import useController, { initialContext } from "./controller";
import {
  Button,
  Dialog,
  DialogContent,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";

const CommonContext = createContext(initialContext);

export default function CommonContextProvider({ children }) {
  const controlledContext = useController();
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [requestToken, setRequestToken] = useState(false);
  const [requested, setRequested] = useState(false);
  function toggleReqToken() {
    setRequestToken((v) => !v);
  }
  function changeToken(e) {
    setToken(e.target.value);
  }
  function changeEmail(e) {
    setEmail(e.target.value);
  }
  async function submitToken() {
    try {
      const resp = await axios.post("/api/token/validate", { key: token });
      if (!resp?.data?.key) throw new Error("invalid token");
      localStorage.setItem("token", resp.data.key);
      controlledContext.setContext((v) => ({ ...v, token: resp.data.key }));
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  }
  async function submitRequest() {
    try {
      const resp = await axios.post("/api/token/request", { email });
      if (!resp?.data?.email) throw new Error("invalid email");
      setRequestToken(false);
      setRequested(true);
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <>
      <Dialog open={!controlledContext.token}>
        <DialogContent>
          {requestToken ? (
            <>
              <Typography sx={{ mb: 2 }}>
                In order to receive token, you need to provide your email
              </Typography>
              <TextField
                fullWidth
                type="email"
                label="Email"
                value={email}
                onChange={changeEmail}
              />
              <Button
                sx={{ my: 2 }}
                variant="contained"
                fullWidth
                onClick={submitRequest}
              >
                Request token
              </Button>
              <Button onClick={toggleReqToken}>Input token</Button>
            </>
          ) : (
            <>
              <Typography sx={{ mb: 2 }}>
                {requested
                  ? "Your token will be sent to your email"
                  : "In order to use the app, you need to provide your token"}
              </Typography>
              <TextField
                fullWidth
                label="Token"
                value={token}
                onChange={changeToken}
              />
              <Button
                sx={{ my: 2 }}
                variant="contained"
                fullWidth
                onClick={submitToken}
              >
                Submit
              </Button>
              <Button onClick={toggleReqToken}>Request token</Button>
            </>
          )}
        </DialogContent>
      </Dialog>
      <CommonContext.Provider value={controlledContext}>
        {children}
      </CommonContext.Provider>
    </>
  );
}

export const useCommonContext = () => useContext(CommonContext);
