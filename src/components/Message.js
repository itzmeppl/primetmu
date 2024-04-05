import io from "socket.io-client";
import Cookies from "js-cookie";
import { useEffect, useState , useRef} from "react";
import { render } from "@testing-library/react";
import "./Message.css";

const socket = io.connect('http://localhost:3001');
function Message() {
    //Room State
    const user = Cookies.get("Username");
    const [curRoom, setCurRoom] = useState("");
    const [tempCurRoom, setTempCurRoom] = useState("");
    
    // Messages States
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const newMsg = useRef();
    const [roomAuthor, setRoomAuthor] = useState([]);

    //Rooms of user
    const [userRooms, setUserRooms] = useState("");
    


    const joinRoom = async () => {
        setCurRoom(tempCurRoom);
        // console.log("Join Room: ",tempCurRoom);
        await socket.emit("join_room", tempCurRoom);
        // console.log("Joined: ",tempCurRoom);
        fetchMsg(tempCurRoom);
        
    };

    const sendMessage = async (room) => {
        // console.log("Send Message______________________-")
        await socket.emit("send_message", {message: message, givRoom: room, author: user});
        // console.log("Message Sent______________________-")
        // console.log("message: ", message);
        // console.log("author:", user);
        // console.log(room);
        // try {
        //     await fetch('http://localhost:3001/api/rooms',{
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({message: message, givRoom: room, author: user})
        // })
        // } catch (error) {
        //     console.log("sendMessage Error: ", error);        
        // }
        setMessage("");
    };

    socket.on("connect", async() =>{
        try {
            await fetch(`http://localhost:3001/api/userRooms?user=${user}`)
            .then(response => response.json())
            .then(data => {
                setUserRooms(data.rooms);
                console.log(data.rooms);
            }); 
            
        } catch (error) {
            console.log(error);
        }
        
    //     fetch('http://localhost:3001/api/rooms').then(response => response.json())
    // .then(data => {
        // console.log("connect");
    //     setMessages(data.allMessages);
    //     setRoomAuthor(data.users);
    // });
    })

    const roomTitle = (givRoom) => {
        if (!givRoom)
            return "";

        const users = givRoom.split("-");

        if (users[0] !== user)
            return users[0];
        return users[1];
    }

    const changeRoomName = (givRoom) => {
        const users = givRoom.split("-");
        if (users[0] !== user){
            if (users[0].length > 8)
                return users[0].slice(0,8) + "...";
            return users[0];
        }
        else{
            if (users[1].length > 8)
                return users[1].slice(0,8) + "...";
            return users[1];
        }
        
    }

    const fetchRooms = async (room) => {
        // setCurRoom(tempCurRoom);
        // console.log("Join Room: ",tempCurRoom);
        await socket.emit("join_room", room);
        // console.log("Joined: ",tempCurRoom);
        fetchMsg(room);
        setTempCurRoom(room);
    };

    useEffect(() => {
        newMsg.current.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (curRoom !== "")
            fetchMsg(curRoom);
    },[curRoom]);

    const fetchMsg = async(room) =>{
        try {
            if (room !== ""){
                await fetch(`http://localhost:3001/api/rooms?room=${room}`)
                .then(response => response.json())
                .then(data => {
                    setMessages(data.allMessages);
                    setRoomAuthor(data.users);
                    // console.log("received_message from: ", room);
                    // console.log("they are:", data.allMessages);
                });
                
            }
            
        } catch (error) {
                console.log(error);
        }
    }
    useEffect(() => {
        socket.on("receive_message", async(data) => {
            // console.log("receive_messaged______", data);
            if (data !== ""){
                // console.log("fetching");
                await fetchMsg(data);
            }
            // render();
            // console.log("receive_message: ", curRoom)
        });
        socket.on("new_room", (data) =>{
            try {
                fetch(`http://localhost:3001/api/userRooms?user=${user}`)
                .then(response => response.json())
                .then(data => {
                    setUserRooms(data.rooms);
                    console.log(data.rooms);
                });
            } catch (error) {
                console.log(error);
            }
        });
    }, [socket]);

    return (
        <div className="Message">
            {/* <input placeholder="Room Number..." onChange={(e) => {
                setTempCurRoom(e.target.value);
                }}
            />
            <button onClick={joinRoom}> Join Room</button> */}
            
            <h1>{roomTitle(tempCurRoom)}</h1>
            <div id="message_room_container">
                <div id="rooms">
                    {userRooms && userRooms
                    .map((room, index) => (
                        <button className="room" style={{backgroundColor: room === tempCurRoom? '#87CEEB': 'white'}} type="button" value={room} onClick={() => fetchRooms(room)}>{changeRoomName(room)}</button>
                    ))}
                </div>
                <div id="message_container">
                    <div id="messages">
                        {messages && messages
                        .map((msg, index) => (
                            <p className="message" style={{ paddingTop: "0px", paddingLeft: "10px", paddingRight: "10px",color: msg.author === user? 'green':'red', textAlign: msg.author === user? 'right':'left'}} 
                            key ={index}>{msg.message}</p>
                            // <p className="message" style={{ paddingTop: "0px", paddingLeft: "10px", paddingRight: "10px",color: msg.author === user? 'green':'red', textAlign: msg.author === user? 'right':'left'}} 
                            // key ={index}>{msg.message} by {msg.author}</p>
                        ))}
                        <div ref={newMsg}/>
                    </div >
                    <div>{tempCurRoom !== "" && (
                        <div id="sending_message">
                        <input id="message_input_field" placeholder="Message..." value={message} onChange={(e) => {
                        setMessage(e.target.value);
                        }}/>
                        <button id="send_message_button" onClick={() => sendMessage(tempCurRoom)}> Send </button>
                        </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Message;
