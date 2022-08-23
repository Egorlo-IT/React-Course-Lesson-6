import { useSelector } from "react-redux";

const GetListChat = () => {
  return useSelector((state) => state.listChat);
};

export default GetListChat;
