const config = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api/v1';
  // if (process.browser && window['API_URL']) apiUrl = window['API_URL'];
  return {
    API_URL: apiUrl,
  };
};

export default config;
