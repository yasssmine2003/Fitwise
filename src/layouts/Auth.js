import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// components

import Navbar from "components/Navbars/AuthNavbar.js";

// views

import Login from "views/auth/Login.js";
import forget from "views/auth/forget";
import Register from "views/auth/Register.js";

export default function Auth() {
  return (
    <>
      <Navbar transparent />
      <main>
      <section className="relative w-full h-full py-40 min-h-screen">
  <div
    className="absolute top-0 w-full h-full bg-no-repeat bg-cover"
    style={{
      backgroundImage: `linear-gradient(to bottom, #a8e6cf, #f5f5dc, #d1c4e9), url(${require("assets/img/register_bg_2.png").default})`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
    }}
  ></div>

  <Switch>
    <Route path="/auth/login" exact component={Login} />
    <Route path="/auth/forget" exact component={forget} />
    <Route path="/auth/register" exact component={Register} />
    <Redirect from="/auth" to="/auth/login" />
  </Switch>

</section>

      </main>
    </>
  );
}
