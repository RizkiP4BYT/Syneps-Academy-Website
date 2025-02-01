'use client'
import { Box, Container, Drawer, styled } from '@mui/material'
import React, { useState } from 'react'
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar'

const MainWrapper = styled('div')(() => ({
    display: 'flex',
    minHeight: '100vh',
    width: '100%'
}))

const PageWrapper = styled('div')(() => ({
    display: 'flex',
    flexGrow: 1,
    paddingBottom: '60px',
    flexDirection: 'column',
    zIndex: 1,
    backgroundColor: 'transparent'
}))

const Header = styled('div')(({ theme }) => ({
    boxShadow: 'none',
    background: theme.palette.background.paper,
    justifyContent: 'center',
    backdropFilter: 'blur(4px)',
    [theme.breakpoints.up('lg')]: {
        minHeight: '70px'
    }
}))

export default function Layout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, isSidebarOpen] = useState(false)
    return (
        <MainWrapper>
            <Sidebar toggled={sidebarOpen} breakPoint="lg">
                <Menu>
                    <SubMenu label="Charts">
                        <MenuItem> Pie charts </MenuItem>
                        <MenuItem> Line charts </MenuItem>
                    </SubMenu>
                    <MenuItem> Documentation </MenuItem>
                    <MenuItem> Calendar </MenuItem>
                </Menu>
            </Sidebar>

            <Header>
                <Drawer />
                <p>WOwowowowo</p>
            </Header>

            <PageWrapper>
                <Container sx={{ paddingTop: '20px', maxWidth: '1200px' }}>
                    <Box sx={{ minHeight: 'calc(100vh - 170px)' }}>{children}</Box>
                </Container>
            </PageWrapper>
        </MainWrapper>
    )
}
