'use client'
import React, { Suspense, useEffect, useState } from 'react'
import { Box, Menu, MenuItem, Switch, Typography, styled } from '@mui/material'
import Image from 'next/image'
import fetchUser from '@/lib/fetchUser'
import { User } from '@supabase/supabase-js'
import { signout } from '@/lib/auth-actions'

const ProfileButtonContainer = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #ccc',
    borderRadius: '50px',
    padding: '5px 10px',
    cursor: 'pointer'
})

const ProfileMenu = ({ children }: { children: React.ReactNode }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [darkMode, setDarkMode] = useState<boolean>(false)

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const toggleDarkMode = () => {
        setDarkMode((prev) => !prev)
    }

    return (
        <div>
            <ProfileButtonContainer onClick={handleClick}>{children}</ProfileButtonContainer>

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                <MenuItem onClick={handleClose}>Settings</MenuItem>
                <MenuItem>
                    <Typography variant="body1">Dark Mode</Typography>
                    <Switch checked={darkMode} onChange={toggleDarkMode} />
                </MenuItem>
                <MenuItem onClick={() => signout()}>Keluar</MenuItem>
            </Menu>
        </div>
    )
}

const UserData = () => {
    const [user, setUser] = useState<User | null>(null)
    useEffect(() => {
        const fetchData = async () => {
            const { data } = await fetchUser()
            setUser(data?.user)
        }

        fetchData()
    }, [])

    if (user) {
        return (
            <ProfileMenu>
                <Image src={user.user_metadata.picture ?? 'https://docs.gravatar.com/wp-content/uploads/2024/09/cropped-72x72-1.png?w=240'} alt="User Profile" width={40} height={40} />
                {user.email}
            </ProfileMenu>
        )
    } else {
        return <p>Login!</p>
    }
}

const Profile = () => {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <UserData />
        </Suspense>
    )
}

export default Profile
