import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

export default function programPage() {
  return (
    <Box>
      <h1>Silabus</h1>
      <p>
        Disini kamu bisa melihat semua Silabus yang terdaftar di Syneps Academy.
      </p>

      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>No.</TableCell>
              <TableCell>Nama Materi</TableCell>
              <TableCell>Keterangan</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>1</TableCell>
              <TableCell>UI Design</TableCell>
              <TableCell>Ui design aseli noroot</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
