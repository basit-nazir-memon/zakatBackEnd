const editor = (req, res, next) => {
    if (req.user && (req.user.role === 'Admin' || req.user.role === 'Editor')) {
        next();
    } else {
        return res.status(403).json({ msg: 'Access denied. Editor privileges required.' });
    }
}

module.exports = editor;


