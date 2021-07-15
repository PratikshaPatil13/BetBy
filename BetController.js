const router = Router()

router.post("/exposure", async (req, res) => {
    if (req.body && req.body._id) {
        try {
            const data = await BetModel.getUserNetExposure(req.body._id)
            res.status(200).json(data)
        } catch (error) {
            console.error(error)
            res.status(500).json(error)
        }
    } else {
        res.callback("Invalid Parameter")
    }
})

router.post("/make", async (req, res) => {
    let reqData = req.body
    if (reqData && reqData.player_id) {
        try {
            //balance check
            let balance = await SessionModel.getUserBalance(reqData.player_id)

            if (balance && balance.data && balance.data.balance) {
                if (reqData.amount <= balance.data.balance) {
                    let savedBet = await BetModel.saveBet(reqData)
                    if (savedBet && savedBet.value) {
                        let resObj = {
                            id: savedBet.data._id,
                            ext_transaction_id: reqData.transaction.id,
                            parent_transaction_id: null,
                            user_id: reqData.player_id,
                            operation: "bet",
                            amount: reqData.amount,
                            currency: global.currency,
                            balance: balance.data.balance - reqData.amount
                        }
                        res.status(200).json(resObj)
                    } else {
                        res.status(500).json({
                            code: savedBet.statusCode,
                            message: savedBet.message
                        })
                    }
                } else {
                    res.status(500).json({
                        code: 1006,
                        message: "not enough money"
                    })
                }
            }
        } catch (error) {
            console.error(error)
            res.status(500).json(error)
        }
    }
})

router.post("/commit", async (req, res) => {
    if (req.body && req.body.bet_transaction_id) {
        try {
            let betCommit = await BetModel.getBetCommit(
                req.body.bet_transaction_id
            )
            res.status(200).json(betCommit)
        } catch (error) {
            console.error(error)
            res.status(500).json(error)
        }
    } else {
        res.callback("Invalid transactionId")
    }
})

router.post("/settlement", async (req, res) => {
    let reqData = req.body
    console.log(reqData)
    if (reqData && reqData.bet_transaction_id) {
        try {
            let betSettlement = await BetModel.getBetSettlement(
                reqData.bet_transaction_id
            )
            res.status(200).json(betSettlement)
        } catch (error) {
            console.error(error)
            res.status(500).json(error)
        }
    } else {
        res.callback("Invalid transactionId")
    }
})

router.post("/rollback", async (req, res) => {
    let reqData = req.body
    console.log(reqData)
    if (reqData && reqData.bet_transaction_id) {
        try {
            let betRollback = await BetModel.getBetRollback(
                reqData.bet_transaction_id
            )

            console.log(
                "rollback:::::::::::::::::::::::::::::::::::::",
                betRollback
            )
            let balanceCheck = await SessionModel.getUserBalance(
                reqData.transaction.player_id
            )
            console.log("Balance:::::::::::", balanceCheck)
            if (balanceCheck && balanceCheck.value) {
                let resObj = {
                    id:
                        betRollback && betRollback.value
                            ? betRollback.data._id
                            : "",
                    ext_transaction_id: reqData.bet_transaction_id,
                    parent_transaction_id: null,
                    user_id: reqData.player_id,
                    operation: "bet",
                    amount: reqData.amount,
                    currency: global.currency,
                    balance: balanceCheck.data.balance
                }
                res.status(200).json(resObj)
            } else {
                res.status(500).json({
                    code: betRollback.statusCode,
                    message: betRollback.message
                })
            }
            let message =
                "betBy: given transactionId got rollback " +
                betRollback.data._id
            await BetModel.sentTelegram({ message: message })
        } catch (error) {
            console.error(error)
            res.status(500).json(error)
        }
    }
})

router.post("/refund", async (req, res) => {
    let reqData = req.body
    if (reqData && reqData.bet_transaction_id) {
        try {
            let betRefund = await BetModel.getBetRefund(
                reqData.bet_transaction_id,
                reqData.reason
            )
            let balanceCheck = await SessionModel.getUserBalance(
                reqData.transaction.player_id
            )
            console.log("Balance:::::::::::", balanceCheck)

            if (balanceCheck && balanceCheck.value) {
                let resObj = {
                    id: betRefund && betRefund.value ? betRefund.data._id : "",
                    ext_transaction_id: reqData.bet_transaction_id,
                    parent_transaction_id: null,
                    user_id: reqData.player_id,
                    operation: "bet",
                    amount: reqData.amount,
                    currency: global.currency,
                    balance: balanceCheck.data.balance
                }
                res.status(200).json(resObj)
            } else {
                res.status(500).json({
                    code: betRefund.statusCode,
                    message: betRefund.message
                })
            }
        } catch (error) {
            console.error(error)
            res.status(500).json(error)
        }
    }
})

router.post("/win", async (req, res) => {
    let reqData = req.body
    //console.log(reqData)
    if (reqData && reqData.bet_transaction_id) {
        try {
            let accountstatement = await SessionModel.getBetByResult(
                reqData.transaction.player_id
            )
            console.log("acc:", accountstatement)

            let win = await BetModel.getBetWin(reqData.bet_transaction_id)
            console.log(win)
            let balance = await SessionModel.getUserBalance(
                reqData.transaction.player_id
            )
            console.log("user balance:::::::::::::::::::::::::::::::", balance)
            if (balance && balance.value) {
                let resObj = {
                    id: win && win.value ? win.data._id : "",
                    ext_transaction_id: reqData.bet_transaction_id,
                    parent_transaction_id: null,
                    user_id: reqData.player_id,
                    operation: "bet",
                    amount: reqData.amount,
                    currency: global.currency,
                    balance: balance.data.balance
                }
                res.status(200).json(resObj)
            } else {
                res.status(500).json({
                    code: win.statusCode,
                    message: win.message
                })
            }
        } catch (error) {
            console.error(error)
            res.status(500).json(error)
        }
    }
})

router.post("/lost", async (req, res) => {
    let reqData = req.body
    //console.log(reqData)
    if (reqData && reqData.bet_transaction_id) {
        try {
            let accountstatement = await SessionModel.getBetByResult(
                reqData.transaction.player_id
            )
            

            let lost = await BetModel.getBetLost(reqData.bet_transaction_id)

            let balance = await SessionModel.getUserBalance(
                reqData.transaction.player_id
            )
            console.log("user balance:::::::::::::::::::::::::::::::", balance)
            if (balance && balance.value) {
                let resObj = {
                    id: lost && lost.value ? lost.data._id : "",
                    ext_transaction_id: reqData.bet_transaction_id,
                    parent_transaction_id: null,
                    user_id: reqData.player_id,
                    operation: "bet",
                    amount: reqData.amount,
                    currency: global.currency,
                    balance: balance.data.balance
                }
                res.status(200).json(resObj)
            } else {
                res.status(500).json({
                    code: lost.statusCode,
                    message: lost.message
                })
            }
        } catch (error) {
            console.error(error)
            res.status(500).json(error)
        }
    }
})

export default router
