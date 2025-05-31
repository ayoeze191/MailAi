export const handleYupError = (error) => {
  const inner_error = error.inner;
  const errors = inner_error.map((err) => {
    return {
      path: err.path,
      message: err.message,
    };
  });
  throw errors;
};
