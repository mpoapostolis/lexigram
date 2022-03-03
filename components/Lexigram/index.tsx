import axios from "axios";
import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import Keyboard from "../Keyboard";

function Lexigram() {
  const [lexigram, setLexigram] = useState<string[]>([]);
  const [count, setCount] = useState(0);
  const [found, setFound] = useState<Record<string, boolean>>({});

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
  const [history, setHistory] = useState<
    {
      correct: boolean;
      word: string;
    }[]
  >([]);

  const howManyLetter = useMemo(
    () =>
      lexigram
        .map((e) => e.length)
        .reduce((acc, curr) => {
          // @ts-ignore
          return { ...acc, [curr]: !isNaN(acc[curr]) ? acc[curr] + 1 : 1 };
        }, {}),
    [lexigram]
  );

  const foundTotalLetter = useMemo(
    () =>
      Object.keys(found)
        .map((e) => e.length)
        .reduce((acc, curr) => {
          // @ts-ignore
          return { ...acc, [curr]: !isNaN(acc[curr]) ? acc[curr] + 1 : 1 };
        }, {}),
    [found]
  );

  return (
    <div className="select-none  h-screen justify-center w-screen flex">
      <div className="md:p-10 p-4 max-w-2xl w-full shadow-inner  border flex flex-col h-full ">
        <div className="text-3xl font-black text-clip w-full">Lexifun</div>
        <hr className="mt-2 border-black opacity-5" />
        <div className="grid mt-10 grid-cols-2 gap-4">
          {Array.from(groups)
            .sort((a, b) => a - b)
            .map((c, idx) => (
              <div key={idx} className="flex flex-col">
                <label
                  className={clsx("text-xs font-bold mb-2", {
                    // @ts-ignore
                    "opacity-20": howManyLetter[c] === foundTotalLetter[c],
                  })}
                >
                  {c} γράμματα
                </label>
                <div>
                  {normalizeLexi
                    .filter((e) => e.length === c)

                    .map((word) => (
                      <div
                        key={word}
                        className={clsx("flex mb-1", {
                          "opacity-30": found[word],
                        })}
                      >
                        {word.split("").map((e, idx) => {
                          let isCorrect1 = false;
                          history.map((h) => {
                            const arr = h.word.split("");
                            if (arr[idx] === e) isCorrect1 = true;
                          });
                          const isCorrect = correct[word] || isCorrect1;
                          return (
                            <div
                              key={idx}
                              className={clsx(
                                "shadow text-gray-700 shadow-gray-500 bg-black bg-opacity-5  w-6  h-6 font-bold text-xs rounded-sm mr-1 flex items-center justify-center text-center ",
                                {
                                  "bg-green-400  bg-opacity-20": isCorrect,
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
        <br />
        <div className=" mb-2 ">
          <div>
            <label className="text-sm text-gray-800 font-semibold mb-2">
              Ιστορίκο
            </label>
            <h5 className="text-gray-600  text-xs mt-1">
              💻 Πληκτρολογήσες : {count} φορές
            </h5>
          </div>
          <hr className="mt-2 border-black opacity-5" />

          <div className="mb-5 mt-2 opacity-50" />
          <ul className=" max-h-24 md:max-h-52 overflow-auto">
            {history.map((m, idx) => (
              <li
                className="mb-2 flex  text-gray-700 font-black text-xs"
                key={idx}
              >
                <span>{m.word}</span>
                <span className="ml-auto">{m.correct ? "✅" : "❌"}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-auto" />
        <div
          className={clsx(
            "flex md:h-16 h-12 items-center mt-10 justify-center shadow-inner border-b p-3 gap-x-3 rounded-xl w-full"
          )}
        >
          <div className="md:h-12 h-8" />
          {wordd.map((char, idx) => (
            <div
              key={idx}
              className={`shadow shadow-gray-500 bg-black bg-opacity-5 
              rounded hover:scale-90 uppercase md:h-10 md:w-12 md:p-3 w-8 h-8 p-2 text-xs   font-black  text-center
              text-gray-700`}
            >
              {char.toUpperCase()}
            </div>
          ))}
        </div>
        <br />{" "}
        <Keyboard
          onKeyPress={(e) => {
            if (e === "Enter") {
              if (wordd.length === 0) return;
              const word = wordd.join("");
              const correct = normalizeLexi?.includes(word);
              setHistory((h) => [{ correct, word }, ...h]);
              setWord([]);
              if (correct && wordd.length > 0) {
                setFound((s) => ({ ...s, [word]: true }));
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
            if (!["Backspace", "Enter"].includes(e)) {
              setCount((s) => s + 1);
            }
          }}
        />
      </div>
    </div>
  );
}

export default Lexigram;
