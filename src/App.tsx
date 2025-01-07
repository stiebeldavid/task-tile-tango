import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import DeepWork from "./pages/DeepWork";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/deep-work" element={<DeepWork />} />
      </Routes>
    </Router>
  );
}

export default App;