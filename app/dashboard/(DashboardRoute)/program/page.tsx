"use client";

import CustomSnackbar from "@/app/components/CustomSnackbar";
import CustomTextField from "@/app/components/CustomTextField";
import { createClient } from "@/utils/supabase/client";
import { Delete, Edit, Add } from "@mui/icons-material";
import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { FormEvent, useEffect, useState } from "react";

interface Program {
  id: number;
  nama_program: string;
  deskripsi_program: string;
}

export default function ProgramPage() {
  const queryClient = useQueryClient();

  const {
    data: Program = [],
    isLoading,
    isError,
  } = useQuery<Program[]>({
    queryKey: ["Program"],

    queryFn: async () => {
      const res = await fetch("/api/program");

      if (!res.ok) throw new Error("Gagal memuat data");

      return res.json();
    },
  });

  const mutation = useMutation({
    mutationFn: async (program: Partial<Program>) => {
      const method = program.id ? "PUT" : "POST";
      const res = await fetch("/api/program", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(program),
      });
      if (!res.ok) throw new Error(await res.json().then((data) => data.error));
      return res.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Program"] });
      setSnackbarOpen(true);
      setSnackbarSeverity("success");
      setSnackbarMessage("Program berhasil disimpan");
      handleClose();
    },

    onError: (error) => {
      setSnackbarOpen(true);
      setSnackbarSeverity("error");
      setSnackbarMessage(error.message || "Gagal menyimpan program");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch("/api/program", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error(await res.json().then((data) => data.error));
      return res.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Program"] });
      setSnackbarOpen(true);
      setSnackbarSeverity("success");
      setSnackbarMessage("Program berhasil dihapus");
    },

    onError: (error) => {
      setSnackbarOpen(true);
      setSnackbarSeverity("error");
      setSnackbarMessage(error.message || "Gagal menghapus program");
    },
  });

  const modalBoxStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
  };

  const [modalType, setModalType] = useState<"create" | "edit">("create");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [namaProgram, setNamaProgram] = useState("");
  const [deskripsiProgram, setDeskripsiProgram] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("info");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      id: selectedProgram?.id,
      nama_program: namaProgram,
      deskripsi_program: deskripsiProgram,
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus program ini?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleClose = () => {
    setModalOpen(false);
    setSelectedProgram(null);
    setNamaProgram("");
    setDeskripsiProgram("");
  };

  useEffect(() => {
    if (selectedProgram) {
      setNamaProgram(selectedProgram.nama_program);
      setDeskripsiProgram(selectedProgram.deskripsi_program);
    }
  }, [selectedProgram]);

  if (isLoading) return <div>Memuat...</div>;
  if (isError) return <div>Terjadi kesalahan saat memuat data</div>;

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box>
          <Typography variant="h4">Program</Typography>

          <Typography variant="body1">
            Manajemen program Syneps Academy
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setModalType("create");

            setModalOpen(true);
          }}
        >
          Tambah Program
        </Button>
      </Box>

      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>No.</TableCell>

              <TableCell>Nama Program</TableCell>

              <TableCell>Deskripsi</TableCell>

              <TableCell>Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Program.map((program, index) => (
              <TableRow key={program.id}>
                <TableCell>{index + 1}</TableCell>

                <TableCell>{program.nama_program}</TableCell>

                <TableCell>{program.deskripsi_program}</TableCell>

                <TableCell>
                  <ButtonGroup variant="contained">
                    <Button
                      color="info"
                      onClick={() => {
                        setSelectedProgram(program);

                        setModalType("edit");

                        setModalOpen(true);
                      }}
                    >
                      <Edit />
                    </Button>
                    <Button
                      color="error"
                      onClick={() => handleDelete(program.id)}
                    >
                      <Delete />
                    </Button>
                  </ButtonGroup>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={modalOpen} onClose={handleClose}>
        <Box sx={modalBoxStyle} component="form" onSubmit={handleSubmit}>
          <Typography variant="h5" mb={3}>
            {modalType === "edit" ? "Edit Program" : "Buat Program Baru"}
          </Typography>

          <CustomTextField
            label="Nama Program"
            value={namaProgram}
            onChange={(e) => setNamaProgram(e.target.value)}
            fullWidth
            required
            sx={{ mb: 3 }}
          />

          <CustomTextField
            label="Deskripsi Program"
            value={deskripsiProgram}
            onChange={(e) => setDeskripsiProgram(e.target.value)}
            fullWidth
            multiline
            rows={4}
            required
            sx={{ mb: 3 }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Menyimpan..." : "Simpan"}
          </Button>
        </Box>
      </Modal>

      <CustomSnackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </Box>
  );
}
