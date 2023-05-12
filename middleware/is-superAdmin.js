export default (req, res, next) => {
  const role = req.user.role;
  console.log(role);
  console.log("Inside Middleware of superAdmin");
  if (role !== "super-admin") {
    const err = new Error("You are Not a super-admin");
    err.statusCode = 404;
    throw err;
  }
  next();
};
