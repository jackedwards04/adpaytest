//must include <script src="https://cdnjs.cloudflare.com/ajax/libs/stellar-sdk/8.0.0/stellar-sdk.js"></script> in HTML!!!

const server = new StellarSdk.Server("https://horizon-testnet.stellar.org");
async function transact(sourceKeys, destinationId) {
    var transaction;
    console.log('Starting transaction')
    // First, check to make sure that the destination account exists.
    // You could skip this, but if the account does not exist, you will be charged
    // the transaction fee when the transaction fails.
    server
        .loadAccount(destinationId)
        // If the account is not found, surface a nicer error message for logging.
        .catch(function (error) {
            if (error instanceof StellarSdk.NotFoundError) {
                throw new Error("The destination account does not exist!");
            } else return error;
        })
        // If there was no error, load up-to-date information on your account.
        .then(function () {
            return server.loadAccount(sourceKeys.publicKey());
        })
        .then(function (sourceAccount) {
            // Start building the transaction.
            transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
                fee: StellarSdk.BASE_FEE,
                networkPassphrase: StellarSdk.Networks.TESTNET,
            })
                .addOperation(
                    StellarSdk.Operation.payment({
                        destination: destinationId,
                        // Because Stellar allows transaction in many currencies, you must
                        // specify the asset type. The special "native" asset represents Lumens.
                        asset: StellarSdk.Asset.native(),
                        amount: "10",
                    }),
                )
                // A memo allows you to add your own metadata to a transaction. It's
                // optional and does not affect how Stellar treats the transaction.
                .addMemo(StellarSdk.Memo.text("Test Transaction"))
                // Wait a maximum of three minutes for the transaction
                .setTimeout(180)
                .build();
            // Sign the transaction to prove you are actually the person sending it.
            transaction.sign(sourceKeys);
            // And finally, send it off to Stellar!
            return server.submitTransaction(transaction);
        })
        .then(function (result) {
            console.log("Success! Results:", result);
        })
        .catch(function (error) {
            console.error("Something went wrong!", error);
            // If the result is unknown (no response body, timeout etc.) we simply resubmit
            // already built transaction:
            // server.submitTransaction(transaction);
        });
};


async function get_balance(pub_key) {
    let balances = [];
    const account = await server.loadAccount(pub_key);
    console.log("Balances for account: " + pub_key);
    account.balances.forEach(function (balance) {
        balances.push([balance.asset_type, balance.balance]);
    })
    return balances;
}


async function new_wallet() {
    const pair = StellarSdk.Keypair.random();

    console.log("Generating wallet");
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
    console.log("Public key:", pair.publicKey())
    console.log(await get_balance(pair.publicKey()));
    return pair;
};
