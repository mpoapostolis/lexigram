import axios from "axios";
import clsx from "clsx";
import { useEffect, useState } from "react";
import Keyboard from "../Keyboard";
const lexigram = ["εβδομάδα", "έτος", "σήμερα", "αύριο", "χθες", "ημερολόγιο"];

function Lexigram() {
  const [lexigram, setLexigram] = useState<string[]>([]);
  useEffect(() => {
    axios.get("/api/getWords").then((d) => setLexigram(d.data));
  }, []);
  const normalizeLexi = lexigram?.map((s) =>
    s
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase()
  ) ?? [""];
  const groups = new Set<number>();
  normalizeLexi.map((e) => groups.add(e.length));

  const arr = normalizeLexi ?? [""];
  const max = Math.max(...arr?.map((e) => e.length));
  const [wordd, setWord] = useState<string[]>([]);
  const [correct, setCorrect] = useState<Record<string, boolean>>({});
  return (
    <div className="select-none  h-screen justify-center w-screen flex">
      <div className="p-10 max-w-2xl w-full shadow-inner  border flex flex-col h-full ">
        <div className="grid mt-10 grid-cols-2 gap-4">
          {Array.from(groups)
            .sort((a, b) => a - b)
            .map((c) => (
              <div className="flex flex-col">
                <label className="text-xs font-bold mb-2">{c} letters</label>
                <div>
                  {normalizeLexi
                    .filter((e) => e.length === c)

                    .map((word) => (
                      <div key={word} className="flex mb-1">
                        {word.split("").map((e, idx) => {
                          const isCorrect = correct[word] || wordd[idx] === e;
                          return (
                            <div
                              key={idx}
                              className={clsx(
                                "shadow text-gray-700 shadow-gray-500 bg-black bg-opacity-5  w-6  h-6 font-bold text-xs rounded-sm mr-1 flex items-center justify-center text-center ",
                                {
                                  "bg-gray-800  bg-opacity-80": isCorrect,
                                }
                              )}
                            >
                              {isCorrect && e}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                </div>
              </div>
            ))}
        </div>
        <div className="mt-auto" />
        <div
          className={clsx(
            "flex h-16 items-center mt-10 justify-center shadow-inner border-b p-3 gap-x-3 rounded-xl w-full"
          )}
        >
          {wordd.map((char, idx) => (
            <div
              key={idx}
              className={`shadow shadow-gray-500 bg-black bg-opacity-5 
              rounded-xl hover:scale-90 uppercase h-12 w-12 p-3 font-black  text-center
              text-gray-700`}
            >
              {char.toUpperCase()}
            </div>
          ))}
        </div>
        <br />{" "}
        <Keyboard
          onKeyPress={(e) => {
            if (!wordd) return;
            if (e === "Enter") {
              const word = wordd.join("");
              if (normalizeLexi?.includes(word)) {
                setWord([]);
                setCorrect((s) => ({ ...s, [word]: true }));
              }
              return;
            }
            if (wordd.length === max && e !== "Backspace") return;
            setWord((s) => {
              const tmp = [...s];
              if (e === "Backspace") {
                tmp.pop();
                return tmp;
              } else return [...s, e.toUpperCase()];
            });
          }}
        />
      </div>
    </div>
  );
}

export default Lexigram;
