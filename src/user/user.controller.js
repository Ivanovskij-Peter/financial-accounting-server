async function updateBalance(req, res) {
    const { balance } = req.body
    const validationBalance = Joi.object({
        balance: Joi.number().min(1),
    })
    // if (balance >= 1) {
    try {
        await User.findByIdAndUpdate(req.user._id, { ...req.body, balance: validationBalance }, { new: true })
        res.status(200).send("Balance updated")
    } catch (error) {
        res.status(409).send("Balance is not valid")
        // }
        // } else (
        //     res.status(409).send("Balance error")
        // )
    }
}