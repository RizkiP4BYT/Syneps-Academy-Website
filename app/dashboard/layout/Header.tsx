"use client";
import {
  AppBar,
  Box,
  IconButton,
  Stack,
  styled,
  Toolbar,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Profile from "./Profile";

const AppBarStyled = styled(AppBar)(({ theme }) => ({
  boxShadow: "none",
  background: theme.palette.background.paper,
  justifyContent: "center",
  backdropFilter: "blur(4px)",
  [theme.breakpoints.up("lg")]: {
    minHeight: "70px",
  },
  position: "sticky",
}));

const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
  width: "100%",
  color: theme.palette.text.secondary,
}));

interface ItemType {
  toggleMobileSidebar: (event: React.MouseEvent<HTMLElement>) => void;
}

const Header = ({ toggleMobileSidebar }: ItemType) => {
  return (
    <AppBarStyled>
      <ToolbarStyled>
        <IconButton
          size="large"
          onClick={toggleMobileSidebar}
          sx={{ display: { lg: "none", xs: "flex" } }}
        >
          <MenuIcon />
        </IconButton>
        <Box flexGrow={1} />
        <Profile />
      </ToolbarStyled>
    </AppBarStyled>
  );
};

export default Header;
