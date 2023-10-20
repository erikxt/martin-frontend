"use client";
import React, { useEffect, useRef } from 'react'
import List from "@mui/material/List";
import ListItemButton from '@mui/material/ListItemButton';
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import api from "../../lib/service";
import { Button } from '@mui/material';

import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';
import Panel from './panel';

function HomeIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </SvgIcon>
  );
}

// to enable es6 (import/export)
// import dynamic from 'next/dynamic';

// const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false });


export default function After() {
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  const [srtData, setSrtData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [fileName, setFileName] = React.useState('default');
  const [uploading, setUploading] = React.useState(false);
  const playerRef = useRef(null);

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
    start: string,
  ) => {
    setSelectedIndex(index);
    // move the video to the start time
    const myPlayer = document.getElementById("my-player") as HTMLVideoElement;
    // transfer the start time which has format like '00:00:01,740' to seconds
    const time = start.split(':');
    time[2] = time[2].replace(',', '.');
    const seconds = (+time[0]) * 60 * 60 + (+time[1]) * 60 + (+time[2]);
    console.log(seconds);
    myPlayer.currentTime = seconds;
    console.log("curr:" + myPlayer.currentTime);
    myPlayer.play();
  };

  // loading ListComponent data from api "http://127.0.0.1:8000/srt/default" which return json data, 
  // when it return 404, it will show loading text and try it iterate again after 5 seconds
  // when it return 200, it will show the data
  // now create the fetch data function and call it in useEffect
  // use setInterval to call the api every 5 seconds, when api return 404, it will show loading text and try it iterate again after 5 seconds
  // when api return 200, it will show the data
  // now create the fetch data function and call it in useEffect

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(false);
        const res = await api.getSrt(fileName);
        // check res.status is 200 or not
        console.log(res.status);
        if (res.status == 200) {
          setSrtData(res.data);
          setLoading(false);
        } else if (res.status == 404) {
          setLoading(true);
        }
      } catch (error) {
        console.log(error);
        setLoading(true);
        // setError(true);
      }
    };
    fetchData();
    // use setInterval to call the api every 5 seconds, when loading becomes false, it will stop the setInterval
    const interval = setInterval(() => {
      console.log("This will run every 5 seconds until the srt is loaded");
      console.log("env:", process.env.NEXT_PUBLIC_BACKEND_ADDR);
      // console.log("loading：" + loading);
      fetchData();
      if (!loading) {
        clearInterval(interval);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [fileName, loading]);

  const handleUploadVideo = async (event: any) => {
    setError(false);
    setLoading(false);
    setUploading(false);
    const myPlayer = playerRef.current as unknown as HTMLVideoElement;
    var playFileName = fileName;
    try {
      myPlayer.pause();
      if (event.target.files.length > 0) {
        setUploading(true);
        setError(false);
      } else {
        return;
      }
      const res = await api.uploadVideo(event.target.files[0]);
      if (res.status == 200) {
        console.log("upload video successfully");
        playFileName = res.data.fileName;
        setFileName(res.data.fileName);
      } else {
        alert(res.data.detail);
      }
    } catch (error) {
      alert(error);
      setError(true);
    }
    // enable the upload button
    setUploading(false);
    // change video source to the new video
    // myPlayer.src = process.env.NEXT_PUBLIC_BACKEND_ADDR + "/video/" + playFileName + ".mp4";
    // myPlayer.poster = process.env.NEXT_PUBLIC_BACKEND_ADDR + "/thumbnail/" + playFileName + ".png";
    // myPlayer.load();
  };

  useEffect(() => {
    const myPlayer = playerRef.current as unknown as HTMLVideoElement;
    myPlayer.src = process.env.NEXT_PUBLIC_BACKEND_ADDR + "/video/" + fileName + ".mp4";
    myPlayer.poster = process.env.NEXT_PUBLIC_BACKEND_ADDR + "/thumbnail/" + fileName + ".png";
    myPlayer.load();
  }, [fileName]);


  return (
    <>
      <div className='flex justify-between'>
        <div className=' w-125 max-w-500'>
          {/* <div> */}
          {/* create a upload video button*/}
          {/* <div className='ml-100'> */}
          <Button variant="contained" component="label" disabled={true}>
            Upload Video
            <input type="file" hidden onChange={handleUploadVideo} />
          </Button>
          {/* </div> */}
          {/* <div> */}
          <video
            ref={playerRef}
            width="480"
            height="270"
            id="my-player"
            className="video-js"
            controls
            preload="auto"
            autoPlay
            loop={true}
            poster={process.env.NEXT_PUBLIC_BACKEND_ADDR + "/thumbnail/" + fileName + ".png"}
            data-setup="{}"
          >
            <source
              src={process.env.NEXT_PUBLIC_BACKEND_ADDR + "/video/" + fileName + ".mp4"}
              type="video/mp4"
            ></source>
          </video>
          <List sx={{ width: "100%", maxWidth: 480, bgcolor: "background.paper" }}>
            {error ? (<p>Something went wrong...</p>) :
              !loading && !uploading ? (
                srtData.map((item: any) => (
                  <div key={item.id}>
                    <ListItemButton alignItems="flex-start" key={item.id}
                      onClick={(event) => handleListItemClick(event, 0, item.start)}
                      selected={selectedIndex === 0} >
                      <ListItemAvatar>
                        <Avatar></Avatar>
                        <p className='mr-3'>{item.speaker}</p>
                      </ListItemAvatar>
                      <ListItemText
                        primary={item.start + "--" + item.end}
                        secondary={item.text}
                      />
                    </ListItemButton>
                    <Divider variant="inset" component="li" />
                  </div>
                ))
              ) : (
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                  role="status">
                  <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"></span>
                </div>

              )
            }
          </List>
        </div>
        <Panel title="Martin" uploading={uploading} loading={loading} fileName={fileName} platform='gpt-4'/>
        <Panel title="GPT-4" uploading={uploading} loading={loading} fileName={fileName} platform='gpt-4'/>
      
      </div>
    </>
  );
}
