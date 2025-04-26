import { Account } from "@aptos-labs/ts-sdk";

async function main() {
  const MNEMONIC = "vintage spawn cement float power cricket fatigue olympic tattoo black resemble frown";
  
  // Derive account using standard Aptos path
  const account = Account.fromDerivationPath({
    path: "m/44'/637'/0'/0'/0'",
    mnemonic: MNEMONIC,
  });

  console.log("Private Key (Hex):", account.privateKey.toString());
  console.log("Account Address:", account.accountAddress.toString());
}

main().catch(console.error);