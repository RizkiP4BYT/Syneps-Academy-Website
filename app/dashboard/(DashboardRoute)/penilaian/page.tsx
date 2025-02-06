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
      <h1>Program</h1>
      <p>Disini kamu bisa melihat Nilai siswa di Syneps Academy.</p>

      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>No.</TableCell>
              <TableCell>Nama Siswa</TableCell>
              <TableCell>Silabus</TableCell>
              <TableCell>Nilai</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>1</TableCell>
              <TableCell>rizki</TableCell>
              <TableCell>UI Design</TableCell>
              <TableCell>100%</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
