const config = () => {
  const apiUrl = process.browser ? process.env.NEXT_PUBLIC_API_URL || '/api/v1' : process.env.API_URL;
  // if (process.browser && window['API_URL']) apiUrl = window['API_URL'];
  return {
    API_URL: apiUrl,
  };
};

export default config;
