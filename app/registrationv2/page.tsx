'use client'

import React, { useState } from 'react'
import { Stepper, Step, StepLabel, Button, Typography, Slide, Box } from '@mui/material'

const steps = ['Step 1', 'Step 2', 'Step 3']

const AnimatedStepper: React.FC = () => {
    const [activeStep, setActiveStep] = useState(0)
    const [direction, setDirection] = useState<'left' | 'right'>('left')

    const handleNext = () => {
        setDirection('left')
        setActiveStep((prevActiveStep) => Math.min(prevActiveStep + 1, steps.length - 1))
    }

    const handleBack = () => {
        setDirection('right')
        setActiveStep((prevActiveStep) => Math.max(prevActiveStep - 1, 0))
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Stepper activeStep={activeStep}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <Box sx={{ position: 'relative', height: '100px', overflow: 'hidden' }}>
                <Slide direction={direction} in={true} mountOnEnter unmountOnExit timeout={500}>
                    <Box sx={{ position: 'absolute', width: '100%' }}>
                        <Typography variant="h6" align="center">
                            {`Content for ${steps[activeStep]}`}
                        </Typography>
                    </Box>
                </Slide>
            </Box>
            <Box sx={{ mt: 2 }}>
                <Button disabled={activeStep === 0} onClick={handleBack}>
                    Back
                </Button>
                <Button variant="contained" color="primary" onClick={handleNext}>
                    {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
            </Box>
        </Box>
    )
}

export default AnimatedStepper
