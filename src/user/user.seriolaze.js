exports.serializeUser = (user) => {
  return {
    id: user.id,
    operations: user.operations,
  };
};
