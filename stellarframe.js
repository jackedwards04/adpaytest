//must include <script src="https://cdnjs.cloudflare.com/ajax/libs/stellar-sdk/8.0.0/stellar-sdk.js"></script> in HTML!!!

const server = new StellarSdk.Server("https://horizon-testnet.stellar.org");
async function transact(sourceKeys, destinationId) {
    var transaction;

    server
        .loadAccount(destinationId)
        .catch(function (error) {
            if (error instanceof StellarSdk.NotFoundError) {
                throw new Error("The destination account does not exist!");
            } else return error;
        })
        .then(function () {
            return server.loadAccount(sourceKeys.publicKey());
        })
        .then(function (sourceAccount) {
            transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
                fee: StellarSdk.BASE_FEE,
                networkPassphrase: StellarSdk.Networks.TESTNET,
            })
                .addOperation(
                    StellarSdk.Operation.payment({
                        destination: destinationId,
                        asset: StellarSdk.Asset.native(),
                        amount: "1000",
                    }),
                )
                .addMemo(StellarSdk.Memo.text("Test Transaction"))
                .setTimeout(180)
                .build();
            transaction.sign(sourceKeys);
            return server.submitTransaction(transaction);
        })
        .then(async function (result) {
            console.log("Success! New balance below...", result);
            const account = await server.loadAccount(sourceKeys.publicKey());
            console.log("Balances for account: " + sourceKeys.publicKey());
            account.balances.forEach(function (balance) {
                console.log("Type:", balance.asset_type, ", Balance:", balance.balance);
            })
        })
        .catch(function (error) {
            console.error("Whoops!", error);
        })
};





async function new_wallet() {
    const pair = StellarSdk.Keypair.random();

    console.log(pair.secret());
    try {
        const response = await fetch(
            `https://friendbot.stellar.org?addr=${encodeURIComponent(
                pair.publicKey(),
            )}`,
        );
        const responseJSON = await response.json();
        console.log("SUCCESS! You have a new account :)\n", responseJSON);
    } catch (e) {
        console.error("ERROR!", e);
    }



    // the JS SDK uses promises for most actions, such as retrieving an account
    const account = await server.loadAccount(pair.publicKey());
    console.log("Balances for account: " + pair.publicKey());
    account.balances.forEach(function (balance) {
        console.log("Type:", balance.asset_type, ", Balance:", balance.balance);
    })
    return pair;
};

async function runTransaction() {
    var sender = await new_wallet();
    var target = await new_wallet();
    transact(sender, target.publicKey())
};
