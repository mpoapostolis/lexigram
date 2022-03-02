import clsx from "clsx";
import { DetailedHTMLProps, HTMLAttributes, useEffect } from "react";
import useKeyPress from "../../Hooks/useKeyPress";

function Key(
  props: {
    special?: boolean;
    pressed: boolean;
  } & DetailedHTMLProps<HTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
) {
  const { children, special, pressed, ...rest } = props;

  return (
    <button
      className={clsx(
        `border-gray-700 shadow shadow-gray-500 bg-black bg-opacity-5 
          rounded-xl hover:scale-90 uppercase w-full p-3 font-black 
          text-gray-700`,
        {
          "bg-black bg-opacity-20 scale-90": pressed,
          "text-xs font-semibold": special,
        }
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

function Keyboard(props: { onKeyPress: (k: string) => void }) {
  const { key, keyPressed } = useKeyPress();
  useEffect(() => {
    if ((key && key.length === 1) || key === "Enter" || key === "Backspace")
      props.onKeyPress(key);
  }, [key]);

  return (
    <div className={clsx("w-full text-white font-black text-base")}>
      <div className="flex justify-center  gap-1 my-1 w-full">
        {["ς", "ε", "ρ", "τ", "υ", "θ", "ι", "ο", "π", "Backspace"].map((k) => (
          <Key
            onClick={() => props.onKeyPress(k)}
            special={k === "Backspace"}
            pressed={k === key && keyPressed}
            key={k}
          >
            {k}
          </Key>
        ))}
      </div>
      <div className="flex px-5 justify-center gap-1 my-1 w-full">
        {["α", "σ", "δ", "φ", "γ", "η", "ξ", "κ", "λ"].map((k) => (
          <Key
            onClick={() => props.onKeyPress(k)}
            pressed={k === key && keyPressed}
            key={k}
          >
            {k}
          </Key>
        ))}
      </div>
      <div className="flex justify-center gap-1 my-1 w-full">
        {["ζ", "χ", "ψ", "ω", "β", "ν", "μ", "Enter"].map((k) => (
          <Key
            onClick={() => props.onKeyPress(k)}
            special={k === "Enter"}
            pressed={k === key && keyPressed}
            key={k}
          >
            {k}
          </Key>
        ))}
      </div>
    </div>
  );
}

export default Keyboard;
