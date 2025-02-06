import { Delete, Edit } from "@mui/icons-material";
import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

export default function programPage() {
  const buttons = [
    <Button key="edit" color="info">
      <Edit />
    </Button>,
    <Button key="delete" color="error">
      <Delete />
    </Button>,
  ];
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
              <TableCell>Keterangan</TableCell>
              <TableCell>Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>1</TableCell>
              <TableCell>Bootcamp</TableCell>
              <TableCell>Program bootcamp aseli noroot</TableCell>
              <TableCell>
                <ButtonGroup
                  variant="contained"
                  sx={{ p: "2" }}
                  aria-label="Action Button"
                >
                  {buttons}
                </ButtonGroup>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
