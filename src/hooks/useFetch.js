import { useState, useCallback } from 'react';

const useFetch = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [error, setError] = useState(null);

  const sendRequest = useCallback(async (reqConfig, applyData) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(reqConfig.url, {
        method: reqConfig.method ? reqConfig.method : 'GET',
        headers: reqConfig.headers ? reqConfig.headers : {},
        body: reqConfig.body ? JSON.stringify(reqConfig.body) : null,
      });
      if (!response.ok) {
        throw Error('send request fail!');
      }
      const resData = await response.json();
      setData(resData);
      applyData(resData);
      setIsLoading(false);
    } catch (err) {
      setError(err.message || 'Something went wrong!');
    }
  }, []);

  return {
    data,
    sendRequest,
    isLoading,
    error,
  };
};
export default useFetch;
