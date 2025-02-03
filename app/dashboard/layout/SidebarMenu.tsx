import { Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import Image from "next/image";
import Link from "next/link";

const SidebarMenu = () => {
  return (
    <Menu>
      <Image
        src="/assets/images/syn-logo-dark.svg"
        alt="Syneps Academy Logo"
        width={150}
        height={150}
        style={{ marginLeft: "1rem", marginRight: "auto" }}
      />
      <MenuItem component={<Link href={"/dashboard/user"} />}>User</MenuItem>
      <MenuItem>Program</MenuItem>
      <MenuItem>Silabus</MenuItem>
      <MenuItem>Penilaian</MenuItem>
      <MenuItem>Metode Pembelajaran</MenuItem>
      <MenuItem>Kelas</MenuItem>
      <MenuItem>Metode Pembayaran</MenuItem>
      <MenuItem>Referral</MenuItem>
      <MenuItem>Motivasi</MenuItem>
      <MenuItem>Mengetahui Program Ini</MenuItem>
    </Menu>
  );
};

export default SidebarMenu;
