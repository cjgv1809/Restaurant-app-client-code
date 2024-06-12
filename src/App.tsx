import { Route, Routes } from "react-router";
import Orders from "./components/Orders";
import Menu from "./components/Menu";
import Dishes from "./components/Dishes";
import Sidebar from "./ui/Sidebar";
import firebase, { FirebaseContext } from "./firebase";
import "flowbite/dist/flowbite.min.js";

function App() {
  return (
    <main className="flex flex-col h-screen sm:gap-4 sm:flex-row">
      <FirebaseContext.Provider value={{ firebase }}>
        <Sidebar />

        <Routes>
          {/* Routes go here */}
          <Route path="/" element={<Orders />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/new-dish" element={<Dishes />} />
        </Routes>
      </FirebaseContext.Provider>
    </main>
  );
}

export default App;
