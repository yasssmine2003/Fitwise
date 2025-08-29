import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { register } from "../../services/authService";

export default function Register() {
  const [userData, setUserData] = useState({ username: "", email: "", password: "" }); // Ajout de username
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [redirectToLogin, setRedirectToLogin] = useState(false);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await register(userData);
      if (response.data.success) {
        setRedirectToLogin(true);
      } else {
        setError(response.data.message || "Erreur lors de l'inscription.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'inscription.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (redirectToLogin) {
    return <Redirect to="/auth/login" />;
  }

  return (
    <div className="container mx-auto px-4 h-full">
      <div className="flex content-center items-center justify-center h-full">
        <div className="w-full lg:w-6/12 px-4">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-green-300 border-4">
            <div className="rounded-t mb-0 px-6 py-6">
              <div className="text-center mb-3">
                <h6 className="text-black-500 text-sm font-bold">Sign up with</h6>
              </div>
              <div className="btn-wrapper text-center">
                <button
                  className="bg-white active:bg-blueGray-50 text-blueGray-700 font-bold px-4 py-2 rounded outline-none focus:outline-none mr-2 mb-1 uppercase shadow hover:shadow-md inline-flex items-center text-xs ease-linear transition-all duration-150"
                  type="button"
                >
                  <img alt="..." className="w-5 mr-1" src={require("assets/img/github.svg").default} />
                  Github
                </button>
                <button
                  className="bg-white active:bg-blueGray-50 text-blueGray-700 font-normal px-4 py-2 rounded outline-none focus:outline-none mr-1 mb-1 uppercase shadow hover:shadow-md inline-flex items-center text-xs ease-linear transition-all duration-150"
                  type="button"
                >
                  <img alt="..." className="w-5 mr-1" src={require("assets/img/google.svg").default} />
                  Google
                </button>
              </div>
              <hr className="mt-6 border-b-1 border-blueGray-300" />
            </div>
            <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
              <div className="text-blueGray-400 text-center mb-3 font-bold">
                <small>Or sign up with credentials</small>
              </div>
              {error && <div className="text-red-500 text-center mb-3">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="relative w-full mb-3">
                  <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="username">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={userData.username}
                    onChange={handleChange}
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    placeholder="Username"
                    required
                  />
                </div>
                <div className="relative w-full mb-3">
                  <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="email">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleChange}
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    placeholder="Email"
                    required
                  />
                </div>
                <div className="relative w-full mb-3">
                  <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="password">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={userData.password}
                    onChange={handleChange}
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    placeholder="Password"
                    required
                  />
                </div>
                <div>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      id="customCheckLogin"
                      type="checkbox"
                      className="form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                      required
                    />
                    <span className="ml-2 text-sm font-semibold text-blueGray-600">
                      I agree with the{" "}
                      <a href="#pablo" className="text-lightBlue-500" onClick={(e) => e.preventDefault()}>
                        Privacy Policy
                      </a>
                    </span>
                  </label>
                </div>
                <div className="text-center mt-6">
                  <button
                    className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Inscription..." : "Create Account"}
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="flex flex-wrap mt-6 relative">
            <div className="w-1/2">
              <Link to="/auth/forget" className="text-blueGray-600">
                <small>Forgot password?</small>
              </Link>
            </div>
            <div className="w-1/2 text-right">
              <Link to="/auth/login" className="text-blueGray-600">
                <small>Login</small>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}