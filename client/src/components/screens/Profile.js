import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";

const Profile = () => {
  const [mypics, setPics] = useState([]);
  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    fetch("/mypost", {
      headers: {
        Authorization: localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setPics(result.mypost);
      });
  }, []);

  return (
    <div style={{ maxWidth: "550px", margin: "0px auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          margin: "18px 0px",
          borderBottom: "1px solid grey",
        }}
      >
        <div>
          <img
            style={{ width: "160px", height: "160px", borderRadius: "80px" }}
            src="https://plus.unsplash.com/premium_photo-1674507923625-90409acdb8d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80"
            alt="Profile"
          />
        </div>
        <div>
          <h4>{state ? state.name : "Loading..."}</h4>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "108%",
            }}
          >
            <h6>{mypics ? mypics.length : 0} Posts</h6>
            <h6>
              {state && state.followers ? state.followers.length : 0} Followers
            </h6>
            <h6>
              {state && state.following ? state.following.length : 0} Following
            </h6>
          </div>
        </div>
      </div>
      <div className="gallery">
        {mypics.map((item) => (
          <img
            key={item._id}
            className="item"
            src={item.photo}
            alt={item.title}
          />
        ))}
      </div>
    </div>
  );
};

export default Profile;
