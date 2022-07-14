import React, { Fragment, useEffect, useState } from "react";
import "./App.css";
import Header from "./Header";
import Card from "./Card";
import Chats from "./Chats";
import Chatscreen from "./Chatscreen";
import Login from "./Login";
import HeaderLogin from "./HeaderLogin";
import CreateForm from "./CreateForm";
import Pusher from "pusher-js";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import axios from "./axios";
import Profile from "./Profile";

function App() {
  const [messages, setMessages] = useState([]);
  const id = localStorage.getItem("id");
  useEffect(() => {
    console.log("id", id);
    axios.get("/messages/all").then((response) => {
      setMessages(response.data);
    });
  }, []);

  const [isDesktop, setDesktop] = useState(window.innerWidth > 780);

  const updateMedia = () => {
    setDesktop(window.innerWidth > 780);
  };

  useEffect(() => {
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  });
  useEffect(() => {
    console.log("Invoked ");
    const pusher = new Pusher("63390f503a0e27874464", {
      cluster: "mt1",
    });

    const channel = pusher.subscribe("messages");
    channel.bind("inserted", (data) => {
      // alert(JSON.stringify(data));
      setMessages([...messages, data]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [messages]);

  return (
    <Router>
      <Routes>
        <Route
          exact
          path="/signup/create"
          element={
            <Fragment>
              {" "}
              <div className="body-form">
                <HeaderLogin />
                <CreateForm />
              </div>
            </Fragment>
          }
        />

        <Route
          exact
          path="/profile"
          element={
            <Fragment>
              <Header />
              <Profile />
            </Fragment>
          }
        />

        <Route
          exact
          path="/login"
          element={
            <Fragment>
              <HeaderLogin />
              <Login choice="login" />
            </Fragment>
          }
        />

        {/* </Route> */}

        <Route
          exact
          path="/signup"
          element={
            <Fragment>
              {" "}
              <HeaderLogin />
              <Login choice="signup" />
            </Fragment>
          }
        />

        <Route
          exact
          path="/chat/:roomId"
          element={
            <Fragment>
              {isDesktop ? (
                <>
                  <Header backpath="/" />
                  <div className="app">
                    <div className="app_body">
                      <Chats />
                      <Chatscreen messages={messages} />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Header backpath="/chat" />
                  <div className="app">
                    <div className="app_body">
                      <Chatscreen messages={messages} />
                    </div>
                  </div>
                </>
              )}
            </Fragment>
          }
        />

        <Route
          exact
          path="/chat"
          element={
            <Fragment>
              <Header backpath="/" />
              <div className="app">
                <div className="app_body">
                  <Chats />
                  {isDesktop ? <div className="nochat"></div> : <></>}
                </div>
              </div>
            </Fragment>
          }
        />
        <Route
          exact
          path="/"
          element={
            <Fragment>
              <Header />
              <Card />
            </Fragment>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
