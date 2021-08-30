import {useEffect, useRef} from "react";

export default function useOuterClick(callback) {
  const callbackRef = useRef(); // initialize mutable ref, which stores callback
  const innerRef = useRef(); // returned to client, who marks "border" element

  // update cb on each render, so second useEffect has access to current value 
  useEffect(() => { callbackRef.current = callback; });
  
  useEffect(() => {
    const handleClick = (e) => {
      if (innerRef.current && callbackRef.current && 
        !innerRef.current.contains(e.target)
      ) callbackRef.current(e);
    };

    // { capture: true } needed to solve bug: https://github.com/facebook/react/issues/20325
    document.addEventListener("click", handleClick, { capture: true });
    return () => document.removeEventListener("click", handleClick, { capture: true });
  }, []);
      
  return innerRef; // convenience for client (doesn't need to init ref himself) 
}