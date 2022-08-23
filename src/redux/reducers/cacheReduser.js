const initialState = { count: 0, messageList: [], listChat: [] };

export const cacheReduser = (state = initialState, action) => {
  switch (action.type) {
    case "increment":
      return {
        ...state,
        count: state.count + 1,
      };
    case "decrement":
      return { ...state, count: state.count - 1 };
    case "clear":
      return { ...state, count: 0 };
    case "clearMessageList":
      return { ...state, messageList: [] };
    case "chatPayload":
      return { ...state, listChat: [...state.listChat, action.payload] };
    case "messageListPayload":
      return { ...state, messageList: [...state.messageList, action.payload] };
    case "removeChat":
      return { ...state, listChat: action.payload };
    default:
      return state;
  }
};
