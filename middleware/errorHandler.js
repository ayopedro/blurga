const errorHandler = (error, req, res, next) => {
    if (error) {
        res.status(400).json({message: error})
        console.log(error)
    }

    next()
}

module.exports = errorHandler;