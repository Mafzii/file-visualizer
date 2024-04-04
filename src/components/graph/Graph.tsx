import React, { useState } from "react";

const Graph: React.FC<object> = () => {
  const [source, setSource] = useState<string>("");
  const sourceHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSource(event.target.value);
  };

  return (
    <div>
      <div className="flex justify-center">
        <label className="input input-primary input-bordered flex items-center gap-2">
          <input
            type="text"
            className="grow"
            placeholder="Source"
            value={source}
            onChange={sourceHandler}
          />
          <kbd className="kbd kbd-sm">⌘</kbd>
          <kbd className="kbd kbd-sm">K</kbd>
        </label>
      </div>
    </div>
  );
};

export default Graph;
