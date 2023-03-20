import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import "font-awesome/css/font-awesome.min.css";
import "react-toastify/dist/ReactToastify.css";
import reportWebVitals from "./reportWebVitals";
import SpreadSheetPage from "Pages";
import { ToastContainer } from "react-toastify";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

// On Mobile, say not optimized
root.render(
  <React.StrictMode>
    <div className="d-none d-md-block">
      <SpreadSheetPage />
    </div>
    <div className="d-sm-block d-md-none">
      <p> Site not optimized for Mobile</p>
    </div>
    <ToastContainer />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
