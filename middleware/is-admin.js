export default (req, res, next) => {
  const role = req.user.role;
  if (role !== "super-admin" && role !== "Admin") {
    const err = new Error("You are Not a super-admin or admin");
    err.statusCode = 404;
    throw err;
  }
  next();
};
