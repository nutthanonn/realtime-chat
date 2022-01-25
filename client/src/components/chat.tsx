import "moment/locale/th";
import React, { useState, useEffect } from "react";

import Box from "@mui/material/Box";
import moment from "moment";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Lottie from "react-lottie";
import Typography from "@mui/material/Typography";
import animationData from "../assets/chatting.json";
import { Socket } from "socket.io-client";
import { makeStyles } from "@mui/styles";
import { AiOutlineCheckCircle } from "react-icons/ai";
interface ChatProps {
  socket: Socket;
  name: string;
  room: string;
}

interface messageProps {
  room: string;
  name: string;
  message: string;
  time: string;
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
    overflow: "auto",
  },
  messageClassMe: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    margin: 20,
    "& .textMessage": {
      display: "block",
      backgroundColor: "#9D9D9D",
      padding: "2px 5px",
      borderRadius: 10,
    },
  },
  messageClassAnother: {
    margin: 20,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    "& .textMessage": {
      padding: "2px 5px",
      borderRadius: 10,
      backgroundColor: "#F8F0DF",
    },
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
  const [messageList, setMessageList] = useState<messageProps[]>([]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  const sendMessage = async () => {
    if (value !== "") {
      const messageData = {
        room: room,
        name: name,
        message: value,
        time: moment().format("LT"),
      };
      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value);
  };

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
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
        <Box className={classes.boxMessage}>
          {messageList.map((item, index) => {
            return (
              <Box
                className={
                  name === item.name
                    ? classes.messageClassMe
                    : classes.messageClassAnother
                }
                key={index}
              >
                {name === item.name ? (
                  <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                    <Box sx={{ mr: 1 }}>
                      <AiOutlineCheckCircle size={15} color="green" />
                      &nbsp;
                      {item.time} : <b>Send by </b> {item.name}
                    </Box>
                    <Typography variant="h5" className="textMessage">
                      {item.message}
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                    <Typography variant="h5" className="textMessage">
                      {item.message}
                    </Typography>
                    <Box sx={{ ml: 1 }}>
                      <b>Send by </b>
                      {item.name} : {item.time}
                    </Box>
                  </Box>
                )}
              </Box>
            );
          })}
        </Box>
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
          <Button
            type="submit"
            sx={{
              border: 1,
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
            }}
          >
            Send
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default Chat;
