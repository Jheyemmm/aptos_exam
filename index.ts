import { Aptos, AptosConfig, Network, Account, Ed25519PrivateKey } from "@aptos-labs/ts-sdk";

async function main() {
  try {
    // 1. Initialize Aptos Client
    const config = new AptosConfig({ network: Network.TESTNET });
    const aptos = new Aptos(config);

    // 2. Initialize Account
    const PRIVATE_KEY = new Ed25519PrivateKey("0x6b22e63aa52d2d312ddb3fe2dc91eeeee7b5b49802ab1517192735091f815c59");
    const MY_ACCOUNT = Account.fromPrivateKey({ privateKey: PRIVATE_KEY });

    console.log("🟢 Account Initialized");
    console.log(`   Address: ${MY_ACCOUNT.accountAddress}`);

    // 3. Check Balance
    const balance = await aptos.getAccountAPTAmount({
      accountAddress: MY_ACCOUNT.accountAddress
    });
    
    console.log(`   Balance: ${balance} APT`);
    
    if (balance < 0.1) {
      console.log("\n🔴 Insufficient balance - fund your account:");
      console.log(`   https://faucet.testnet.aptoslabs.com/?address=${MY_ACCOUNT.accountAddress}`);
      return;
    }

    // 4. Prepare Transaction Arguments
    const functionArguments = [
      "0x539f880b3da2bc33d98b5efbf611eb76b6a980b0fdb15badb537767e0767d6e3",
      "Jheric Maurice Macasabwang",  // Name
      "Jheyem",                      // GitHub
      "jheyem@test.com",             // Email
      "jheyem#1234"                  // Discord
    ];

    console.log("\n🔍 Transaction Arguments:");
    console.log(JSON.stringify({
      name: functionArguments[1],
      github: functionArguments[2],
      email: functionArguments[3],
      discord: functionArguments[4]
    }, null, 2));

    // 5. Build Transaction
    console.log("\n🟡 Building transaction...");
    const transaction = await aptos.transaction.build.simple({
      sender: MY_ACCOUNT.accountAddress,
      data: {
        function: "0x777b93e13ff2a1bc872eb4d099ae15a52fb70f2f01dd18d7c809e217fb0e543e::tba_exam::add_participant",
        functionArguments,
      },
    });

    // 6. Sign & Submit
    console.log("🟠 Signing transaction...");
    const senderAuthenticator = aptos.transaction.sign({
      signer: MY_ACCOUNT,
      transaction,
    });

    console.log("🟠 Submitting transaction...");
    const pendingTxn = await aptos.transaction.submit.simple({
      transaction,
      senderAuthenticator,
    });

    console.log("\n🔵 Transaction Submitted");
    console.log(`   Hash: ${pendingTxn.hash}`);
    console.log(`   Explorer: https://explorer.aptoslabs.com/txn/${pendingTxn.hash}?network=testnet`);
    
    // 7. Wait for Confirmation
    console.log("\n🟣 Waiting for confirmation...");
    const txnResult = await aptos.waitForTransaction({
      transactionHash: pendingTxn.hash,
    });

    // 8. Check Results
    if (txnResult.success) {
      console.log("\n✅ Transaction Succeeded");
      console.log(`   Gas Used: ${txnResult.gas_used}`);
    } else {
      console.log("\n❌ Transaction Failed");
      console.log(`   VM Status: ${txnResult.vm_status}`);
      console.log(`   Explorer: https://explorer.aptoslabs.com/txn/${pendingTxn.hash}?network=testnet`);
      
      // Enhanced error diagnostics
      if (txnResult.vm_status.includes("MoveAbort")) {
        const abortCode = txnResult.vm_status.match(/\((\d+)\)/)?.[1];
        console.log(`   Move Abort Code: ${abortCode}`);
        console.log("   Possible Reasons:");
        console.log("   - Invalid argument format");
        console.log("   - Duplicate registration");
        console.log("   - Contract validation failed");
      }
    }

  } catch (error) {
    console.error("\n🔥 Critical Error:");
    if (error instanceof Error) {
      console.error(`   ${error.message}`);
    } else {
      console.error("   Unknown error occurred");
    }
  }
}

main().catch(error => {
  console.error("Unhandled error:", error);
});