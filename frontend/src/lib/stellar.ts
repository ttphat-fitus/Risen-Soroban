import {
  BASE_FEE,
  Networks,
  Operation,
  Transaction,
  TransactionBuilder,
  nativeToScVal,
  rpc,
  scValToNative,
  xdr,
} from "@stellar/stellar-sdk";
import {
  getNetwork,
  isConnected,
  requestAccess,
  signTransaction,
} from "@stellar/freighter-api";

export const CONTRACT_ID =
  process.env.NEXT_PUBLIC_CONTRACT_ID ||
  "CC5TEK3IFXJGECTPJF3KFXVKWR44UDMDXBYPYVHEQ5KPIIXIIRQOHFZC";

export const STELLAR_NETWORK =
  process.env.NEXT_PUBLIC_STELLAR_NETWORK || "TESTNET";

export const NETWORK_PASSPHRASE =
  STELLAR_NETWORK.toUpperCase() === "PUBLIC"
    ? Networks.PUBLIC
    : Networks.TESTNET;

export const RPC_URL =
  process.env.NEXT_PUBLIC_STELLAR_RPC_URL ||
  "https://soroban-testnet.stellar.org";

export type WalletState = {
  installed: boolean;
  publicKey: string;
  network: string;
  networkPassphrase: string;
  isTestnet: boolean;
  warning?: string;
};

export type TxResult = {
  hash?: string;
  status: string;
  explorerUrl?: string;
  result?: unknown;
};

export function getRpcServer() {
  return new rpc.Server(RPC_URL, { allowHttp: RPC_URL.startsWith("http://") });
}

export function explorerTxUrl(hash: string) {
  const network = STELLAR_NETWORK.toLowerCase() === "public" ? "public" : "testnet";
  return `https://stellar.expert/explorer/${network}/tx/${hash}`;
}

export function addressArg(address: string) {
  return nativeToScVal(address, { type: "address" });
}

export function stringArg(value: string) {
  return nativeToScVal(value);
}

export function symbolArg(value: string) {
  return xdr.ScVal.scvSymbol(value);
}

export function u32Arg(value: number) {
  return nativeToScVal(value, { type: "u32" });
}

export function buildContractOperation(method: string, args: xdr.ScVal[]) {
  return Operation.invokeContractFunction({
    contract: CONTRACT_ID,
    function: method,
    args,
  });
}

export async function getWalletState(): Promise<WalletState> {
  const connected = await isConnected();

  if (!connected.isConnected) {
    return {
      installed: false,
      publicKey: "",
      network: "",
      networkPassphrase: "",
      isTestnet: false,
      warning: "Freighter is not installed or is not reachable in this browser.",
    };
  }

  const networkInfo = await getNetwork();
  const isTestnet = networkInfo.networkPassphrase === Networks.TESTNET;

  return {
    installed: true,
    publicKey: "",
    network: networkInfo.network || "Unknown",
    networkPassphrase: networkInfo.networkPassphrase || "",
    isTestnet,
    warning: isTestnet
      ? undefined
      : "Freighter is connected, but it is not set to Stellar Testnet.",
  };
}

export async function connectFreighter(): Promise<WalletState> {
  const access = await requestAccess();

  if (access.error || !access.address) {
    throw new Error(access.error?.message || "Freighter connection was rejected.");
  }

  const networkInfo = await getNetwork();
  const isTestnet = networkInfo.networkPassphrase === Networks.TESTNET;

  return {
    installed: true,
    publicKey: access.address,
    network: networkInfo.network || "Unknown",
    networkPassphrase: networkInfo.networkPassphrase || "",
    isTestnet,
    warning: isTestnet
      ? undefined
      : "Switch Freighter to Stellar Testnet before signing transactions.",
  };
}

export async function simulateContractCall(
  sourcePublicKey: string,
  method: string,
  args: xdr.ScVal[] = [],
) {
  const server = getRpcServer();
  const account = await server.getAccount(sourcePublicKey);
  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(buildContractOperation(method, args))
    .setTimeout(30)
    .build();

  const simulation = await server.simulateTransaction(tx);

  if ("error" in simulation) {
    throw new Error(simulation.error);
  }

  return simulation.result ? scValToNative(simulation.result.retval) : null;
}

export async function submitContractCall(
  sourcePublicKey: string,
  method: string,
  args: xdr.ScVal[] = [],
): Promise<TxResult> {
  const server = getRpcServer();
  const account = await server.getAccount(sourcePublicKey);
  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(buildContractOperation(method, args))
    .setTimeout(30)
    .build();

  const prepared = await server.prepareTransaction(tx);
  const signed = await signTransaction(prepared.toXDR(), {
    address: sourcePublicKey,
    networkPassphrase: NETWORK_PASSPHRASE,
  });

  if (signed.error || !signed.signedTxXdr) {
    throw new Error(signed.error?.message || "Freighter did not sign the transaction.");
  }

  const signedTx = new Transaction(signed.signedTxXdr, NETWORK_PASSPHRASE);
  const sent = await server.sendTransaction(signedTx);

  if (sent.status !== "PENDING") {
    throw new Error(`Transaction was not accepted by RPC: ${sent.status}`);
  }

  const final = await pollTransaction(server, sent.hash);
  const result =
    "returnValue" in final && final.returnValue
      ? scValToNative(final.returnValue)
      : undefined;

  return {
    hash: sent.hash,
    status: final.status,
    explorerUrl: explorerTxUrl(sent.hash),
    result,
  };
}

async function pollTransaction(server: rpc.Server, hash: string) {
  for (let attempt = 0; attempt < 12; attempt += 1) {
    const response = await server.getTransaction(hash);

    if (response.status !== "NOT_FOUND") {
      if (response.status !== "SUCCESS") {
        throw new Error(`Transaction finished with status ${response.status}.`);
      }

      return response;
    }

    await new Promise((resolve) => setTimeout(resolve, 1500));
  }

  throw new Error("Transaction is still pending. Check Stellar Expert with the hash.");
}
