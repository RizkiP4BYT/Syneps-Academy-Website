"use client";
import {
  Box,
  Container,
  styled,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Header from "./layout/Header";
import { Sidebar } from "react-pro-sidebar";
import SidebarMenu from "./layout/SidebarMenu";

const MainWrapper = styled("div")(() => ({
  display: "flex",
  minHeight: "100vh",
  width: "100%",
}));

const PageWrapper = styled("div")(() => ({
  display: "flex",
  flexGrow: 1,
  paddingBottom: "60px",
  flexDirection: "column",
  zIndex: 1,
  backgroundColor: "transparent",
}));

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <MainWrapper>
      {mounted && (
        <Sidebar
          toggled={sidebarOpen}
          onBackdropClick={() => setSidebarOpen(false)}
          breakPoint="lg"
          backgroundColor="#e3e3e3"
        >
          <SidebarMenu />
        </Sidebar>
      )}
      <PageWrapper>
        <Header toggleMobileSidebar={() => setSidebarOpen(true)} />

        <Container sx={{ paddingTop: "20px", maxWidth: "1200px" }}>
          <Box sx={{ minHeight: "calc(100vh - 170px)" }}>{children}</Box>
        </Container>
      </PageWrapper>
    </MainWrapper>
  );
}
