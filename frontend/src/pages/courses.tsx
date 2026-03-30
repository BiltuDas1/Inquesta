import { Link } from "react-router";
import "../scss/courses.scss";

function Courses() {
  const categories = [
    { name: "Grade Level", options: ["Grade 3-5", "Grade 6-8", "Grade 9-10", "Grade 11-12"] },
    { name: "Subject", options: ["Robotics", "Coding", "AI / ML", "Electronics", "IoT"] },
    { name: "Format", options: ["Self-paced", "Live Batches", "Kit Bundled"] }
  ];

  const courses = [
    {
      id: 1,
      title: "Robotics with PictoBlox",
      grade: "Grade 5-8",
      rating: "4.98",
      students: "240",
      hours: "24",
      price: "1,499",
      tag: "BESTSELLER",
      theme: "robotics-theme"
    },
    {
      id: 2,
      title: "Smart Robots with Sensors",
      grade: "Grade 6-9",
      rating: "4.84",
      students: "100",
      hours: "20",
      price: "2,499",
      tag: "KIT BUNDLE",
      theme: "sensors-theme"
    }
  ];

  return (
    <div className="courses-page">
      <header className="courses-hero">
        <nav className="minimal-nav">
          <Link to="/" className="logo">inquesta<span>.org</span></Link>
          <div className="nav-links">
            <Link to="/courses">Courses</Link>
            <span>Programs</span>
            <span>Resources</span>
            <Link to="/register">Login</Link>
          </div>
        </nav>
        
        <div className="hero-content">
          <h1>Explore All Courses</h1>
          <p>124 courses across Robotics, Coding, AI, Electronics & more · Grades 3-12</p>
          <div className="search-container">
            <input type="text" placeholder="Search courses, topics, kits..." />
            <button className="search-btn">Search</button>
          </div>
        </div>
      </header>

      <div className="courses-layout">
        <aside className="sidebar">
          {categories.map(cat => (
            <div key={cat.name} className="filter-section">
              <h4>{cat.name.toUpperCase()}</h4>
              {cat.options.map(opt => (
                <label key={opt} className="checkbox-label">
                  <input type="checkbox" /> {opt}
                </label>
              ))}
            </div>
          ))}
          <div className="filter-section">
            <h4>PRICE</h4>
            <input type="range" className="price-slider" />
            <div className="price-range"><span>₹0</span><span>₹5,000</span></div>
          </div>
        </aside>

        <main className="results-area">
          <div className="results-toolbar">
            <div className="active-query">
              <h2>56 results for <span>"Robotics, Grade 3-8, ★4.5+"</span></h2>
              <div className="tags">
                <span className="tag">Robotics ✕</span>
                <span className="tag">Grade 3-5 ✕</span>
                <button className="clear-btn">Clear all</button>
              </div>
            </div>
            <select className="sort-select">
              <option>Sort: Most Popular</option>
            </select>
          </div>

          <div className="course-cards-list">
            {courses.map(course => (
              <div key={course.id} className="course-card-horizontal">
                <div className={`card-banner ${course.theme}`}>
                  <span className="status-badge">{course.tag}</span>
                </div>
                <div className="card-body">
                  <div className="card-info">
                    <h3>{course.title}</h3>
                    <span className="grade-label">{course.grade}</span>
                    <div className="card-meta">
                      <span>★ {course.rating}</span>
                      <span>{course.students} students</span>
                      <span>{course.hours} hrs</span>
                    </div>
                  </div>
                  <div className="card-pricing">
                    <span className="price">₹{course.price}</span>
                    <button className="enroll-btn">Enroll</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Courses;