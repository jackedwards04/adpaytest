
async function runTransaction(target) {
    console.log('Initiating transaction from', StellarSdk.Keypair.fromSecret(localStorage.getItem("my_secret")).publicKey(), 'to', target);
    await transact(StellarSdk.Keypair.fromSecret(localStorage.getItem("my_secret")), target);
    return 1;
};

chrome.runtime.onMessageExternal.addListener(async (request, sender, sendResponse) => {

    console.log("External request", request);
    runTransaction(request);
    sendResponse({ received: 1 }); //respond however you like
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Internal request", request)
    if (request.secret) {
        localStorage.setItem("my_secret", request.secret);
        sendResponse({secret_set: 1});
    }
});