console.log("popup loaded JS")
var wal_info;
var has_wallet = false;

function fetch_wallet_info() {
    try {
        chrome.storage.sync.get('public_key', async function (data) {
            document.getElementById("wallet_status").innerHTML = "Current balance: " + await get_balance(data.public_key);
        });
    } catch (err) {
        document.getElementById("wallet_status").innerHTML = "You don't have a wallet yet!";
    }
};
fetch_wallet_info();
var my_pair;
if (document.getElementById('wallet_gen')) {
    document.getElementById('wallet_gen').onclick = async function () {
        document.getElementById("wallet_status").innerHTML = "Generating wallet... please wait";
        await new_wallet().then(
            function (keypair) {
                console.log("updating local storage");
                chrome.storage.sync.set({ public_key: keypair.publicKey() });
                chrome.runtime.sendMessage({ secret: keypair.secret() }, function (response) {
                    console.log("background returned", response)
                });
            })
            .then(async function () {
                fetch_wallet_info();
            });
    };
}