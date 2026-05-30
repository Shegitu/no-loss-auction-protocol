import {
  TransactionBuilder,
  Networks,
  Operation,
  Contract,
  rpc,
  Address,
  BASE_FEE,
} from "@stellar/stellar-sdk";

const RPC_URL = "https://soroban-testnet.stellar.org";

// Create RPC server
const server = new rpc.Server(RPC_URL);

// INVOKE CONTRACT FUNCTION
export async function invokeContract({
  contractId,
  method,
  args,
  publicKey,
  signTransaction,
}) {
  try {
    const account = await server.getAccount(publicKey);

    const contract = new Contract(contractId);

    const tx = new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(contract.call(method, ...args))
      .setTimeout(30)
      .build();

    // Simulate + prepare
    const preparedTx = await server.prepareTransaction(tx);

    // Ask Freighter to sign
    const signed = await signTransaction(preparedTx.toXDR(), {
      networkPassphrase: Networks.TESTNET,
    });

    const txResult = await server.sendTransaction(signed);

    return txResult;
  } catch (err) {
    console.error("Soroban error:", err);
    throw err;
  }
}