
const getSearchRegex = query => {
    const regex = new RegExp(query, 'i')
    return { $regex: regex }
}

module.exports = {
    getSearchRegex
} 