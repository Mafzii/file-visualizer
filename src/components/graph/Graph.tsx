import React, { useState } from "react";

const Graph: React.FC<object> = () => {
  const [source, setSource] = useState<string>("");
  const sourceHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSource(event.target.value);
  };
  const [results, setResults] = useState<string[]>([]);
  const searchHandler = () => {
    window.fs.readdir(
      source,
      (err: string, files: React.SetStateAction<string[]>) => {
        if (err) {
          console.error(err);
          return;
        }
        setResults(files);
      }
    );
  };

  return (
    <div>
      <div className="flex justify-center">
        <label className="input input-bordered flex items-center gap-2">
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
        <button className="btn btn-primary ms-2" onClick={searchHandler}>
          Search
        </button>
      </div>
      <div>
        {results && (
          <div>
            <p>{source}</p>
            <br />
            <div>
              {results.map((result, index) => (
                <div key={index}>
                  <p>{result}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Graph;
