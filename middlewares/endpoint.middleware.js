const successEndpoint = async (req, res, next) => {
  if (!res.data) {
    return res.status(404).json({ message: 'Route not found!' })
  }
  res.status(200).json(res.data)
}

const errorEndpoint = async (err, req, res, next) => {
  res.status(err.status || 500)
  console.error(err)
  return res.json({
    message: err.message,
  })
}

module.exports = {
  successEndpoint, errorEndpoint,
}
