"use client";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Stack,
  Typography,
} from "@mui/material";
import Link from "next/link";
import React, { useState } from "react";
import CustomSnackbar from "../components/CustomSnackbar";
import { login } from "@/lib/auth-actions";
import CustomTextField from "../components/CustomTextField";

interface AuthFormProp {
  formOption: "login" | "signup";
}

const AuthForm: React.FC<AuthFormProp> = ({ formOption }) => {
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "info" | "warning">("info");

  const handleSubmit = async (formData: FormData) => {
    const response = await login(formData);
    switch (response) {
      case "invalid_credentials":
        setSnackbarOpen(true);
        setSnackbarSeverity("error");
        setSnackbarMessage("Email atau password anda salah!");
        break;
      case "user_not_found":
        setSnackbarOpen(true);
        setSnackbarSeverity("error");
        setSnackbarMessage(
          "Pengguna tidak ditemukan. Silakan periksa kembali email Anda."
        );
        break;
      case "email_not_confirmed":
        setSnackbarOpen(true);
        setSnackbarSeverity("warning");
        setSnackbarMessage(
          "Email Anda belum terkonfirmasi. Silakan periksa inbox Anda."
        );
        break;
      case "login_disabled":
        setSnackbarOpen(true);
        setSnackbarSeverity("error");
        setSnackbarMessage("Login saat ini tidak diizinkan.");
        break;
      case "too_many_requests":
        setSnackbarOpen(true);
        setSnackbarSeverity("warning");
        setSnackbarMessage(
          "Terlalu banyak permintaan. Silakan coba lagi nanti."
        );
        break;
      default:
        setSnackbarOpen(true);
        setSnackbarSeverity("error");
        setSnackbarMessage(
          "Terjadi kesalahan yang tidak terduga. Silakan coba lagi."
        );
    }
  };

  if (formOption !== "login") {
    return null; // or return some other component for signup
  }

  return (
    <>
      <form action="">
        <Stack>
          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              component="label"
              htmlFor="email"
              mb="5px"
            >
              Email
            </Typography>
            <CustomTextField
              variant="outlined"
              fullWidth
              name="email"
              id="email"
              type="email"
              required
            />
          </Box>
          <Box mt="25px">
            <Typography
              variant="subtitle1"
              fontWeight={600}
              component="label"
              htmlFor="password"
              mb="5px"
            >
              Password
            </Typography>
            <CustomTextField
              type="password"
              variant="outlined"
              fullWidth
              name="password"
              id="password"
              required
            />
          </Box>
          <Stack
            justifyContent="space-between"
            direction="row"
            alignItems="center"
            my={2}
          >
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                }
                label="Ingatkan Perangkat Ini"
              />
            </FormGroup>
            <Typography
              component={Link}
              href="#"
              fontWeight="500"
              sx={{
                textDecoration: "none",
                color: "primary.main",
              }}
            >
              Lupa Password?
            </Typography>
          </Stack>
        </Stack>
        <Box>
          <Button
            color="primary"
            variant="contained"
            size="large"
            fullWidth
            formAction={(form) => handleSubmit(form)}
            type="submit"
          >
            Masuk
          </Button>
        </Box>
      </form>
      <CustomSnackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </>
  );
};

export default AuthForm;