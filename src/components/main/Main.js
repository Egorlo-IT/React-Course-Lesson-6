import * as React from "react";
import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import TalkingRobot from "../talking-robot/TalkingRobot";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import { useForm } from "react-hook-form";
import Moment from "react-moment";
import ArticleIcon from "@mui/icons-material/Article";
import PersonIcon from "@mui/icons-material/Person";
import { useDispatch } from "react-redux";
import GetMessageList from "../../redux/store/messageList/GetMessageList";
import GetListChat from "../../redux/store/listChat/GetListChat";

import "./Main.css";

const Main = () => {
  const elInputName = useRef(null);
  const elInputMessage = useRef(null);
  const [nameUser, setNameUser] = useState("");
  const [textMessage, setTextMessage] = useState("");
  const [progress, setProgress] = useState(false);

  const messageList = GetMessageList();
  const listChat = GetListChat();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    resetField,
    reset,
  } = useForm();

  const FormTextField = styled(TextField)({
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#7c5b70",
        border: "2px solid #7c5b70",
      },
      "&:hover fieldset": {
        borderColor: "#7c5b70",
      },
    },
  });

  const onSubmit = (data) => {
    setProgress(true);

    setNameUser(data.nameUser);
    setTextMessage(data.textMessage);
  };

  const calcId = (type) => {
    let res;
    switch (type) {
      case "mess": {
        res = messageList.length ? messageList.length + 1 : 1;
        break;
      }
      case "chat": {
        res = listChat.length ? listChat.length + 1 : 1;
        break;
      }
      case "chatList": {
        res = listChat[listChat.length - 1]?.chat.length
          ? listChat[listChat.length - 1]?.chat.length + 1
          : 1;
        break;
      }

      default:
        break;
    }
    return res;
  };

  const createNewChat = () => {
    dispatch({ type: "clearMessageList" });
    reset();
  };

  const removeChat = (id) => {
    const dataFilter = listChat.filter((list) => list.id !== +id);
    dispatch({ type: "removeChat", payload: dataFilter });
  };

  useEffect(() => {
    if (elInputName.current) {
      elInputName.current.focus();
    }
  }, [messageList]);

  useEffect(() => {
    if (listChat.length === 0 && messageList.length > 0) {
      dispatch({ type: "clearMessageList" });
      reset();
    }
    // eslint-disable-next-line
  }, [listChat]);

  useEffect(() => {
    if (nameUser?.trim() !== "" && textMessage?.trim() !== "") {
      if (messageList.length === 0) {
        dispatch({
          type: "chatPayload",
          payload: {
            id: calcId("chat"),
            name: nameUser,
            date: new Date(),
            chat: [
              {
                id: 1,
                author: nameUser,
                text: textMessage,
              },
              {
                id: 2,
                author: "Robot",
                text: `Привет, ${nameUser}!`,
              },
            ],
          },
        });

        dispatch({
          type: "messageListPayload",
          payload: {
            id: 1,
            author: nameUser,
            text: textMessage,
          },
        });

        setTimeout(() => {
          dispatch({
            type: "messageListPayload",
            payload: {
              id: 2,
              author: "Robot",
              text: `Привет, ${nameUser}!`,
            },
          });
          setProgress(false);
        }, 1500);
      } else {
        dispatch({
          type: "messageListPayload",
          payload: {
            id: calcId("mess"),
            author: nameUser,
            text: textMessage,
          },
        });

        setTimeout(() => {
          dispatch({
            type: "messageListPayload",
            payload: {
              id: calcId("mess") + 1,
              author: "Robot",
              text: `Привет, ${nameUser}!`,
            },
          });
          setProgress(false);
        }, 1500);
      }

      resetField("textMessage");
    }
    // eslint-disable-next-line
  }, [nameUser, textMessage]);

  return (
    <div className="main">
      <Container className="main-container" maxWidth="sm">
        <List
          className="chat-list"
          sx={{
            width: "100%",
            maxWidth: 360,
            minWidth: 250,
            bgcolor: "background.paper",
          }}
        >
          {listChat && listChat?.length > 0 ? (
            listChat.map((chat) => (
              <div className="chat-wrap" key={chat.id}>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar alt={chat.name} src="../../image/robot.gif" />
                  </ListItemAvatar>
                  <ListItemText
                    primary={chat.name}
                    secondary={
                      <React.Fragment>
                        <Moment format="DD.MM.YYYY HH:mm">{chat.date}</Moment>
                      </React.Fragment>
                    }
                  />
                </ListItem>
                <div onClick={() => removeChat(chat.id)} className="btn-remove">
                  +
                </div>
                <div className="wrap-icons">
                  <Link className="link" to={"chat/" + chat.id}>
                    <ArticleIcon className="icon-open" />
                  </Link>
                  <Link className="link" to={"user-profile/"}>
                    <PersonIcon className="icon-user" />
                  </Link>
                </div>

                <Divider variant="inset" component="li" />
              </div>
            ))
          ) : (
            <div className="no-chat">No chat</div>
          )}
        </List>
        <Box
          className="box"
          sx={{
            bgcolor: "#fef6e4",
          }}
        >
          <h2 className="text">Ask the robot Max something:</h2>
          <form className="form" onSubmit={handleSubmit(onSubmit)}>
            <FormTextField
              inputRef={elInputName}
              label="Type your name"
              id="custom-css-outlined-input"
              name="nameUser"
              className="input"
              fullWidth
              {...register("nameUser", {
                required: "Name is required.",
              })}
              error={Boolean(errors.nameUser)}
              helperText={errors.nameUser?.message}
            />

            <FormTextField
              inputRef={elInputMessage}
              label="Type your message"
              id="custom-css-outlined-input"
              name="textMessage"
              className="input"
              fullWidth
              {...register("textMessage", {
                required: "Message is required.",
              })}
              error={Boolean(errors.textMessage)}
              helperText={errors.textMessage?.message}
            />

            <div className="group_btn">
              <button type="submit" className="btn btn-submit">
                SEND
              </button>
              <button
                onClick={createNewChat}
                type="button"
                className="btn btn-newchat"
              >
                NEW CHAT
              </button>
            </div>
          </form>
          <TalkingRobot chat={messageList} progress={progress} />
        </Box>
      </Container>
    </div>
  );
};

export default Main;
