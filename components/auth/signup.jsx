import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  Dialog as MuiDialog,
  Grid,
  IconButton,
  InputAdornment,
  LinearProgress,
  TextField,
} from "@mui/material";
import { useRef, useState } from "react";
import axios from "axios";
import validateEmail from "utils/validateEmail";
import Image from "next/image";
import validatePassword from "utils/validatePassword";
import Dialog, { useDialog } from "components/dialog";

export default function Signup({ open, onClose }) {
  const timeoutRef = useRef();
  const { dialog, handleOpenDialog, handleCloseDialog } = useDialog();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    retypePassword: "",
  });

  const [errors, setErrors] = useState({});

  const [visible, setVisible] = useState({
    password: false,
    retypePassword: false,
  });

  const [loading, setLoading] = useState(false);

  function handleSetForm(field) {
    return function (e) {
      setForm((v) => ({ ...v, [field]: e.target.value }));
      if (errors[field]) setErrors((v) => ({ ...v, [field]: undefined }));
    };
  }

  function toggleVisible(field) {
    return function () {
      setVisible((v) => ({ ...v, [field]: !v[field] }));
    };
  }

  function validateForm() {
    let errors = {};
    if (!form.name) errors.name = "Name required";
    if (!form.email) errors.email = "Email required";
    else if (!validateEmail(form.email)) errors.email = "Invalid email address";
    if (!form.password) errors.password = "Password required";
    else if (!validatePassword(form.password))
      errors.password =
        "Password must contain at least 1 lowercase, 1 uppercase, 1 numeric character, 1 special character, and minimum of 8 characters long";
    if (!form.retypePassword)
      errors.retypePassword = "Retype password required";
    else if (form.password !== form.retypePassword)
      errors.retypePassword = "Password doesn't match";

    setErrors(errors);
    return errors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const hasError = Object.keys(validateForm()).length;
    if (hasError) return;
    setLoading(true);

    try {
      const res = await axios.post("/api/auth/signup", {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      if (!res?.data?.message) throw res;
      handleOpenDialog(
        "<strong>Signed up!</strong><p>Check your inbox to verify your email</p>",
        "success"
      );
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        handleCloseDialog();
        onClose();
      }, 3000);
    } catch (err) {
      // console.error(err?.response?.data || err?.error || err);
      handleOpenDialog(err?.response?.data || err?.error || err, "error");
    }
    setLoading(false);
  }

  return (
    <>
      <MuiDialog
        fullWidth
        maxWidth="md"
        open={open}
        onClose={onClose}
        scroll="body"
      >
        <Card
          variant="outlined"
          sx={{ backgroundColor: "#aaa", width: "100%" }}
        >
          {loading && <LinearProgress />}
          <Grid container>
            <Grid item xs={12} lg={6} sx={{ display: "flex" }}>
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  height: { xs: "150px", lg: "100%" },
                  pointerEvents: "none",
                }}
              >
                <Image src="/signup.webp" alt="Signup" fill objectFit="cover" />
              </Box>
            </Grid>
            <Grid item xs={12} lg={6}>
              <Box sx={{ p: 2 }}>
                <form onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    required
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={handleSetForm("name")}
                    error={Boolean(errors.name)}
                    helperText={errors.name}
                    margin="normal"
                    InputProps={{
                      sx: { backgroundColor: "#FFF" },
                    }}
                  />

                  <TextField
                    fullWidth
                    required
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={form.email}
                    onChange={handleSetForm("email")}
                    error={Boolean(errors.email)}
                    helperText={errors.email}
                    margin="normal"
                    InputProps={{
                      sx: { backgroundColor: "#FFF" },
                    }}
                  />

                  <TextField
                    fullWidth
                    required
                    type={visible.password ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleSetForm("password")}
                    error={Boolean(errors.password)}
                    helperText={errors.password}
                    margin="normal"
                    InputProps={{
                      sx: { backgroundColor: "#FFF" },
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={toggleVisible("password")}
                            // onMouseDown={handleMouseDownPassword}
                          >
                            {visible.password ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    required
                    type={visible.retypePassword ? "text" : "password"}
                    name="retypePassword"
                    placeholder="Retype Password"
                    value={form.retypePassword}
                    onChange={handleSetForm("retypePassword")}
                    error={Boolean(errors.retypePassword)}
                    helperText={errors.retypePassword}
                    margin="normal"
                    InputProps={{
                      sx: { backgroundColor: "#FFF" },
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={toggleVisible("retypePassword")}
                            // onMouseDown={handleMouseDownPassword}
                          >
                            {visible.retypePassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Button
                    type="submit"
                    onClick={handleSubmit}
                    fullWidth
                    variant="contained"
                    disabled={loading}
                    sx={{ p: 2, my: 2 }}
                  >
                    Create Account
                  </Button>
                </form>
              </Box>
            </Grid>
          </Grid>
        </Card>
      </MuiDialog>

      <Dialog dialog={dialog} onClose={handleCloseDialog} />
    </>
  );
}
