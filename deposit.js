import { Memo, MemoText } from "stellar-sdk";

import open from "open";

// Create Deposit
let authToken;
let depositId;
export const runDeposit = async (anchor, kp) => {
  console.log("\ncreating deposit ...");
  const auth = await anchor.sep10();
  authToken = await auth.authenticate({ accountKp: kp });

  const assetCode = "SRT";
  const resp = await anchor.sep24().deposit({
    assetCode,
    authToken,
    lang: "en-US",
    destinationMemo: new Memo(MemoText, "test-memo"),
    extraFields: {
      wallet_name: "Test Wallet",
      wallet_url: "https://stellar.org/",
    },
  });
  depositId = resp.id;
  open(resp.url);
};

// Watch Deposit
export let depositDone = false;
export const runDepositWatcher = (anchor) => {
  console.log("\nstarting watcher ...");

  let stop;
  const onMessage = (m) => {
    console.log({ m });
    if (m.status === "completed") {
      console.log("status completed, stopping watcher");
      stop();
      depositDone = true;
    }
  };

  const onError = (e) => {
    console.log({ e });
  };

  const watcher = anchor.sep24().watcher();
  const resp = watcher.watchAllTransactions({
    authToken,
    assetCode: "SRT",
    id: depositId,
    onMessage,
    onError,
    timeout: 5000,
    lang: "en-US",
  });

  stop = resp.stop;
};
