import {
  Box,
  Card,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid2,
  Stack,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import AuthForm from "../AuthForm";

export const metadata: Metadata = {
  title: "Halaman Login - Syneps Academy",
};

export default function Login() {
  return (
    <Box
      sx={{
        position: "relative",
        "&:before": {
          content: '""',
          background: "radial-gradient(#d2f1df, #d3d7fa, #bad8f4)",
          backgroundSize: "400% 400%",
          animation: "gradient 1s ease infinite",
          position: "absolute",
          height: "100%",
          width: "100%",
          opacity: "0.9",
        },
      }}
    >
      <Grid2 container justifyContent={"center"} sx={{ height: "100vh" }}>
        <Grid2
          size={{ xs: 10, sm: 10, lg: 4, xl: 4 }}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Card
            elevation={9}
            sx={{ p: 4, zIndex: 1, width: "100%", maxWidth: "500px" }}
          >
            <Box display="flex" alignItems="center" justifyContent="center">
              <Image
                src="/assets/images/syn-logo-dark.svg"
                alt="Syneps Academy Logo"
                width={150}
                height={150}
              />
            </Box>
            <Typography
              variant="subtitle1"
              textAlign="center"
              color="textSecondary"
              mb={1}
            >
              Login untuk menggunakan Dasbor Admin!
            </Typography>
            <AuthForm formOption="login" />
          </Card>
        </Grid2>
      </Grid2>
    </Box>
  );
}
