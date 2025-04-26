
import { Aptos, AptosConfig, Network, Account, Ed25519PrivateKey } from "@aptos-labs/ts-sdk";

async function main() {
  try {
    
    const config = new AptosConfig({ network: Network.TESTNET });
    const aptos = new Aptos(config);

   
    const PRIVATE_KEY = new Ed25519PrivateKey("0x6b22e63aa52d2d312ddb3fe2dc91eeeee7b5b49802ab1517192735091f815c59");
    const MY_ACCOUNT = Account.fromPrivateKey({ privateKey: PRIVATE_KEY });

    console.log("Account Initialized");
    console.log(`Address: ${MY_ACCOUNT.accountAddress}`);

   
    const balance = await aptos.getAccountAPTAmount({
      accountAddress: MY_ACCOUNT.accountAddress
    });
    
    console.log(`Balance: ${balance} APT`);
    
    if (balance < 0.1) {
      console.log("Insufficient balance - fund your account:");
      console.log(`Faucet URL: https://faucet.testnet.aptoslabs.com/?address=${MY_ACCOUNT.accountAddress}`);
      return;
    }

   
    const transaction = await aptos.transaction.build.simple({
      sender: MY_ACCOUNT.accountAddress,
      data: {
        function: "0x777b93e13ff2a1bc872eb4d099ae15a52fb70f2f01dd18d7c809e217fb0e543e::tba_exam::add_participant",
        functionArguments: [
          "0x539f880b3da2bc33d98b5efbf611eb76b6a980b0fdb15badb537767e0767d6e3",
          "Jheric Maurice Macasabwang",
          "Jheyemmm",
          "Jheyem.macasabwang@gmail.com",
          "jheyem_"
        ],
      },
    });

    
    const senderAuthenticator = aptos.transaction.sign({
      signer: MY_ACCOUNT,
      transaction,
    });

    const pendingTxn = await aptos.transaction.submit.simple({
      transaction,
      senderAuthenticator,
    });

    console.log("\nTransaction Successfully Submitted");
    console.log(`Hash: ${pendingTxn.hash}`);
    console.log(`Explorer: https://explorer.aptoslabs.com/txn/${pendingTxn.hash}?network=testnet`);
    
    // STOP HERE - No waiting for confirmation
    return;

  } catch (error) {
    console.log("\nTransaction Failed");
    if (error instanceof Error) {
      console.log(`Error: ${error.message}`);
    }
  }
}

main().catch(error => {
  console.log("Script Error:", error);
});