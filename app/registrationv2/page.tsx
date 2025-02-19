'use client'

import { Box, Card, CardActionArea, Grid2, Stack, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import React, { useState } from 'react'

interface Class {
    class_id: number
    program_id: number
    batch_id: number
    class_name: string
    class_description: string
    learning_method: string
    created_at: string
    is_active: boolean
}

interface Program {
    program_id: number
    program_name: string
}
interface Batch {
    batch_id: number
    batch_number: number
    batch_start: string
    batch_end: string
}

interface ActiveClass {
    Classes: Class[]
    Programs: Program[]
    Batches: Batch[]
}

const RegistrationPage = () => {

    const { data: activeClass = { Classes: [], Programs: [], Batches: []}, isLoading, isError } = useQuery<ActiveClass>({
        queryKey: ['ActiveClass'],
        queryFn: async () => {
            const res = await fetch('/api/referral')
            if (!res.ok) throw new Error('Gagal memuat data')
            return res.json()
        },
    })
    const [selectedProgram, setSelectedProgram] = useState<string>("")
    return (
        <Box
          sx={{
              position: "relative",
              "&:before": {
                  content: '""',
                  background: "radial-gradient(#d2f1df, #d3d7fa, #bad8f4)",
                  backgroundSize: "400% 400%",
                  animation: "gradient 1s ease infinite",
                  position: "absolute",
                  zIndex: "-1",
                  height: "100%",
                  width: "100%",
                  opacity: "0.9",
              },
          }}
        >
          <Grid2 container justifyContent={"center"} sx={{ height: "100vh" }}>
            <Grid2
              size={{ xs: 10, sm: 10, lg: 4, xl: 4 }}
              display="flex"
              alignItems="center"
              flexDirection="column"
            >
              <Image
                src="/assets/images/syn-logo-dark.svg"
                alt="Syneps Academy Logo"
                width={150}
                height={150}
              />
              <Typography
                variant="h3"
                textAlign="center"
                color="textPrimary"
              >
                Formulir Pendaftaran Syneps Academy
              </Typography>
              <Typography variant='subtitle1' textAlign="center" color='textPrimary' mb={4}>Selamat datang di formulir pendaftaran Syneps Academy! Silahkan untuk mengisi data</Typography>
              <Card
                elevation={9}
                sx={{ p: 4, zIndex: 1, width: "100%", maxWidth: "500px" }}
              >
                <Box display="flex" alignItems="center" justifyContent="center">
                    <form action="">
                        <Stack>
                            <Box>
                                <Typography variant='h5' fontWeight={600} component="label" htmlFor='program'>Program yang ingin diikuti</Typography>
                                <Card>
                                    <CardActionArea onClick={() => setSelectedProgram()}></CardActionArea>
                                </Card>
                            </Box>
                        </Stack>
                    </form>
                </Box>
              </Card>
            </Grid2>
          </Grid2>
        </Box>
    )
}

export default RegistrationPage