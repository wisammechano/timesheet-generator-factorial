import React, { useContext, useEffect, useState } from "react";
import Factorial from "../API/Factorial";

const context = React.createContext();

const FactorialHOC = (props) => {
  const [factorial, setFactorial] = useState(Factorial.getInstance() || null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!factorial) {
      setIsLoading(true);
      Factorial.load().then((f) => {
        setFactorial(f);
        setIsLoading(false);
      });
    }
  }, [factorial]);

  return (
    <context.Provider value={{ factorial, isLoading }}>
      {!isLoading && props.children}
    </context.Provider>
  );
};

export const useFactorial = () => {
  const factorial = useContext(context);
  return factorial;
};

export default FactorialHOC;
