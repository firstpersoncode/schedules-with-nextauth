import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  Container,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  LinearProgress,
  TextField,
} from "@mui/material";
import Dialog, { useDialog } from "components/dialog";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import validateEmail from "utils/validateEmail";
import Signup from "./signup";

export default function Signin() {
  const { push } = useRouter();
  const timeoutRef = useRef();
  const { dialog, handleOpenDialog, handleCloseDialog } = useDialog();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const [visible, setVisible] = useState({
    password: false,
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
    if (!form.email) errors.email = "Email required";
    else if (!validateEmail(form.email)) errors.email = "Invalid email address";
    if (!form.password) errors.password = "Password required";

    setErrors(errors);
    return errors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const hasError = Object.keys(validateForm()).length;
    if (hasError) return;
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });
      if (!res.ok) throw res;
      handleOpenDialog(
        "<strong>Signed in!</strong><p>You'll be redirected to your project.</p><a href='/project'>Or click this if nothing happen.</a>",
        "success"
      );
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        push("/project");
      }, 3000);
    } catch (err) {
      // console.error(err?.response?.data || err?.error || err);
      handleOpenDialog(err?.response?.data || err?.error || err, "error");
    }
    setLoading(false);
  }

  function handleGoogleLogin() {
    setLoading(true);
    try {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        signIn("google", { callbackUrl: `${process.env.URL}/agenda` });
      }, 1000);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  const [openSignUpDialog, setOpenSignUpDialog] = useState(false);
  function handleOpenSignUpDialog() {
    setOpenSignUpDialog(true);
  }
  function handleCloseSignUpDialog() {
    setOpenSignUpDialog(false);
  }

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: { xs: "block", lg: "flex" },
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          overflowY: "auto",
          width: "100%",
          height: "100vh",
        }}
      >
        <h1>Sign in</h1>
        <Card
          variant="outlined"
          sx={{ backgroundColor: "#ddd", mt: 2, width: "100%" }}
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
                <Image src="/signin.webp" alt="Signin" fill objectFit="cover" />
              </Box>
            </Grid>
            <Grid item xs={12} lg={6}>
              <Box sx={{ p: 2 }}>
                <form onSubmit={handleSubmit}>
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

                  <Button
                    type="submit"
                    onClick={handleSubmit}
                    fullWidth
                    variant="contained"
                    disabled={loading}
                    sx={{ p: 2, my: 2 }}
                  >
                    Sign in
                  </Button>
                </form>
                <Box sx={{ textAlign: "right" }}>
                  <Button onClick={handleOpenSignUpDialog}>
                    Create account
                  </Button>
                </Box>
                <Divider sx={{ my: 2 }}>or</Divider>
                <Button
                  fullWidth
                  onClick={handleGoogleLogin}
                  variant="contained"
                  disabled={loading}
                  sx={{
                    p: 2,
                    my: 2,
                    backgroundColor: "#FFF",
                    color: "black",
                    "&:hover": {
                      color: "white",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      textTransform: "none",
                    }}
                  >
                    <Image
                      src="/google.png"
                      alt="Google"
                      width={30}
                      height={30}
                    />
                    <span>Sign in with Google</span>
                  </Box>
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Card>
      </Box>

      <Dialog dialog={dialog} onClose={handleCloseDialog} />
      <Signup open={openSignUpDialog} onClose={handleCloseSignUpDialog} />
    </Container>
  );
}
