const config = {
  baseUrl:
    import.meta.env.VITE_BASE_STATUS === "DEV"
      ? import.meta.env.VITE_BASE_URL_DEV
      : import.meta.env.VITE_BASE_URL_PROD,
};

export default config;