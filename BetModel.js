import Bet from "../mongooseModel/Bet"

export default {
    getUserNetExposure: async function (userId) {
        try {
            let exposure = await Bet.aggregate([
                { $match: { player_id: userId, betStatus: "pending" } },
                {
                    $group: {
                        _id: "$player_id",
                        total: {
                            $sum: "$amount"
                        }
                    }
                }
            ])
            if (exposure && exposure[0] && exposure[0]._id) {
                return {
                    value: true,
                    data: exposure[0],
                    message: " ",
                    statusCode: 200
                }
            } else {
                return {
                    value: false,
                    data: {},
                    message: "userId is wrong",
                    statusCode: 403
                }
            }
        } catch (err) {
            return {
                value: false,
                data: err,
                message: "Invalid userId",
                statusCode: 500
            }
        }
    },
    saveBet: async function (betReq) {
        try {
            let betData = new Bet(betReq)
            let betDetails = await betData.save()

            return {
                value: true,
                data: betDetails,
                message: " ",
                statusCode: 200
            }
        } catch (error) {
            return {
                value: false,
                data: error,
                message: "Bad request",
                statusCode: 2004
            }
        }
    },
    getBetCommit: async function (transactionBetId) {
        console.log(transactionBetId)
        try {
            let commit = await Bet.updateOne(
                { "transaction.id": transactionBetId },
                { $set: { is_accepted: true } }
            )
            console.log(commit)

            if (commit) {
                return {
                    value: true,
                    data: commit,
                    message: " ",
                    statusCode: 200
                }
            } else {
                return {
                    value: false,
                    data: commit,
                    message: " ",
                    statusCode: 500
                }
            }
        } catch (error) {
            return {
                value: false,
                data: error,
                message: "TransactionId is not found",
                statusCode: 403
            }
        }
    },
    getBetSettlement: async function (transactionBetId) {
        console.log(transactionBetId)
        try {
            let settlement = await Bet.updateOne(
                { "transaction.id": transactionBetId },
                { $set: { is_settled: true } }
            )
            console.log(settlement)

            if (settlement) {
                return {
                    value: true,
                    data: settlement,
                    message: " ",
                    statusCode: 200
                }
            } else {
                return {
                    value: false,
                    data: settlement,
                    message: " ",
                    statusCode: 500
                }
            }
        } catch (error) {
            return {
                value: false,
                data: error,
                message: "TransactionId is not found",
                statusCode: 403
            }
        }
    },
    getBetRollback: async function (transactionBetId) {
        console.log(transactionBetId)
        try {
            let rollback = await Bet.findOneAndUpdate(
                { "transaction.id": transactionBetId },
                { $set: { is_rollback: true } },
                { new: true }
            )

            if (rollback) {
                return {
                    value: true,
                    data: rollback,
                    message: " ",
                    statusCode: 200
                }
            } else {
                return {
                    value: false,
                    data: rollback,
                    message: "",
                    statusCode: 500
                }
            }
        } catch (error) {
            return {
                value: false,
                data: error,
                message: "TransactionId is not found",
                statusCode: 403
            }
        }
    },
    sentTelegram: async function (sendMessage) {
        console.log("Telegram Message", sendMessage)
        let fullTelegramUrl = global.env.telegramUrl + "/Telegram/sendMessage"
        if (sendMessage && !sendMessage.message) {
            sendMessage.message = ""
        }
        console.log("Telegram Message", sendMessage)

        try {
            await axios.post(fullTelegramUrl, {
                message: sendMessage.message
            })
        } catch (error) {
            return {
                value: false,
                data: error,
                message: "message can not be sent",
                statusCode: 403
            }
        }
    },
    getBetRefund: async function (transactionBetId, reason) {
        try {
            let refund = await Bet.findOneAndUpdate(
                { "transaction.id": transactionBetId },
                { $set: { betStatus: "cancelled", reason: reason } },
                { new: true }
            )
            if (refund) {
                return {
                    value: true,
                    data: refund,
                    message: " ",
                    statusCode: 200
                }
            } else {
                return {
                    value: false,
                    data: refund,
                    message: "Parent transaction not found",
                    statusCode: 2003
                }
            }
        } catch (error) {
            return {
                value: false,
                data: error,
                message: "TransactionId is not found",
                statusCode: 403
            }
        }
    },
    getBetWin: async function (transactionBetId) {
        try {
            let win = await Bet.findOneAndUpdate(
                {
                    "transaction.id": transactionBetId
                },
                { $set: { status: "Won", betStatus: "settled" } },
                { new: true }
            )
            if (win) {
                return {
                    value: true,
                    data: win,
                    message: "",
                    statusCode: 200
                }
            } else {
                return {
                    value: false,
                    data: win,
                    message: "Parent transaction not found",
                    statusCode: 2003
                }
            }
        } catch (error) {
            return {
                value: false,
                data: error,
                message: "TransactionId is not found",
                statusCode: 403
            }
        }
    },
    getBetLost: async function (transactionBetId) {
        try {
            let lost = await Bet.findOneAndUpdate(
                {
                    "transaction.id": transactionBetId
                },
                { $set: { status: "Lost", betStatus: "settled" } },
                { new: true }
            )
            if (lost) {
                return {
                    value: true,
                    data: lost,
                    message: "",
                    statusCode: 200
                }
            } else {
                return {
                    value: false,
                    data: lost,
                    message: "Parent transaction not found",
                    statusCode: 2003
                }
            }
        } catch (error) {
            return {
                value: false,
                data: error,
                message: "TransactionId is not found",
                statusCode: 403
            }
        }
    }
}


