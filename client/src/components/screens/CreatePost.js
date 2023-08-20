import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import M from "materialize-css";

const CreatePost = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState(null);
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (url) {
      fetch("/createpost", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          title,
          body,
          pic: url,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data.error) {
            M.toast({ html: data.error, classes: "#6a1b9a purple darken-3" });
          } else {
            M.toast({
              html: "Post Created Successfully",
              classes: "#673ab7 deep-purple",
            });
            navigate("/"); // Use navigate to redirect to "/signin"
          }
        })
        .catch((err) => {
          console.error("Error sending data to server:", err);
        });
    }
  }, [url]);

  const postDetails = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "Photowall");
    data.append("cloud_name", "phtwl");

    fetch("https://api.cloudinary.com/v1_1/phtwl/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setUrl(data.url);
        // Do something with the response data, e.g., save the post with the Cloudinary URL
      })
      .catch((err) => {
        setError("Failed to upload the image. Please try again later.");
        console.error(err);
      });
  };

  return (
    <div
      className="card input-filed"
      style={{
        margin: "30px auto",
        maxWidth: "500px",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <input
        type="text"
        placeholder="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <div className="file-field input-field">
        <div className="btn waves-effect waves-light #d500f9 purple accent-3">
          <span>Upload Image</span>
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        </div>
        <div className="file-path-wrapper">
          <input className="file-path validate" type="text" />
        </div>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button
        className="btn waves-effect waves-light #d500f9 purple accent-3"
        onClick={() => postDetails()}
      >
        Upload Post
      </button>
    </div>
  );
};

export default CreatePost;
