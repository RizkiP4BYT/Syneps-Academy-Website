"use client";
import CustomTextField from "@/app/components/CustomTextField";
import { Delete, Edit } from "@mui/icons-material";
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
import React, { useState } from "react";

export default function programPage() {
  let programData = [
    {
      id: 1,
      nama_program: "Bootcamp",
      deskripsi_program:
        "Program pelatihan intensif yang dirancang untuk mengajarkan keterampilan penting dalam pengembangan perangkat lunak, data science, dan bidang-bidang lain yang sedang populer dalam waktu singkat.",
      created_at: "2016-01-25 10:10:10.555555-05:00",
    },
    {
      id: 2,
      nama_program: "Workshop",
      deskripsi_program:
        "Acara edukasi praktis di mana peserta terlibat dalam kegiatan praktikal dan mendapatkan panduan mengenai topik tertentu, mulai dari pemrograman hingga manajemen proyek.",
      created_at: "2017-03-15 14:20:15.333333-05:00",
    },
    {
      id: 3,
      nama_program: "Seminar",
      deskripsi_program:
        "Acara berbasis ceramah yang fokus pada area tertentu, menampilkan pembicara ahli yang mempresentasikan tren terbaru, inovasi, dan penelitian.",
      created_at: "2018-05-10 09:30:25.444444-05:00",
    },
    {
      id: 4,
      nama_program: "Sertifikasi",
      deskripsi_program:
        "Proses pemberian sertifikat resmi yang mengonfirmasi keahlian dan keterampilan individu dalam bidang atau teknologi tertentu, seringkali diperlukan untuk pengembangan karir.",
      created_at: "2019-07-18 16:45:35.123456-05:00",
    },
    {
      id: 5,
      nama_program: "Hackathon",
      deskripsi_program:
        "Acara kompetitif di mana tim peserta bekerja sama untuk membangun solusi atau proyek inovatif dalam waktu terbatas, seringkali berfokus pada tantangan teknologi atau pemrograman.",
      created_at: "2020-09-22 11:55:45.654321-05:00",
    },
    {
      id: 6,
      nama_program: "Konferensi",
      deskripsi_program:
        "Kumpulan besar profesional, ahli, dan penggemar untuk membahas dan berbagi tren terbaru, penelitian, dan inovasi dalam industri atau bidang studi tertentu.",
      created_at: "2021-11-30 08:05:50.777777-05:00",
    },
    {
      id: 7,
      nama_program: "Mentorship",
      deskripsi_program:
        "Program yang dirancang untuk menghubungkan para profesional berpengalaman dengan mentee yang membutuhkan bimbingan, dukungan, dan nasihat karir untuk meningkatkan perkembangan pribadi dan profesional mereka.",
      created_at: "2022-01-10 12:15:55.888888-05:00",
    },
  ];

  const modalBoxStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  };

  const [modalType, setModalType] = useState<"create" | "edit">();
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const handleSubmit = async (formData: FormData) => {
    console.log(formData);
  };
  return (
    <Box>
      <h1>Program</h1>
      <p>
        Disini kamu bisa manajemen Program-program yang terdaftar di Syneps
        Academy.
      </p>

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
            {programData.map((program, index) => (
              <TableRow key={index + 1}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{program.nama_program}</TableCell>
                <TableCell>{program.deskripsi_program}</TableCell>
                <TableCell>
                  <ButtonGroup
                    variant="contained"
                    sx={{ p: "2" }}
                    aria-label="Action Button"
                  >
                    <Button
                      color="info"
                      onClick={() => {
                        setModalOpen(true);
                        setModalType("edit");
                      }}
                    >
                      <Edit />
                    </Button>
                    <Button color="error">
                      <Delete />
                    </Button>
                  </ButtonGroup>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal open={modalOpen}>
        {modalType == "edit" ? (
          <form
            action=""
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <Box sx={modalBoxStyle}>
              <Typography variant="h4">Edit Program</Typography>
              <Box mt="20px">
                <Typography variant="subtitle1" fontWeight={600} mb="5px">
                  Nama Program
                </Typography>
                <CustomTextField
                  variant="outlined"
                  fullWidth
                  name="Nama Program"
                  id="nama_program"
                  type="text"
                />
              </Box>
              <Box>
                <Typography variant="subtitle1" fontWeight={600} mb="5px">
                  Deskripsi Program
                </Typography>
                <CustomTextField
                  variant="outlined"
                  fullWidth
                  name="Deskripsi Program"
                  id="deskripsi_program"
                  type="text"
                />
              </Box>
              <Box mt="5px">
                <Button
                  color="primary"
                  variant="contained"
                  size="large"
                  fullWidth
                  formAction={(form) => handleSubmit(form)}
                  type="submit"
                >
                  Simpan
                </Button>
              </Box>
            </Box>
          </form>
        ) : modalType == "create" ? (
          <Box sx={modalBoxStyle}>
            <Typography>Buat Program</Typography>
            <Box>
              <Typography variant="subtitle1" fontWeight={600} mb="5px">
                Nama Program
              </Typography>
              <CustomTextField
                variant="outlined"
                fullWidth
                name="Nama Program"
                id="nama_program"
                type="text"
              />
            </Box>
            <Box mt="25px"></Box>
          </Box>
        ) : (
          <p>Null</p>
        )}
      </Modal>
    </Box>
  );
}
