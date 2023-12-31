import axios from "axios";
import readline from "readline";

import sdk, { walletSdk } from "@stellar/typescript-wallet-sdk";

import { runDeposit, runDepositWatcher, depositDone } from "./deposit.js";
import { runWithdraw, runWithdrawWatcher } from "./withdraw.js";
import { askQuestion } from "./question.js";

const wallet = walletSdk.Wallet.TestNet();
const stellar = wallet.stellar();
const anchor = wallet.anchor({ homeDomain: "testanchor.stellar.org" });
const account = stellar.account();

const asset = new sdk.IssuedAssetId(
  "SRT",
  "GCDNJUBQSX7AJWLJACMJ7I4BC3Z47BQUTMHEICZLE6MU4KQBRYG5JY6B",
);

// Create Account
let kp;
const createAccount = async () => {
  console.log("creating account ...");
  kp = account.createKeypair();
  console.log(`kp: \n${kp.publicKey}\n${kp.secretKey}`);

  await axios.get("https://friendbot.stellar.org/?addr=" + kp.publicKey);

  const txBuilder = await stellar.transaction({
    sourceAddress: kp,
    baseFee: 1000,
  });
  const tx = txBuilder.addAssetSupport(asset).build();
  kp.sign(tx);
  const success = await stellar.submitTransaction(tx);
  if (!success) {
    throw new Error("adding trustline failed");
  }
};

await createAccount();
await runDeposit(anchor, kp);
await runDepositWatcher(anchor);

while (!depositDone) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
}

const ans = await askQuestion("Do you want to start withdrawal? (y/n)");
if (ans !== "y") {
  process.exit(0);
}

await runWithdraw(anchor, kp);
await runWithdrawWatcher(anchor, kp);
