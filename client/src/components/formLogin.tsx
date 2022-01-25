import React, { useState } from "react";
import Chat from "./chat";

import Lottie from "react-lottie";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import AnimationData from "../assets/lets-chat.json";

import { io } from "socket.io-client";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  root: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#79B4B7",
  },
  boxForm: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#FEFBF3",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    borderRadius: 10,
    boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
  },
});

const defaultAnimtion = {
  loop: true,
  autoplay: true,
  animationData: AnimationData,
};

const FormLogin: React.FC = () => {
  const classes = useStyles();
  const [name, setName] = useState<string>("");
  const [room, setRoom] = useState<string>("");
  const [isRigis, setIsRigis] = useState<boolean>(true);

  const socket = io("http://localhost:8000/");

  const connectToRoom = () => {
    socket.emit("join_room", room);
  };

  const handleChangeName = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setName(event.target.value);
  };

  const handleChangeRoom = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setRoom(event.target.value);
  };

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>): void => {
    event.preventDefault();
    connectToRoom();
    setIsRigis(false);
  };

  return (
    <Box className={classes.root}>
      {isRigis ? (
        <Box>
          <Box
            sx={{ position: "absolute", bottom: 0, right: 0, bgColor: "white" }}
          >
            <Lottie
              options={defaultAnimtion}
              isClickToPauseDisabled={true}
              width={500}
            />
          </Box>
          <form className={classes.boxForm} onSubmit={handleSubmit}>
            <Typography variant="h2" color="#9D9D9D">
              Realtime Chat
            </Typography>
            <Box>
              <TextField
                autoComplete="off"
                type="text"
                onChange={handleChangeName}
                value={name}
                size="small"
                placeholder="Name..."
                sx={{ mr: 5 }}
              />
              <TextField
                autoComplete="off"
                type="text"
                onChange={handleChangeRoom}
                value={room}
                size="small"
                placeholder="Room..."
              />
            </Box>
            <Button sx={{ mt: 5 }} type="submit">
              Enter Chat
            </Button>
          </form>
        </Box>
      ) : (
        <Chat socket={socket} name={name} room={room} />
      )}
    </Box>
  );
};

export default FormLogin;
