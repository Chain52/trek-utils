const middlewareRegistry = app => {
  return app;
};

export default app => {
  return middlewareRegistry(app);
};
