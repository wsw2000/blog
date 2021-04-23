import { useCallback, useEffect, useRef, useState } from 'react';

function useFetchState(...props) {
  const focus = useRef();
  const [state, setState] = useState(...props);
  useEffect(() => {
    focus.current = true;
    return () => (focus.current = false);
  }, []);
  const setFetchState = useCallback((...params) => {
    focus.current && setState(...params);
  }, []);
  return [state, setFetchState];
}

export default useFetchState;