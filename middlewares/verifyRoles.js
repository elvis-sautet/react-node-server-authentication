const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.roles)
      return res.status(401).json({ message: "No roles provided" });
    const rolesArray = [...allowedRoles];
    console.log(rolesArray);
    console.log(req.roles);

    /* Mapping the roles array and finding the first role that is true. */
    const result = req.roles
      .map((role) => {
        return rolesArray.includes(role);
      })
      .find((role) => role === true);

    /* If the result is false, it will return a 401 status code. */
    if (!result)
      return res
        .status(401)
        .json({ message: "Unauthorized, you are not allowed" });

    next();
  };
};

module.exports = verifyRoles;
