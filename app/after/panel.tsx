'use client'

import { Box, Button, Card, CardHeader, Container, Divider, LinearProgress, Slider } from '@mui/material'

interface Props {
    title: string;
    uploading: boolean;
    loading: boolean;
}

const Panel: React.FC<Props> = ({ title, uploading, loading }) => {

    const marks = [
        {
            value: 0,
            label: '0',
        },
        {
            value: 100,
            label: '1.0',
        },
    ];

    function valuetext(value: number) {
        return `${value}`;
    }

    return (
        <div className='flex-1'>
            <div className='mt-2 ml-2.5 mr-2.5'>
                <div className='flex justify-center items-center'>
                    <h1>{title}</h1>
                </div>
                <Container className='bg-cyan-100'>
                    <Button variant="contained" component="label" disabled={uploading && loading}>Generate</Button>
                    <Card variant="outlined" className='mt-2 bg-inherit'>
                        <CardHeader title='What have you missed?' />
                        <p>The text discusses the role that artificial intelligence (AI) and machine learning can play in addressing complex real-world problems such as public health, climate change, and disaster management. The speakers highlight the complexities involved, including the various stakeholders, logistical constraints, and data privacy issues. Through specialized training, participants are expected to gain hands-on experience with AI applications and how they fit into these broader challenges. The conversation emphasizes both the potential and constraints of using AI as a tool for good, with the hope that learners can build, evaluate and apply successful AI projects to tackle important societal issues.
                        </p>
                        <div className='flex padding-10'>
                            <Box sx={{ width: '15%' }}>
                                <h1>Bleu</h1>
                            </Box>
                            <Box sx={{ width: '75%' }}>
                                <LinearProgress variant="buffer" value={50} />
                            </Box>
                            <Box sx={{ width: '10%' }}>
                                <h1>1.0</h1>
                            </Box>
                        </div>
                        <div className='flex padding-10'>
                            <Box sx={{ width: '15%' }}>
                                <h1>Rouge</h1>
                            </Box>
                            <Box sx={{ width: '75%' }}>
                                <LinearProgress variant="buffer" value={50} />
                            </Box>
                            <Box sx={{ width: '10%' }}>
                                <h1>1.0</h1>
                            </Box>
                        </div>
                        <div className='flex padding-10'>
                            <Box sx={{ width: '15%' }}>
                                <h1>Mentor</h1>
                            </Box>
                            <Box sx={{ width: '75%' }}>
                                <LinearProgress variant="buffer" value={50} />
                            </Box>
                            <Box sx={{ width: '10%' }}>
                                <h1>1.0</h1>
                            </Box>
                        </div>
                    </Card>
                </Container>
            </div>
            <div>
                <Container className=''>
                    <Card>
                        adfadf
                    </Card>
                </Container>
            </div>
        </div>
    )
}

export default Panel;