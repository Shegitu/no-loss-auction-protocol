import { CONTRACT_ID } from "./contract";
import { Server } from "@stellar/stellar-sdk/rpc";

const server = new Server("https://soroban-testnet.stellar.org");

export async function invokeContract({
  method,
  args,
  publicKey,
  signTransaction,
}) {
  const tx = await server.prepareTransaction(
    {
      source: publicKey,
      operation: {
        contractId: CONTRACT_ID,
        function: method,
        args,
      },
    },
    { simulate: true }
  );

  const signed = await signTransaction(tx);

  return server.sendTransaction(signed);
}