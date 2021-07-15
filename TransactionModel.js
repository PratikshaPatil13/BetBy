export default {
    getTransactionId: async function (transactionId) {
        try {
            let transactionDetails = await Transaction.findOne({
                "transaction.id": transactionId
            })

            if (transactionDetails && transactionDetails.transactionId) {
                return {
                    value: false,
                    data: transactionDetails,
                    message: " ",
                    statusCode: 500
                }
            } else {
                return {
                    value: true,
                    data: transactionDetails,
                    message: " ",
                    statusCode: 200
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
}
