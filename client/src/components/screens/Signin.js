import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import M from "materialize-css";
import { UserContext } from "../../App";

const Signin = () => {
  const { state, dispatch } = useContext(UserContext);
  const navigate = useNavigate(); // Use useNavigate hook for programmatic navigation
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const PostData = () => {
    if (
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      M.toast({
        html: "Invalid Email",
        classes: "#6a1b9a purple darken-3",
      });
      return;
    }
    fetch("/signin", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: password,
        email: email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.error) {
          M.toast({ html: data.error, classes: "#6a1b9a purple darken-3" });
        } else {
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          dispatch({ type: "USER", payload: data.user });
          M.toast({
            html: "signedin successfully",
            classes: "#673ab7 deep-purple",
          });
          navigate("/"); // Use navigate to redirect to "/signin"
        }
      })
      .catch((err) => {
        console.error("Error sending data to server:", err);
      });
  };

  return (
    <div className="mycard">
      <div className="card auth-card input-field ">
        <h2>PhotoWall</h2>
        <input
          type="text"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></input>
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        <button
          className="btn waves-effect waves-light #d500f9 purple accent-3"
          onClick={() => PostData()}
        >
          Login
        </button>
        <h5>
          <Link to="/signup">Don't have an account?</Link>
        </h5>
      </div>
    </div>
  );
};

export default Signin;
