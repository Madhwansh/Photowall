import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../App";
import { Link } from "react-router-dom";

const Home = () => {
  const [data, setData] = useState([]);
  const { state } = useContext(UserContext);

  useEffect(() => {
    fetch("/getsubpost", {
      headers: {
        Authorization: localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setData(result.posts);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
  }, []);

  const likePost = (id) => {
    fetch("/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const updatedData = data.map((item) =>
          item._id === result._id ? result : item
        );
        setData(updatedData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const unlikePost = (id) => {
    fetch("/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const updatedData = data.map((item) =>
          item._id === result._id ? result : item
        );
        setData(updatedData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const makeComment = (text, postId) => {
    fetch("/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId,
        text,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const updatedData = data.map((item) =>
          item._id === result._id ? result : item
        );
        setData(updatedData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deletePost = (postid) => {
    fetch(`/deletepost/${postid}`, {
      method: "delete",
      headers: {
        Authorization: localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log("Delete Post Response:", result); // Add this line
        const newData = data.filter((item) => {
          return item._id !== postid; // Change result._id to postid
        });
        setData(newData);
      })
      .catch((error) => {
        console.error("Error deleting post:", error);
      });
  };

  return (
    <div className="home">
      {data.map((item) => (
        <div className="card home-card" key={item._id}>
          <h5>
            <Link
              to={
                item.postedBy._id !== state._id
                  ? "/profile/" + item.postedBy._id
                  : "/profile/"
              }
            >
              {item.postedBy.name}
            </Link>

            {item.postedBy._id == state._id && (
              <i
                className="material-icons"
                style={{ float: "right" }}
                onClick={() => deletePost(item._id)}
              >
                delete
              </i>
            )}
          </h5>
          <div className="card-image">
            <img src={item.photo} alt="Post" />
          </div>
          <div className="card-content">
            <i className="material-icons" style={{ color: "red" }}>
              favorite
            </i>
            {item.likes.includes(state._id) ? (
              <i
                className="material-icons"
                onClick={() => {
                  unlikePost(item._id);
                }}
              >
                thumb_down
              </i>
            ) : (
              <i
                className="material-icons"
                onClick={() => {
                  likePost(item._id);
                }}
              >
                thumb_up
              </i>
            )}
            <h6>{item.likes.length} likes</h6>
            <p>{item.body}</p>
            {item.comments.map((record) => (
              <h6 key={record._id}>
                <span style={{ fontWeight: "500" }}>
                  {record.postedBy.name}
                </span>{" "}
                {record.text}
              </h6>
            ))}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                makeComment(e.target[0].value, item._id);
              }}
            >
              <input type="text" placeholder="add a comment" />
            </form>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;
