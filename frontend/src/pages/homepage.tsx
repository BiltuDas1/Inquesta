import "../scss/homepage.scss"

function Home() {
  return (
    <>
      <nav>
        <div className="nav1">
          <h2>inquesta<span>.org</span></h2>
        </div>
        <div className="nav2">
          <ul>
            <li className="selected">Robotics</li>
            <li>Coding</li>
            <li>Science</li>
            <li>AI Art</li>
            <li>Electronics</li>
            <li>Problem Solving</li>
            <li>IoT</li>
          </ul>
        </div>
      </nav>
      <main></main>
    </>
  )
}

export default Home;
