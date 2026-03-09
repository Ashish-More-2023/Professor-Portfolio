import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Research from "./components/Research";
import Footer from "./components/Footer";
import Lab from "./components/Lab";
import Teaching from "./components/Teaching";
import Resume from "./components/Resume";
import PublicationsPage from "./components/PublicationsPage";
import PatentsPage from "./components/PatentsPage";
import Outreach from "./components/Outreach";
import ComputationalTools from "./components/ComputationalTools";
import Industry from "./components/Industry";

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/research" element={<Research />} />
            <Route path="/MID-lab" element={<Lab />} />
            <Route path="/teaching" element={<Teaching />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/publications" element={<PublicationsPage />} />
            <Route path="/patents" element={<PatentsPage />} />
            <Route path="/outreach" element={<Outreach />} />
            <Route path="/computational-tools" element={<ComputationalTools />} />
            <Route path="/industry" element={<Industry />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </>
  );
}

export default App;
