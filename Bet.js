var schema = new Schema(
    {
        bet_transaction_id: {
            type: String,
            index: true
        },
        amount: {
            type: Number
        },
        currency: {
            type: String
        },
        player_id: {
            type: String,
            index: true
        },
        session_id: {
            type: String,
            index: true
        },
        bonus_id: {
            type: String
        },
        bonus_type: {
            type: String,
            enum: [
                "freebet_refund",
                "freebet_freemoney",
                "freebet_no_risk",
                "global_comboboost",
                "comboboost"
            ]
        },
        comboboost_multiplier: {
            type: String
        },
        betslip: {
            type: Object
        },
        selections: {
            id: String,
            event_id: String,
            status: {
                type: String,
                enum: ["Won", "Lost", "Open"]
            },
            odds: String
        },
        is_cashout: {
            type: String
        },
        status: {
            type: String,
            enum: ["Lost", "Won"]
        },
        is_result: {
            type: Boolean,
            default: false
        },
        is_rollback: {
            type: Boolean,
            default: false
        },
        is_settled: {
            type: Boolean,
            default: false
        },
        transaction: {
            type: Object
        },
        betStatus: {
            type: String,
            enum: ["pending", "settled", "cancelled"],
            default: "pending"
        },
        is_accepted: {
            type: Boolean,
            default: false
        },
        reason: {
            type: String
        }
    },
    {
        timestamps: true
    }
)
export default mongoose.model("Bet", schema)
