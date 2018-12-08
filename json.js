exports.update = (id, text) => {

    const account = "fibos123comc"
    assert.strictEqual(action.has_auth(account), true, 'No authority');

    const action_account = action.account
    const items = db.jsons(action_account, action_account)
    let item = items.find(id)

    if (item.data) {
        item.data.text = text
        item.update(action_account)
    } else {
        items.emplace(action_account, {
            id,
            text
        })
    }
}