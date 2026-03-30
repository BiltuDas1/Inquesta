import { Link } from "react-router";
import "../scss/homepage.scss"

function Home() {
  const topics = ["Robotics", "Coding", "Science", "AI Art", "Electronics", "Problem Solving", "IoT"];
  const schools = ["Delhi Public School", "Kendriya Vidyalaya", "Ryan International", "DAV Schools", "Amity Group", "+ 1,200 more"];

  return (
    <div className="home-container">
      <nav>
        <div className="nav1">
          <h2>inquesta<span>.org</span></h2>
          <div className="nav1-links">
            <Link to="/courses" className="courses-link">Courses</Link>
            <span>Programs</span>
            <span>Resources</span>
            <span>Community</span>
            <span>About</span>
            <Link to="/register" className="login-link">Login</Link>
            <button className="get-started">Get Started Free</button>
          </div>
        </div>
        <div className="nav2">
          <ul>
            {topics.map((topic, index) => (
              <li key={topic} className={index === 0 ? "selected" : ""}>{topic}</li>
            ))}
          </ul>
        </div>
      </nav>

      <main className="hero">
        <div className="hero-content">
          <span className="badge">INDIA'S #1 STEM EDTECH PLATFORM</span>
          <h1>Learn. <br/> Build. <br/> <span>Innovate.</span></h1>
          <p>Hands-on STEM courses for K-12 students across India. <br/> 
             From PictoBlox to Arduino — discover, create, and grow.</p>
          
          <div className="hero-btns">
            <button className="btn-primary">▶ Start Learning Free</button>
            <button className="btn-secondary">Explore Kits</button>
          </div>

          <div className="stats-grid">
            <div className="stat-item">
              <h2>50K+</h2>
              <p>Students enrolled</p>
            </div>
            <div className="stat-item">
              <h2>1,200+</h2>
              <p>Schools partnered</p>
            </div>
            <div className="stat-item">
              <h2>120+</h2>
              <p>Courses & kits</p>
            </div>
            <div className="stat-item">
              <h2>4.8★</h2>
              <p>Average rating</p>
            </div>
          </div>
        </div>

        <div className="dashboard-preview">
          <div className="glass-card">
            <h3>YOUR LEARNING DASHBOARD</h3>
            <div className="course-item">
              <div className="course-info">
                <span>Robotics with PictoBlox</span>
                <small>Module 4 of 8 • 65% complete</small>
              </div>
              <div className="progress-bar"><div className="fill" style={{width: '65%'}}></div></div>
            </div>
            <div className="course-item">
              <div className="course-info">
                <span>Arduino Fundamentals</span>
                <small>Module 2 of 6 • 33% complete</small>
              </div>
              <div className="progress-bar"><div className="fill" style={{width: '33%'}}></div></div>
            </div>
            <div className="course-item">
              <div className="course-info">
                <span>AI & Creative Coding</span>
                <small>Not started • Enrolled</small>
              </div>
              <div className="progress-bar"><div className="fill" style={{width: '0%'}}></div></div>
            </div>
            <div className="card-footer">
              <span>🔥 7-day streak!</span>
              <span className="next">Next: Continue Robotics →</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="trusted-by">
        <span>TRUSTED BY SCHOOLS</span>
        {schools.map(school => (
          <span key={school} className="school-name">{school}</span>
        ))}
      </footer>
    </div>
  )
}

export default Home;