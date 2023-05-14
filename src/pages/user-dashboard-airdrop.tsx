"use client"
import router from "next/router";
import { useEffect, useState } from "react";
import Select from 'react-select';
import {
  SismoConnectButton,
  AuthType,
  SismoConnectClientConfig,
  SismoConnectResponse,
} from "@sismo-core/sismo-connect-react";
import {
  switchNetwork,
  mumbaiFork,
  requestAccounts,
  getPublicClient,
  handleVerifyErrors,
  callContract,
  signMessage,
} from "@/utils";
import { transactions } from "../../broadcast/DookieUser.s.sol/5151110/run-latest.json";
import { abi } from "../../abi/DookieUser.json";
import { createWalletClient, http, custom, WalletClient, PublicClient } from "viem";
import BackButton from "../components/BackButton";

/*Import sismo-connect-server to check proofs*/
import {
  SismoConnect,
  SismoConnectServerConfig,
} from "@sismo-core/sismo-connect-server";
import { devGroups } from "../../config"; 
import { group } from "console";

export enum APP_STATES {
  init,
  receivedProof,
  claimingDookie,
}

// with your Sismo Connect app ID and enable dev mode.
// The SismoConnectClientConfig is a configuration needed to connect to Sismo Connect and requests data from your users.
// You can find more information about the configuration here: https://docs.sismo.io/build-with-sismo-connect/technical-documentation/react

export const sismoConnectConfig: SismoConnectClientConfig = {
  appId: "0x9820513d88bf47db265d70a430173414", //Dookies App
  devMode: {
    enabled: true, 
    devGroups,
  },
};

//Groups options
const options = [
  { value: '0x311ece950f9ec55757eb95f3182ae5e2', label: 'Nouns DAO NFT Holder' },
  { value: '0x1cde61966decb8600dfd0749bd371f12', label: 'Gitcoin Passport Holder' },
  { value: '0x7fa46f9ad7e19af6e039aa72077064a1', label: 'ENS DAO Voter' },
  { value: '0x94bf7aea2a6a362e07e787a663271348', label: 'ETH Whale' },
  { value: '0x3a03c9231f9b3811f71fd268a7c8b906', label: 'Sismo Lens Follwers' },
  { value: '0xff7653240feecd7448150005a95ac86b', label: 'Uniswap Contributors' },


];
// The application calls contracts on Mumbai testnet
const userChain = mumbaiFork;
const contractAddress = transactions[0].contractAddress;


