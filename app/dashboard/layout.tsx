'use client'
import { Box } from '@mui/material'
import React from 'react'
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar'

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <Sidebar>
                    <Menu>
                        <SubMenu label="Charts">
                            <MenuItem> Pie charts </MenuItem>
                            <MenuItem> Line charts </MenuItem>
                        </SubMenu>
                        <MenuItem> Documentation </MenuItem>
                        <MenuItem> Calendar </MenuItem>
                    </Menu>
                </Sidebar>
                <Box sx={{ minHeight: 'calc(100vh - 170px)' }}>{children}</Box>
            </body>
        </html>
    )
}
