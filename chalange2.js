//Connecting to a Wallet
 const {
    Connection,
    PublicKey,
    clusterApiUrl,
    Keypair,
    LAMPORTS_PER_SOL,
    Transaction,
    SystemProgram,
    sendAndConfirmRawTransaction,
    sendAndConfirmTransaction
} = require("@solana/web3.js");

// Create a new keypair
const newPair = new Keypair();

// Exact the public and private key from the keypair
const publicKey = new PublicKey(newPair._keypair.publicKey).toString();
const privateKey = newPair._keypair.secretKey;

// Connect to the Devnet
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

console.log("Public Key of the generated keypair", publicKey);

//get wallet balance
// Get the wallet balance from a given private key
const getWalletBalance = async () => {
    try {
        // Connect to the Devnet
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        console.log("Connection object is:", connection);

        // Make a wallet (keypair) from privateKey and get its balance
        const myWallet = await Keypair.fromSecretKey(privateKey);
        const walletBalance = await connection.getBalance(
            new PublicKey(newPair.publicKey)
        );
        console.log(`Wallet FROM balance : ${parseInt(walletBalance) / LAMPORTS_PER_SOL} SOL`);
    } catch (err) {
        console.log(err);
    }
};
//AirDrop 2 SOL
const airDropSol = async (value) => {
    try {
        // Connect to the Devnet and make a wallet from privateKey
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        const myWallet = await Keypair.fromSecretKey(privateKey);
        //The Public key entered by the user.
        const mypublicKey= new PublicKey(publicKey )
        // Request airdrop of 20 SOL to the wallet
        console.log("Airdropping some SOL to my wallet!");
        const fromAirDropSignature = await connection.requestAirdrop(mypublicKey,
           value* LAMPORTS_PER_SOL
        );
        await connection.confirmTransaction(fromAirDropSignature);
    } catch (err) {
        console.log(err);
    }
};

//transaction of 50% of wallet balance
const transfersol = async () =>{
  // Get Keypair from Secret Key
  var from = Keypair.fromSecretKey(privateKey);
  // Generate another Keypair (account we'll be sending to)
    const to = Keypair.generate();
  // Aidrop 2 SOL to Sender wallet
     await airDropSol(1.5);
  // Latest blockhash (unique identifer of the block) of the cluster
    let latestBlockHash = await connection.getLatestBlockhash();
  // Confirm transaction using the last valid block height (refers to its time)
    // to check for transaction expiration
    //await connection.confirmTransaction({
     //   blockhash: latestBlockHash.blockhash,
      //  lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      // signature: fromAirDropSignature
   // });
   console.log("Airdrop completed for the Sender account");

    // Send money from "from" wallet and into "to" wallet
   var transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: from.publicKey,
            toPubkey: to.publicKey,
            lamports: LAMPORTS_PER_SOL / 100
        })
    );
      // Sign transaction
    var signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [from]
    );
    console.log('Signature is ', signature);
}

// Show the wallet balance before and after airdropping SOL
const mainFunction = async () => {
    await getWalletBalance();
    await transfersol();
    await getWalletBalance();
}

mainFunction();

