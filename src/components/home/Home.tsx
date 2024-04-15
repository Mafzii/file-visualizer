import React from "react";
import Graph from "../graph/Graph";
import Navbar from "../navbar/Navbar";

function Home() {
  return (
    <div className="bg-base-100 w-full h-full">
      <h1 className="text-3xl font-bold">fileWiz 🪄</h1>
      <main className="flex">
        <section id="navbar" className="">
          <Navbar />
        </section>
        <section id="graph" className="">
          <Graph />
        </section>
      </main>
    </div>
  );
}

export default Home;
