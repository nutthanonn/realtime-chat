import React, { useState, useEffect } from "react";
import { makeStyles } from "@mui/styles";
import { Socket } from "socket.io-client";
import "moment/locale/th";

import Box from "@mui/material/Box";
import moment from "moment";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Lottie from "react-lottie";
import animationData from "../assets/chatting.json";

interface ChatProps {
  socket: Socket;
  name: string;
  room: string;
}

const useStyles = makeStyles({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
  boxChat: {
    backgroundColor: "#FEFBF3",
    borderRadius: 10,
    boxShadow: "rgba(17, 12, 46, 0.15) 0px 48px 100px 0px",
    width: 700,
    height: 500,
  },
  boxMessage: {
    width: "94%",
    height: "80%",
    margin: 20,
    borderRadius: 10,
    boxShadow:
      "rgba(9, 30, 66, 0.25) 0px 1px 1px, rgba(9, 30, 66, 0.13) 0px 0px 1px 1px",
  },
});

const defaultAnimtion = {
  loop: true,
  autoplay: true,
  animationData: animationData,
};

const Chat: React.FC<ChatProps> = ({ socket, name, room }) => {
  moment.locale("th");
  const classes = useStyles();
  const [value, setValue] = useState<string>("");

  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log(data);
    });
  }, [socket]);

  const sendMessage = async () => {
    if (value !== "") {
      const messageData = {
        room: room,
        author: name,
        message: value,
        time: moment().format("LT"),
      };
      await socket.emit("send_message", messageData);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value);
  };

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>): void => {
    event.preventDefault();
    sendMessage();
    setValue("");
  };

  return (
    <div className={classes.root}>
      <Box sx={{ position: "absolute", bottom: 0, right: 0 }}>
        <Lottie
          options={defaultAnimtion}
          isClickToPauseDisabled={false}
          width={350}
        />
      </Box>
      <Box className={classes.boxChat}>
        <Box className={classes.boxMessage}></Box>
        <Box
          sx={{ m: 2, width: "95%", display: "flex" }}
          component="form"
          onSubmit={handleSubmit}
        >
          <TextField
            size="small"
            placeholder="message..."
            autoComplete="off"
            fullWidth={true}
            value={value}
            onChange={handleChange}
            variant="outlined"
          />
          <Button type="submit">N</Button>
        </Box>
      </Box>
    </div>
  );
};

export default Chat;
