export default {
    getUserBySessionId: async function (key) {
        try {
            let userDetails = await Session.findOne({ sessionId: key }).lean()
            if (userDetails && userDetails.sessionId) {
                return {
                    value: true,
                    data: userDetails,
                    message: " ",
                    statusCode: 200
                }
            } else {
                return {
                    value: false,
                    data: {},
                    message: "Player is not found",
                    statusCode: 1006
                }
            }
        } catch (err) {
            return {
                value: false,
                data: err,
                message: "Key Not Found",
                statusCode: 1001
            }
        }
    },
    getUserBalance: async function (userId) {
        try {
            let userBalance = await axios.post(
                global.env.user_url + "/api/betby/getCurrentBalanceNew",
                { id: userId + "" }
            )

            if (userBalance && userBalance.data && userBalance.data.value) {
                userBalance = userBalance.data
                if (
                    userBalance &&
                    userBalance.data &&
                    !userBalance.data.isLock
                ) {
                    return {
                        value: true,
                        data: userBalance.data,
                        message: " ",
                        statusCode: 200
                    }
                } else {
                    return {
                        value: false,
                        data: userBalance.data,
                        message: "Player is blocked",
                        statusCode: 1005
                    }
                }
            } else {
                return {
                    value: false,
                    data: {},
                    message: "Player is not found",
                    statusCode: 1006
                }
            }
        } catch (error) {
            return {
                value: false,
                data: error,
                message: "Key Not Found",
                statusCode: 1001
            }
        }
    }
}
