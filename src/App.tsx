import React from "react";
import "./App.less";
import { routes } from "./config/routes";
import { renderRoutes } from "react-router-config";
import { BrowserRouter as Router } from "react-router-dom";

function App() {
  return (
    <>
      <Router>{renderRoutes(routes)}</Router>
    </>
  );
}

export default App;
