import { createContext, PropsWithChildren, useEffect, useState } from "react";

export const KonamiContext = createContext({ konamiActivated: false });

export const KonamiProvider = ({ children }: PropsWithChildren) => {
  const [konamiActivated, setKonamiActivated] = useState(false);
  const [inputSequence, setInputSequence] = useState("");

  // up up down down left right left right a b
  // this is technically typeable. like, instead of pressing the arrows, a user
  //  could just type out the entire cheat code
  const cheatCode =
    "ARROWUPARROWUPARROWDOWNARROWDOWNARROWLEFTARROWRIGHTARROWLEFTARROWRIGHTBA";

  const handleKeyDown = (e: KeyboardEvent) => {
    const userInput = e.key.toUpperCase();
    const newSequence = inputSequence + userInput;

    if (cheatCode.startsWith(newSequence)) {
      setInputSequence(newSequence);
    } else {
      if (cheatCode.startsWith(userInput)) {
        setInputSequence(userInput);
      } else {
        setInputSequence("");
      }
      return;
    }

    if (newSequence === cheatCode) {
      setKonamiActivated(!konamiActivated);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [inputSequence]);

  return (
    <KonamiContext.Provider value={{ konamiActivated }}>
      {children}
    </KonamiContext.Provider>
  );
};
