'use client'

import { Box, Button, Card, CardHeader, Container, Divider, Grid, IconButton, Input, InputAdornment, LinearProgress, List, ListItem, ListItemText, Paper, TextField } from '@mui/material'
import { styled } from "@mui/material/styles";
import { useEffect, useState } from 'react';
import api from "../../lib/service";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';


interface Props {
    title: string;
    uploading: boolean;
    loading: boolean;
    fileName: string;
    platform: string;
}

interface Question {
    question: string;
    type: string
}

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const Panel: React.FC<Props> = ({ title, uploading, loading, fileName, platform }) => {
    const [summary, setSummary] = useState()
    const [actionItems, setActionItems] = useState([])
    const [bleuScore, setBleuScore] = useState(0)
    const [meteorScore, setMeteorScore] = useState(0)
    const [rougeScore, setRougeScore] = useState(0)
    const [questions, setQuestions] = useState([])
    const [questionInput, setQuestionInput] = useState("")

    useEffect(() => {
        const fetchData = async () => {
            const res = await api.getNlgData(fileName, platform);
            if (res.status == 200) {
                console.log(res.data);
                setSummary(res.data.summary);
                setActionItems(res.data.action_items);
                setBleuScore(res.data.bleu);
                setMeteorScore(res.data.meteor);
                setRougeScore(res.data.rouge);
                setQuestions(res.data.questions);
            }
        }
        if (!loading && !uploading) {
            fetchData();
            setQuestionInput('')
        }
    }, [fileName, loading, platform, uploading])

    const handleSendMessageClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        if (questionInput != "") {
            setQuestionInput("");
            alert("mock send a message event")
        } else {
            alert("blank msg!")
        }
    }

    return (
        <div className='flex-1'>
            <div className='mt-2 ml-2.5 mr-2.5'>
                <div className='flex justify-center items-center'>
                    <h1>{title}</h1>
                </div>
                <Container className='mt-2'>
                    {/* <Button variant="contained" component="label" disabled={uploading && loading}>Generate Summary</Button> */}
                    <Card variant="outlined" className='mt-5 bg-cyan-100'>
                        <CardHeader title='What have you missed?' />
                        <p>{summary}
                        </p>
                        <div className='flex padding-10 mt-1'>
                            <Box sx={{ width: '15%' }}>
                                <h1>Bleu:</h1>
                            </Box>
                            <Box sx={{ width: '10%' }}>
                                {Math.round(bleuScore * 100) / 100}
                            </Box>
                            <Box sx={{ width: '65%' }}>
                                <LinearProgress variant="determinate" value={bleuScore * 100} />
                            </Box>
                            <Box sx={{ width: '10%', textAlign: 'center' }}>
                                <h1>1.0</h1>
                            </Box>
                        </div>
                        <div className='flex padding-10 mt-1'>
                            <Box sx={{ width: '15%' }}>
                                <h1>Rouge:</h1>
                            </Box>
                            <Box sx={{ width: '10%' }}>
                                {Math.round(rougeScore * 100) / 100}
                            </Box>
                            <Box sx={{ width: '65%' }}>
                                <LinearProgress variant="determinate" value={rougeScore * 100} />
                            </Box>
                            <Box sx={{ width: '10%', textAlign: 'center' }}>
                                <h1>1.0</h1>
                            </Box>
                        </div>
                        <div className='flex padding-10 mt-1'>
                            <Box sx={{ width: '15%' }}>
                                <h1>Meteor:</h1>
                            </Box>
                            <Box sx={{ width: '10%' }}>
                                {Math.round(meteorScore * 100) / 100}
                            </Box>
                            <Box sx={{ width: '65%' }}>
                                <LinearProgress variant="determinate" value={meteorScore * 100} />
                            </Box>
                            <Box sx={{ width: '10%', textAlign: 'center' }}>
                                <h1>1.0</h1>
                            </Box>
                        </div>
                    </Card>
                    <Divider variant='inset' />
                    <Card variant="outlined" className='mt-2 bg-cyan-100'>
                        <p><strong>Action Itmes</strong></p>
                        {/* {actionItems.length} */}
                        {actionItems && actionItems.length > 0 ?
                            (
                                <List>
                                    {actionItems.map((item, index) => (
                                        <ListItem key={index}>
                                            <ListItemText primary={item} />
                                        </ListItem>
                                    ))}
                                </List>
                            )
                            : <p>no action item</p>
                        }
                    </Card>
                </Container>
                <Container className='mt-5'>
                    <p><strong>Can&apos;t find what you&apos;re looking for? Ask {title}</strong></p>
                    <Grid container spacing={2}>
                        {
                            questions.map((item: Question, index: number) => (
                                <Grid item xs={6} key={index}>
                                    <Item onClick={() => setQuestionInput(item.question)}>
                                        {/* <Item onClick={handleQuestionClick}> */}
                                        {item.question}
                                    </Item>
                                </Grid>
                            ))
                        }
                    </Grid>
                    <div className='mt-3'>
                        <TextField id="outlined-basic" placeholder="Send a message" InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="send a message"
                                        edge="end"
                                        onClick={handleSendMessageClick}
                                    >
                                        <ArrowForwardIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                            variant="outlined"
                            fullWidth
                            value={questionInput}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setQuestionInput(event.target.value);
                            }}
                        />
                    </div>
                </Container>
            </div >=
        </div >
    )
}

export default Panel;