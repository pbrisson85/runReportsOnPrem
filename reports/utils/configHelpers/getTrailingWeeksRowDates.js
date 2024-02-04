const getTrailingWeeksRowDates = async (reqBody) => {

    // earlier of ytd start or trailing 12 weeks start
    onst closestYtdWeekStartDate = await getClosestWeekStartDate(totalsStartDate, 'getTrailingWeeksForRows')

}

module.exports = getTrailingWeeksRowDates