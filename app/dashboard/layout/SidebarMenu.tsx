import { Menu, MenuItem } from "react-pro-sidebar";
import Image from "next/image";
import Link from "next/link";
import { Person as UserIcon, Book as ProgramIcon, Class as KelasIcon, List as SilabusIcon, Grade as PenilaianIcon, Share as ReferralIcon, ManageHistory as BatchIcon } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { JSX } from "react";

const SidebarMenu = () => {
    const theme = useTheme(); // Mengakses tema dari MUI

    type Page = {
        name: string;
        link: string;
        icon: JSX.Element;
    };

    type PagesListProp = Page[];
    const pagesList: PagesListProp = [
        {
            name: "User",
            link: "/dashboard/user",
            icon: <UserIcon />,
        },
        {
            name: "Program",
            link: "/dashboard/program",
            icon: <ProgramIcon />,
        },
        {
            name: "Batch",
            link: "/dashboard/batch",
            icon: <BatchIcon />,
        },
        {
            name: "Kelas",
            link: "/dashboard/kelas",
            icon: <KelasIcon />,
        },
        {
            name: "Silabus",
            link: "/dashboard/silabus",
            icon: <SilabusIcon />,
        },
        {
            name: "Penilaian",
            link: "/dashboard/penilaian",
            icon: <PenilaianIcon />,
        },
        {
            name: "Referral",
            link: "/dashboard/referral",
            icon: <ReferralIcon />,
        },
    ];

    return (
        <Menu
            rootStyles={{
                height: "100vh",
                backgroundColor: theme.palette.background.paper, // Menggunakan warna background dari tema
                color: theme.palette.text.primary, // Menggunakan warna teks dari tema
                paddingTop: "1rem",
            }}
        >
            <Link href="/dashboard">
                <div style={{ display: "flex", justifyContent: "center", padding: "1rem 0" }}>
                    <Image src="/assets/images/syn-logo-dark.svg" alt="Syneps Academy Logo" width={150} height={150} />
                </div>
            </Link>

            {pagesList.map((page, index) => (
                <MenuItem
                    component={<Link href={page.link} />}
                    key={index}
                    icon={page.icon}
                    rootStyles={{
                        padding: "0.75rem 1.5rem",
                        margin: "0.25rem 0",
                        borderRadius: "4px",
                        transition: "background-color 0.3s",
                        "&:hover": {
                            backgroundColor: theme.palette.action.hover, // Menggunakan warna hover dari tema
                        },
                    }}
                >
                    {page.name}
                </MenuItem>
            ))}
        </Menu>
    );
};

export default SidebarMenu;

