import { Chain, createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";

///////////////////

// Replace with your address to add you to the default groups for DevMode only
export const yourAddress = "0x072d7e87c13bCe2751B5766A0E2280BAD235974f";

///////////////////

export const devGroups = [
  {
    // Nouns DAO NFT Holders group 
    groupId: "0x311ece950f9ec55757eb95f3182ae5e2",
    data: [
      // your address is added here, with others, to simulate the group list
      yourAddress,
      "0x2b9b9846d7298e0272c61669a54f0e602aba6290",
      "0xb01ee322c4f028b8a6bfcd2a5d48107dc5bc99ec",
      "0x938f169352008d35e065F153be53b3D3C07Bcd90",
      "0x072d7e87c13bCe2751B5766A0E2280BAD235974f",
      "0x1aff17694e8437ddfab8f4a56d3b45476a76cc60",
      "0x78283c069B9006c604ab9a89A78b7eB2A0f52c82",
      
    ],
  },
  {
    // Gitcoin Passport group 
    groupId: "0x1cde61966decb8600dfd0749bd371f12",
    data: [
      // your address is added here, with others, to simulate the group list
      yourAddress,
      "0x2b9b9846d7298e0272c61669a54f0e602aba6290",
      "0xb01ee322c4f028b8a6bfcd2a5d48107dc5bc99ec",
      "0x938f169352008d35e065F153be53b3D3C07Bcd90",
      "0x072d7e87c13bCe2751B5766A0E2280BAD235974f",
      "0x1aff17694e8437ddfab8f4a56d3b45476a76cc60",
      "0xF20F79Fe2231a9571dcaCfeD8198E5100d7fa52A",
      "0x78283c069B9006c604ab9a89A78b7eB2A0f52c82",
    ],
  },
  {
    // ENS Passport group 
    groupId: "0x7fa46f9ad7e19af6e039aa72077064a1",
    data: [
      // your address is added here, with others, to simulate the group list
      yourAddress,
      "0x2b9b9846d7298e0272c61669a54f0e602aba6290",
      "0xb01ee322c4f028b8a6bfcd2a5d48107dc5bc99ec",
      "0x938f169352008d35e065F153be53b3D3C07Bcd90",
      "0x072d7e87c13bCe2751B5766A0E2280BAD235974f",
      "0x1aff17694e8437ddfab8f4a56d3b45476a76cc60",
      "0xF20F79Fe2231a9571dcaCfeD8198E5100d7fa52A",
      "0x78283c069B9006c604ab9a89A78b7eB2A0f52c82",
    ],
  },
  {
    // Ethereum transactions Passport group 
    groupId: "0x94bf7aea2a6a362e07e787a663271348",
    data: [
      // your address is added here, with others, to simulate the group list
      yourAddress,
      "0x2b9b9846d7298e0272c61669a54f0e602aba6290",
      "0xb01ee322c4f028b8a6bfcd2a5d48107dc5bc99ec",
      "0x938f169352008d35e065F153be53b3D3C07Bcd90",
      "0x072d7e87c13bCe2751B5766A0E2280BAD235974f",
      "0x1aff17694e8437ddfab8f4a56d3b45476a76cc60",
      "0xF20F79Fe2231a9571dcaCfeD8198E5100d7fa52A",
      "0x78283c069B9006c604ab9a89A78b7eB2A0f52c82",
    ],
  },
  {
    // Be an early contributor of Uniswap group 
    groupId: "0xff7653240feecd7448150005a95ac86b",
    data: [
      // your address is added here, with others, to simulate the group list
      yourAddress,
      "0x2b9b9846d7298e0272c61669a54f0e602aba6290",
      "0xb01ee322c4f028b8a6bfcd2a5d48107dc5bc99ec",
      "0x938f169352008d35e065F153be53b3D3C07Bcd90",
      "0x072d7e87c13bCe2751B5766A0E2280BAD235974f",
      "0x1aff17694e8437ddfab8f4a56d3b45476a76cc60",
      "0x78283c069B9006c604ab9a89A78b7eB2A0f52c82",
      
    ],
  },
  {
    // Data Group of eary followers of sismo.lens 
    groupId: "0x3a03c9231f9b3811f71fd268a7c8b906",
    data: [
      // your address is added here, with others, to simulate the group list
      yourAddress,
      "0x2b9b9846d7298e0272c61669a54f0e602aba6290",
      "0xb01ee322c4f028b8a6bfcd2a5d48107dc5bc99ec",
      "0x938f169352008d35e065F153be53b3D3C07Bcd90",
      "0x072d7e87c13bCe2751B5766A0E2280BAD235974f",
      "0x1aff17694e8437ddfab8f4a56d3b45476a76cc60",
      "0x78283c069B9006c604ab9a89A78b7eB2A0f52c82",
      
    ],
  },
];

// The chain configuration of the chain you want to fork
export const mumbaiFork = {
  id: 5151110,
  name: "Fork Mumbai - Sismo",
  network: "forkMumbaiSismo",
  nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["http://127.0.0.1:8545"],
    },
    public: {
      http: ["http://127.0.0.1:8545"],
    },
  },
} as const satisfies Chain;


// setup the public and wallet client to interact with the contract deployed on a local fork
// the public client is used to read data from the contract or the chain
// the wallet client is used to send transactions to the contract
export const publicClient = createPublicClient({
  chain: mumbaiFork,
  transport: http("http://127.0.0.1:8545"),
});
