import React, { useEffect, useRef, useState } from "react";
import Canvas from "../canvas/Canvas";

const Graph: React.FC<object> = () => {
  // state
  const [source, setSource] = useState<string>("");
  const [results, setResults] = useState<string[]>([]);

  // focus
  const inputRef = useRef<HTMLInputElement>(null);

  // add all initial setup here
  useEffect(() => {
    document.addEventListener("keydown", (event) => {
      if (event.metaKey && event.key === "k") {
        inputRef.current?.focus();
      }
    });
  }, []);

  // handlers
  const sourceHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSource(event.target.value);
  };
  const searchHandler = () => {
    if (!source) return;
    window.fileUtils.readdir(
      source,
      (err: string, filePaths: React.SetStateAction<string[]>) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log(window.fileUtils.resolve(source));
        setResults(filePaths);
      }
    );
  };
  const fileDialogHandler = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    const pathFromDialog = await window.fileUtils.dialog.showOpenDialog();
    if (pathFromDialog) {
      setSource(String(pathFromDialog));
    }
  };

  // render
  return (
    <div className="w-full">
      <form
        action="#"
        onSubmit={(e) => e.preventDefault()} // prevent reloading on first submit
        className="flex h-[15vh] p-3"
      >
        <label className="input input-bordered flex items-center gap-2">
          <input
            type="text"
            className="grow"
            placeholder="Source"
            value={source}
            onChange={sourceHandler}
            ref={inputRef}
          />
          <kbd className="kbd kbd-sm">⌘</kbd>
          <kbd className="kbd kbd-sm">K</kbd>
        </label>
        <button
          id="search"
          className="btn btn-primary ms-2"
          onClick={searchHandler}
        >
          Search
        </button>
        <button className="btn btn-secondary ms-2" onClick={fileDialogHandler}>
          Open
        </button>
      </form>
      <section id="canvas" className="border-secondary border-solid h-[85vh]">
        <Canvas />
      </section>
    </div>
  );
};

export default Graph;