export default function ClaimAirdrop() {
  const [appState, setAppState] = useState<APP_STATES>(APP_STATES.init);
  const [response, setResponse] = useState<SismoConnectResponse>();
  const [error, setError] = useState<string>("");
  const [tokenId, setTokenId] = useState<{ id: string }>();
  const [account, setAccount] = useState<`0x${string}`>(
    "0x072d7e87c13bCe2751B5766A0E2280BAD235974f"
  );

  const [selectedOption, setSelectedOption] = useState([]);

  const [isAirdropAddressKnown, setIsAirdropAddressKnown] = useState<boolean>(false);
  const [walletClient, setWalletClient] = useState<WalletClient>(
    createWalletClient({
      chain: userChain,
      transport: http(),
    }) as WalletClient
  );
  const publicClient: PublicClient = getPublicClient(userChain);

  useEffect(() => {
    async function getCookie() {
      if (appState === APP_STATES.receivedProof && response && account) {
        console.log("GETTING COOKIE", response)
        const requestBody = { response: response }; 
        try {
          console.log(selectedOption?.map((opt: any) => ({groupId:opt.value})))
          const groups = response.proofs.flatMap(proof => ({groupId: proof.claims?.[0].groupId}))
          .filter(proof => proof?.groupId);
          console.log("Filter Groups")
          console.log(groups)
          
          const verifyRes = await fetch('http://localhost:4500', {
            method: 'POST',
            body: JSON.stringify({ response, account, groups: groups, signature: "dookie" }), // That should be the proof
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
          });
          const verified = await verifyRes.json()
          console.log(verified)


        } catch (error) {
          console.error('Error:', error);
        }
      }
    }
    getCookie()

  }, [response, account, selectedOption])
  useEffect(() => {
    if (typeof window === "undefined") return;
    setWalletClient(
      createWalletClient({
        chain: userChain,
        transport: custom(window.ethereum, {
          key: "windowProvider",
        }),
      }) as WalletClient
    );

    setIsAirdropAddressKnown(localStorage.getItem("airdropAddress") ? true : false);
    if (isAirdropAddressKnown) {
      setAccount(localStorage.getItem("airdropAddress") as `0x${string}`);
    }
  }, [isAirdropAddressKnown]);

  async function connectWallet() {
    router.push("/user-dashboard-airdrop");
    const address = await requestAccounts();
    localStorage.setItem("airdropAddress", address);
    setAccount(address);
    setIsAirdropAddressKnown(true);
  }

  function setResponseAndAppState(res: SismoConnectResponse) {
    setResponse(res);
    if (appState !== 2) {
      setAppState(APP_STATES.receivedProof);
    }
  }

  // This function is called when the user claims the NFT
  // It is called with the responseBytes returned by the Sismo Vault
  // The responseBytes is a string that contains plenty of information about the user proofs and additional parameters that should hold with respect to the proofs
  // You can learn more about the responseBytes format here: https://docs.sismo.io/build-with-sismo-connect/technical-documentation/client#getresponsebytes
  async function claimWithSismo(responseBytes: string) {
    setAppState(APP_STATES.claimingDookie);
    // switch the network
    await switchNetwork(userChain);
    try {
      const tokenId = await callContract({
        contractAddress,
        responseBytes,
        abi,
        userChain,
        account,
        publicClient,
        walletClient,
      });
      //const tokenId = "Proof generated";
      // If the proof is valid, we update the user react state to show the tokenId
      setTokenId({ id: tokenId });
    } catch (e) {
      setError(handleVerifyErrors(e));
    } finally {
      setAppState(APP_STATES.init);
      localStorage.removeItem("airdropAddress");
    }
  }
  const onChange = (option: any) => {
    console.log(option)
    setSelectedOption(option);
  }
 
  return (
    <>
      <BackButton />
      <div className="container">
        {!tokenId && (
          <>
            <h2 style={{ marginBottom: 10 }}>
              SELECT YOUR INTERESTS AND PREFERENCES
            </h2>
            {!isAirdropAddressKnown && (
              <p style={{ marginBottom: 40 }}>
                Please log in with your wallet
              </p>
            )} 
            
            <Select
              value={selectedOption}
              isMulti
              onChange={onChange}
              options={options}
            />

            {isAirdropAddressKnown ? (
              <p style={{ marginBottom: 40 }}>Address connected: {account}</p>
            ) : (
              !error && (
                <button className="connect-wallet-button" onClick={() => connectWallet()}>
                  Connect Wallet
                </button>
              )
            )}

            {
              // This is the Sismo Connect button that will be used to create the requests and redirect the user to the Sismo Vault app to generate the proofs from his data
              // The different props are:
              // - config: the Sismo Connect client config that contains the Sismo Connect appId
              // - auths: the auth requests that will be used to generate the proofs, here we only use the Vault auth request
              // - signature: the signature request that will be used to sign an arbitrary message that will be checked onchain, here it is used to sign the airdrop address
              // - onResponseBytes: the callback that will be called when the user is redirected back from the his Sismo Vault to the Sismo Connect App with the Sismo Connect response as bytes
              // You can see more information about the Sismo Connect button in the Sismo Connect documentation: https://docs.sismo.io/build-with-sismo-connect/technical-documentation/react
            }
            {!error &&
              isAirdropAddressKnown &&
              appState != APP_STATES.receivedProof && 
              appState != APP_STATES.claimingDookie &&  (
                <SismoConnectButton
                  // the client config created
                  config={sismoConnectConfig}
                  // the auth request we want to make
                  // here we want the proof of a Sismo Vault ownership from our users
                  auth={{ authType: AuthType.VAULT }}

                  claims={selectedOption?.map(( opt : any) => ({groupId:opt.value}))}
                  // we use the AbiCoder to encode the data we want to sign
                  // by encoding it we will be able to decode it on chain
                  //signature={{ message: signMessage(account) }}
                  signature={{ message: "dookie" }}
                  // onResponseBytes calls a 'setResponse' function with the responseBytes returned by the Sismo Vault
                  // onResponseBytes={(responseBytes: string) => setResponse(responseBytes)}
                  onResponse={(response: SismoConnectResponse) => setResponseAndAppState(response)}
                  // Some text to display on the button
                  text={"Proof your Interest Groups"}
                />
              )}
          </>
        )}
        {tokenId && (
          <>
            <h1>Proof generated successfully!</h1>
            <p style={{ marginBottom: 20 }}>
              The user has used the address to generate the proof
            </p>
            <div className="profile-container">
              <div>
                <h2>Proof status:</h2>
                <b>tokenId: {tokenId?.id}</b>
                <p>Address used: {account}</p>
              </div>
            </div>
            {/** Simple button to call the smart contract with the response as bytes */}
            { /*appState == APP_STATES.claimingNFT && (
              <p style={{ marginBottom: 40 }}>Claiming NFT...</p>
            )*/}
          </>
        )}

        {error && (
          <>
            <h2>{error}</h2>
          </>
        )}
      </div>
    </>
  );
}
