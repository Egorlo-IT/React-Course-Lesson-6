import { useSelector } from "react-redux";

const GetMessageList = () => {
  return useSelector((state) => state.messageList);
};

export default GetMessageList;
