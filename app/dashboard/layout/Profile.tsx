"use client";
import React, { useEffect, useState } from "react";
import { Box, Menu, MenuItem, Switch, Typography, styled } from "@mui/material";
import Image from "next/image";
// import Link from 'next/link'
// import { Avatar, Box, Menu, Button, IconButton, MenuItem, ListItemIcon, ListItemText, Typography, styled } from '@mui/material'
// // import fetchUser from '@/lib/fetchUser'
// import { createClient } from '@/utils/supabase/server'
// import ProfileMenu from '../../components/shared/ProfileMenu'
// import ProfileImage from '../../components/shared/ProfileImage'
// import fetchUser from '@/lib/fetchUser'
// import { User } from '@supabase/supabase-js'

// interface fetchUserType = {
//     data: {
//         user: User
//     }
// }
// const Data = ({ dataPromise ) => {
//     const { data } = use(dataPromise)
//     if (data.user) {
//         console.log('ini profile')

//         return (
//             <ProfileMenu>
//                 <ProfileImage media={data.user!.user_metadata.image ?? '/images/profile/user.png'} />
//                 <Typography variant="body1">{data.user!.email}</Typography>
//             </ProfileMenu>
//         )
//     } else {
//         return (
//             <Button variant="contained" component={Link} href="/auth/login" disableElevation color="primary">
//                 Login
//             </Button>
//         )
//     }
// }

// const Profile = async () => {
//     return (
//         <>
//             <Suspense fallback={<div>Loading cuy...</div>}>
//                 <Data dataPromise={await fetchUser()}/>
//             </Suspense>
//         </>
//     )
// }

// export default Profile
const ProfileButtonContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  border: "1px solid #ccc",
  borderRadius: "50px",
  padding: "5px 10px",
  cursor: "pointer",
});

const ProfileMenu = ({ children }: { children: React.ReactNode }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <div>
      <ProfileButtonContainer onClick={handleClick}>
        {children}
      </ProfileButtonContainer>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleClose}>Settings</MenuItem>
        <MenuItem>
          <Typography variant="body1">Dark Mode</Typography>
          <Switch checked={darkMode} onChange={toggleDarkMode} />
        </MenuItem>
        <MenuItem onClick={handleClose}>Keluar</MenuItem>
      </Menu>
    </div>
  );
};

const Profile = () => {
  return (
    <ProfileMenu>
      <Image
        src="https://docs.gravatar.com/wp-content/uploads/2024/09/cropped-72x72-1.png?w=240"
        alt="User Profile"
        width={40}
        height={40}
      />
      Ahmad Cihuy
    </ProfileMenu>
  );
};

export default Profile;
