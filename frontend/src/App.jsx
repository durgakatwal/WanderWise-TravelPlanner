// import React, { useEffect } from "react";
// import { Button } from "./components/ui/button";
// import Navbar from "./components/Navbar";
// import { useEffect, useState } from "react";
// // import { CardDemo } from "./components/Card";
// import Hero from "./components/Hero";

// const App = () => {
//   const name = "Ram";
//   const age = 30;

//   const user = [
//     {
//       firstName: "Ram",
//       lastName: "Karki",
//       age: 30,
//       address: "Biratnagar",
//     },
//     {
//       firstName: "hari",
//     },
//   ];

//   const cardData = [
//     {
//       email: "durga@gmail.com",
//     },
//     {
//       email: "ram@gmail.com",
//     },
//   ];

//   // this is the use of useState in react
//   const [count, setCount] = useState(0);

//   useEffect(() => {
//     console.log("Inside useEffect");
//   });
//   return (
//     <>
//       <Navbar data={user} color={"red"} />
//       {/* <button>HTML Button</button>
//       <br />
//       {/* any js should be inside the curly braces */}
//       {/* <p>
//         {name} is {age}years old.
//         <br />
//         FirstName:{user.firstName} <br />
//         LastName:{user.lastName} <br />
//         Age:{user.age} <br />
//         Address:{user.address} <br />
//       </p>
//       <br />
//       {/* useState is implemented here  */}
//       {/* count:{count}
//       <br />
//       <Button
//         onClick={() => {
//           setCount(count + 1);
//         }}
//       >
//         Add
//       </Button> */}
//       <br />

//       <Hero />

//       {/* <div className="flex flex-wrap gap-6 ml-10"> */}
//       <div className="grid grid-cols-6 gap-4 ml-4 mr-4">
//         <CardDemo data={cardData} />
//         <CardDemo data={cardData} />
//         <CardDemo data={cardData} />
//         <CardDemo data={cardData} />
//         <CardDemo data={cardData} />
//         <CardDemo data={cardData} />
//       </div>
//     </>
//   );
// };

// export default App;

import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import SignUp from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import useAuth from "./hooks/useAuth";
import { jwtDecode } from "jwt-decode";
import AppLayout from "./components/layout/AppLayout";
import Trips from "./pages/Trips";
import Itinerary from "./pages/Itinerary";
import PackingList from "./pages/PackingList";
import AddTrip from "./pages/AddTrip";
import EditTrip from "./pages/EditTrip";
import TripInfo from "./pages/TripInfo";
import ItineraryPage from "./pages/Itinerary";
import AddItinerary from "./pages/AddItinerary";
import EditItinerary from "./pages/EditItinerary";
import AcceptInvitation from "./pages/AcceptInvitation";
// import Home from "./pages/Home";
// import About from "./pages/About";
// import Contact from "./pages/Contact";
// import Blog from "./pages/Blog";
// import SignUp from "./pages/Signup";
// import Login from "./pages/Login";
const App = () => {
  // const { token } = useAuth();
  // console.log("Auth token:", token);

  // const decodedToken = jwtDecode(token);
  // console.log("Decoded token:", decodedToken);

  const { token, logout } = useAuth();

  const ProtectedRoutes = () => {
    try {
      const decodedToken = token ? jwtDecode(token) : null;
      const userId = decodedToken?.userId;

      if (decodedToken && decodedToken.exp) {
        const currentTime = Date.now() / 1000;
        if (currentTime > decodedToken?.exp) {
          logout();
          return <Navigate to="/" />;
        }
      }

      if (!token || !userId) {
        logout();
        return <Navigate to="/" />;
      }

      return <AppLayout />;
    } catch (err) {
      console.error(err);
      logout();
      return <Navigate to="/login" />;
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Home />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="/contact" element={<Contact />}></Route>
        <Route path="/blog" element={<Blog />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<SignUp />}></Route> */}

        <Route path="/" element={<LandingPage />}></Route>
        <Route path="/signup" element={<SignUp />}></Route>
        <Route path="/login" element={<Login />}></Route>

        <Route element={<ProtectedRoutes />}>
          <Route path="/dashboard" element={<Dashboard />}></Route>
          <Route path="/trips" element={<Trips />}></Route>
          <Route path="/itineraries" element={<Itinerary />}></Route>

          <Route path="/trips/add" element={<AddTrip />}></Route>
          <Route path="/trips/edit/:id" element={<EditTrip />}></Route>
          <Route
            path="/trips/:id/invite/accept"
            element={<AcceptInvitation />}
          ></Route>
          <Route path="/trips/:id" element={<TripInfo />}></Route>
          <Route path="/packing" element={<PackingList />}></Route>
          <Route path="/itineraries" element={<ItineraryPage />}></Route>
          <Route path="/itineraries/add" element={<AddItinerary />}></Route>
          <Route
            path="/itineraries/edit/:id"
            element={<EditItinerary />}
          ></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
