import { useState } from "react";
import "../scss/register.scss";

function Register() {
  const loginTypes = ["student", "teacher", "parent"];
  const [login, setLogin] = useState("student");

  return (
    <main>
      <div className="left">
        <div className="about">
          <h2>inquesta<span>.org</span></h2>
          <h1>Learn STEM. Build <span>India's</span> Future.</h1>
          <p>Join 50,000+ students learning Robotics, Coding, AI and Electronics through hands-on kits and world-class courses.</p>
        </div>
      </div>
      <div className="right">
        <h1>Welcome back</h1>
        <p>Sign in to continue your learning journey</p>
        <form method="POST">
          <div className="typeOfLogin">
            {loginTypes.map((types) => (
              <label 
                key={types}
                className={login === types ? "selected" : ""}
              >
                <input 
                  type="radio"
                  name="loginType"
                  value={types}
                  checked={login === types}
                  onChange={(e) => setLogin(e.target.value)} hidden />
                {types}
              </label>
            ))}
          </div>
          <label>Email or Phone
            <input id="email" type="email" name="email" />
          </label>
          <label >Password
            <input id="password" type="password" name="password" />
          </label>
          <button type="submit">Sign In</button>
        </form>
      </div>
    </main>
  )
}

export default Register;