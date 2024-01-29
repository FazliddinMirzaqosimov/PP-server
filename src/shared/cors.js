const allowedOrigins = [
    "http://localhost:3000",
    "https://app.fazliddin.dev",
  ];
  
  const corsOptions = {
    origin: (origin, callback) => {
      console.log({origin, callback});
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  };
  


  exports.default = corsOptions