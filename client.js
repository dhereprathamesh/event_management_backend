import { io } from "socket.io-client";
const socket = io("http://localhost:8080");

const [events, setEvents] = useState([
	
]);

useEffect(() => {
    socket.io("attendeeCount", ({ eventId, count }) => {
        setEvents((prevEvents) => 
            prevEvents.map((event) => 
                event.id === eventId ? { ...event, count } : event
            )
        );
    });

    return () => {
        socket.off("attendeeCount");
    }
}, []);

const joinEvent = (eventId) => {
    socket.emit("joinEvent", eventId);
}

const leaveEvent = (eventId) => {
    socket.emit("leaveEvent", eventId);
}