# Sep-24 examples for stellar typescript-wallet-sdk

The sdk can be found [here](https://github.com/stellar/typescript-wallet-sdk).

## Example code
To view how the wallet-sdk can be used to create sep-24 deposits and withdrawals look at `deposit.js` and `withdraw.js`.


## Running deposit and withdrawals
To see them in action you can run below:

```
$ npm i
$ npm start
```

This will run the deposit flow and watch for it to finish. 
At the end it will ask if you'd like to run the withdraw flow.

Progress will be logged in the terminal.

*note: the identity values used in the sep24 interactive portal can all be fake*