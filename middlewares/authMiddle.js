// middlewares/checkRole.js
function checkRole(requiredRole) {
    return function (req, res, next) {
        // Check if the user is logged in
        if (!req.user) {
            return res.status(401).send("Unauthorized. Please log in.");
        }

        // Check if the user's role matches
        if (req.user.role !== requiredRole) {
            return res.status(403).send("Forbidden. You do not have permission.");
        }

        next();
    }
}

module.exports = checkRole;
