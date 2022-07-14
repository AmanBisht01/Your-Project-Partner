import mongoose from "mongoose";
import Pusher from "pusher";
import dotenv from "dotenv";

dotenv.config();

const mongoUrl = process.env.MONGO_URL;
mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((e) => {
    console.log("Error " + e);
  });

const db = mongoose.connection;

const pusher = new Pusher({
  appId: process.env.appId,
  key: process.env.key,
  secret: process.env.secret,
  cluster: process.env.cluster,
  useTLS: true,
});

db.once("open", () => {
  console.log("DB connected");
  const msgCOllection = db.collection("messages");
  const changeStream = msgCOllection.watch();
  changeStream.on("change", (change) => {
    if (change.operationType === "insert") {
      const messageDetails = change.fullDocument;
      pusher.trigger("messages", "inserted", {
        sender: messageDetails.sender,
        receiver: messageDetails.receiver,
        message: messageDetails.message,
        timestamp: messageDetails.timestamp,
        received: messageDetails.received,
      });
    } else {
      console.log("Error occured in pushing");
    }
  });
});
