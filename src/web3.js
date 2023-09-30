import Web3 from "web3";

let web3;

(async () => {
  if (window.ethereum) {
    web3 = new Web3(ethereum);

    try {
      await ethereum.enable();
    } catch (err) {
      console.log(err);
    }
    console.log(web3);
  } else {
    web3 = new Web3(window.web3.currentProvider);
  }
})();

export default web3;
