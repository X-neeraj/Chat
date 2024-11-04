import express,{Request,Response} from "express";
import { createServer } from "http";
import { Server, Socket } from 'socket.io';
import cors from 'cors'; 

const app=express();
const httpServer = createServer(app);



app.use(express.json());
app.use(cors());

const io = new Server(httpServer,{
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true
  }
});


io.on('connection', (socket:Socket) => {
    socket.on('joinRoom', (room:any) => {
        socket.join(room);
    });
    console.log('User connected:', socket.id);
    socket.on('sendMessage', (data) => {
        console.log(data)
        const {room,content} =data;
        io.to(room).emit("receiveMessage",{message:content});
    });
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
});

app.use("*",(req:Request,res:Response)=>{
    res.json({hello:"hello"})
})
httpServer.listen(3000,()=>{
    console.log("server started")
})