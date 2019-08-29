import React, { useState, useEffect } from "react";
import MDSpinner from "react-md-spinner";
import { CometChat } from "@cometchat-pro/chat";
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const limit = 30;
const MESSAGE_LISTENER_KEY = "listener-key";
let boxMessage = "Welcome to CometChat"
const ChatBox = props => {
  const { chat, chatIsLoading, user } = props;
  if (chatIsLoading) {
    return (
      <div className="col-xl-12 my-auto text-center">
        <MDSpinner size="72" />
      </div>
    );
  } else {
    return (
      <div className="col-xl-12">
        {chat.map(chat => (
          <div key={chat.id} className="message">
            <div
              className={`${
                chat.receiver !== user.uid ? "balon1" : "balon2"
                } p-3 m-1`}
            >
              {chat.type === "text" ? <div>{chat.text}</div> :
                <img src={chat.file} alt="file" />
              }
            </div>
          </div>
        ))}
      </div>
    );
  }
};

const FriendList = props => {
  const { friends, friendisLoading, selectedFriend } = props;
  if (selectedFriend) {
    if (document.getElementById("friends")) {
      let friendsNode = document.getElementById("friends")
      friendsNode.parentNode.removeChild(friendsNode)
    }
  }
  if (friendisLoading) {
    return (
      <div className="col-xl-12 my-auto text-center">
        <MDSpinner size="72" />
      </div>
    );
  } else {
    return (
      <ul className="list-group list-group-flush w-100">
        {friends.map(friend => (
          <li
            key={friend.uid}
            className={`list-group-item ${
              friend.uid === selectedFriend ? "active" : ""
              }`}
            onClick={() => props.selectFriend(friend.uid)}
          >
            {friend.name}
          </li>
        ))}
      </ul>
    );
  }
};
const Chat = ({ user }) => {
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [chat, setChat] = useState([]);
  const [chatIsLoading, setChatIsLoading] = useState(false);
  const [friendisLoading, setFriendisLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null)

  useEffect(() => {
    let usersRequest = new CometChat.UsersRequestBuilder()
      .setLimit(limit)
      .build();
    usersRequest.fetchNext().then(
      userList => {
        console.log("User list received:", userList);
        setFriends(userList);
        setFriendisLoading(false);
      },
      error => {
        console.log("User list fetching failed with error:", error);
      }
    );

    return () => {
      CometChat.removeMessageListener(MESSAGE_LISTENER_KEY);
      CometChat.logout();
    };
  }, []);
  useEffect(() => {
    if (selectedFriend) {
      boxMessage = "You're chatting with " + selectedFriend
      let messagesRequest = new CometChat.MessagesRequestBuilder()
        .setUID(selectedFriend)
        .setLimit(limit)
        .build();

      messagesRequest.fetchPrevious().then(
        messages => {
          setChat(messages);
          setChatIsLoading(false);
          scrollToBottom();
        },
        error => {
          console.log("Message fetching failed with error:", error);
        }
      );

      CometChat.removeMessageListener(MESSAGE_LISTENER_KEY);
      CometChat.addMessageListener(
        MESSAGE_LISTENER_KEY,
        new CometChat.MessageListener({
          onTextMessageReceived: message => {
            console.log("Incoming Message Log", { message });
            if (selectedFriend === message.sender.uid) {
              setChat(prevState => [...prevState, message]);
              scrollToBottom();
            }
          },
          onMediaMessageReceived: message => {
            console.log("incoming media", { message });
            if (selectedFriend === message.sender.uid) {
              setChat(prevState => [...prevState, message]);
            }
          }
        })
      );
    }
  }, [selectedFriend]);
  const scrollToBottom = () => {
    let chatContainer = document.getElementById('chat-container')
    chatContainer && chatContainer.scrollTo(0, chatContainer.scrollHeight)
  };

  const selectFriend = uid => {
    setSelectedFriend(uid);
    setChat([]);
    setChatIsLoading(true);
  };


  const handleSubmit = event => {
    if (file) {
      sendFile()
    } else {
      event.preventDefault();
      let textMessage = new CometChat.TextMessage(
        selectedFriend,
        message,
        CometChat.MESSAGE_TYPE.TEXT,
        CometChat.RECEIVER_TYPE.USER
      );
      console.log(textMessage);
      CometChat.sendMessage(textMessage).then(
        message => {
          console.log("Message sent successfully:", message);
          setChat([...chat, message]);
          scrollToBottom();
        },
        error => {
          console.log("Message sending failed with error:", error);
        }
      );
      setMessage("");
    }

  };

  // const sendTextOrFile = () => {
  //   // console.log("FOnt Awesome is so cool")
  //   if (file) {
  //     sendFile()
  //   } else {
  //     handleSubmit()
  //   }
  // }

  const sendFile = () => {
    var mediaMessage = new CometChat.MediaMessage(
      selectedFriend,
      file,
      CometChat.MESSAGE_TYPE.FILE,
      CometChat.RECEIVER_TYPE.USER
    );
    CometChat.sendMediaMessage(mediaMessage).then(
      message => {
        console.log("file sent", message)
        setChat([...chat, message]);
      },
      error => {
        return error
      }
    )
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2" />
        <div className="col-md-8 h-100pr border rounded">
          <div id="parent" className="row">
            <div id="friends"
              className=" col-lg-8 col-xs-12 bg-light"
              style={{
                height: 658
              }}
            >
              <div className="row p-3">
                <h4>Select a friend to chat with</h4>
              </div>
              <div
                className="row ml-0 mr-0 h-75 bg-white border rounded"
                style={{ height: "100%", overflow: "auto" }}
              >
                <FriendList
                  friends={friends}
                  friendisLoading={friendisLoading}
                  selectedFriend={selectedFriend}
                  selectFriend={selectFriend}
                />
              </div>
            </div>
            <div
              className="col-lg-8 col-xs-12 bg-light"
              style={{ height: 658 }}>
              <div className="row p-3 bg-white">
                <h3>{boxMessage}</h3>
              </div>
              <div
                id="chat-container"
                className="row pt-5 bg-white"
                style={{ height: 530, overflow: "auto" }}
              >
                <ChatBox
                  chat={chat}
                  chatIsLoading={chatIsLoading}
                  user={user}
                />
              </div>

              <div
                className="row bg-light"
                style={{ bottom: 0, width: "100%" }}>
                <form className="row1 m-0 p-0 w-100" onSubmit={handleSubmit}>
                  <div className="col-9 m-0 p-1">
                    <input
                      id="text"
                      className=" in mw-100 border rounded form-control"
                      type="text"
                      onChange={event => {
                        setMessage(event.target.value);
                      }}
                      value={message}
                      placeholder="Type a message..."
                    />
                  </div>
                  <div>
                    <span class="btn btn-outline-secondary rounded border w-100 btn-file">
                      <FontAwesomeIcon icon={faPaperclip} /><input type="file" />
                    </span>
                  </div>
                  <div>
                    <button className="sfile btn btn-outline-secondary rounded border w-100"
                      onClick={sendFile}
                    >
                      <FontAwesomeIcon icon={faPaperPlane} />
                    </button>
                  </div>
                </form>
              </div>
              {/* <div className="">
                <div className="mt-3">
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Chat;