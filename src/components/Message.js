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
        await socket.emit("join_room", tempCurRoom);
        fetchMsg(tempCurRoom);
    };

    const sendMessage = async (room) => {
        await socket.emit("send_message", {message: message, givRoom: room, author: user});
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
        await socket.emit("join_room", room);
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
                });
                
            }
            
        } catch (error) {
                console.log(error);
        }
    }
    useEffect(() => {
        socket.on("receive_message", async(data) => {
            if (data !== ""){
                await fetchMsg(data);
            }
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
