async function loadWeb3() {
    try {
        console.log("loading web3");
        if (window && window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
        }
        console.log("loaded web3");
    } catch (error) {
        console.log(error);
    }
}