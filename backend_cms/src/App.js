import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import axios from "axios";

import About from './layouts/About';

const devApiBaseUrl = "http://localhost:5000";
const prodApiBaseUrl = "https://express-routing-2-sites.herokuapp.com";

axios.defaults.baseURL =
  process.env.NODE_ENV === "development" ? devApiBaseUrl : prodApiBaseUrl;

export default function App() {
  return (
    <Router basename="/backstage">
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/users">Users</Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/users">
            <Users />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

const Home = () => {
  const [imgSrc, setImgSrc] = useState();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const axiosRequestConfig = {
      responseType: "blob",
    };

    const response = await axios.get("/api/img", axiosRequestConfig);

    const type = response.headers["content-type"];
    const blob = response.data;

    /* Convert to file */
    const file = new File([blob], "123456", { type });
    const base64 = await toImageBase64Url(file);
    setImgSrc(base64);
  };

  const toImageBase64Url = (img) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;

      if (img instanceof File) {
        reader.readAsDataURL(img);
      }
    });
  };
  return (
    <>
      <h2>Home</h2>
      <img src={imgSrc} alt="IMG" />
    </>
  );
};

function Users() {
  return <h2>Users</h2>;
}
