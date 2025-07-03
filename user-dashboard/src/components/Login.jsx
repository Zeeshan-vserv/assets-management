import React, { useState } from "react";
import loginImg from "../assets/loginImg.png"
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../action2/AuthAction2";

const Login = () => {

  const dispatch = useDispatch()
  const [formData, setFormData] = useState({ emailAddress: "", password: ""})

  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await dispatch(login(formData));
    if (response.success) {
      navigate('/main');
    } else {
      // handle error
    }
  } catch (err) {
    console.log(err);
  }
};
  return (
    <div className="max-w-[100vw] h-[100vh] bg-slate-800 flex items-center justify-center">
    <div className="w-[100%] p-24 flex items-center justify-between">
      {/* Image Section */}
      <div>
        <img
  src={loginImg || undefined}
  className="loginImg w-[35vw] object-cover animate-pop-up-top max-lg:hidden"
  alt="Login"
/>
      </div>

      {/* Form Section */}
      <div className="flex flex-col items-center gap-10 py-14 px-8 bg-slate-50 shadow-lg rounded-xl max-sm:w-[85%]">
        <div className="text-4xl font-semibold text-center">Assets Management</div>

        {/* Error Display */}
        {/* {<div className="text-red-500 text-sm">"Error"</div>} */}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-[100%]">
          {/* Email Input */}
          <input
            type="email"
            name="emailAddress"
            placeholder="Email"
            value={formData.emailAddress}
            onChange={handleChange}
            required
            className="p-3 w-[100%] text-black bg-slate-200 border-none outline-none rounded-md"
          />

          {/* Password Input */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="p-3 w-[100%] text-black bg-slate-200 border-none outline-none rounded-md"
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="p-2 w-[100%] bg-green-400 text-white font-semibold rounded-md"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  </div>
  );
};

export default Login;
