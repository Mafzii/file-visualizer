import React, { useRef, useState } from "react";
import Graph from "../graph/Graph";
import Navbar from "../navbar/Navbar";

function Home() {
  const [tab, setTab] = useState("graph");
  const switchTab = (tabName: string) => setTab(tabName);
  return (
    <div className="bg-base-100 h-full w-full">
      <main className="flex h-full w-full">
        <Navbar switchTab={switchTab} />
        {tab === "graph" && <Graph />}
      </main>
    </div>
  );
}

export default Home;
