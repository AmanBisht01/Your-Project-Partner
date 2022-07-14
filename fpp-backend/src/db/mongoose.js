import mongoose from "mongoose";
import Pusher from "pusher";

const mongoUrl =
  "mongodb+srv://aman:aman@cluster0.v3g1r.mongodb.net/FPP?retryWrites=true&w=majority";
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
  appId: "1437079",
  key: "63390f503a0e27874464",
  secret: "52351d8662222db362a5",
  cluster: "mt1",
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
