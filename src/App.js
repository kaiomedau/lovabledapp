import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import toast from "react-hot-toast";
import { CONFIG } from "./config/config";
import MintButton from "./components/mintButton";

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

function App() {
  const loadingToast = toast;

  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  // const data = useSelector((state) => state.data);

  const [claimingNft, setClaimingNft] = useState(false);
  const [packIDS, setPackIDS] = useState([]);

  // const [whitelisted, setWhitelisted] = useState(0);
  // const [viblisted, setviblisted] = useState(0);

  const [mintLive, setMintLive] = useState(false);

  // const commonPrice = 6000000000000000000;
  // const uncommonPrice = 8000000000000000000;
  // const rarePrice = 10000000000000000000;

  //
  //
  //
  const getMintHeader = (price) => {
    return {
      gasLimit: String(CONFIG.GAS_LIMIT),
      maxPriorityFeePerGas: null,
      maxFeePerGas: null,
      to: CONFIG.CONTRACT,
      from: blockchain.account,
      value: String(price),
    };
  };

  // ******************************************************
  // Status
  // ******************************************************
  const getMintStatus = () => {
    blockchain.smartContract.methods
      .mintLive()
      .call()
      .then((receipt) => {
        console.log("🔥 Mint Status: ", receipt);
        setMintLive(receipt);
      });
  };

  // ******************************************************
  // Mint
  // ******************************************************
  const minting = (msg) => {
    setClaimingNft(true);
    loadingToast.loading(msg, { id: loadingToast });
  };
  const endMinting = (ids) => {
    console.log(ids.events.TransferBatch.returnValues.ids);
    // setPackIDS(ids.events.TransferBatch.returnValues.ids);

    loadingToast.dismiss();
    toast.success("🐶 Success!");

    setClaimingNft(false);

    getData();
  };
  const endMintWithError = (e) => {
    loadingToast.dismiss();
    toast.error(e.message);
    setClaimingNft(false);

    getData();
  };

  // ******************************************************
  // Whitelist
  // ******************************************************
  // const retriveWhitelistCount = () => {
  //   blockchain.smartContract.methods
  //     .whitelistCount(blockchain.account)
  //     .call()
  //     .then((receipt) => {
  //       setviblisted(parseInt(receipt[0]));
  //       setWhitelisted(parseInt(receipt[1]));
  //       console.log("🔥 Whitelist: " + receipt[0], receipt[1]);
  //     });
  // };

  const mintNFT = () => {
    minting("Minting NFT");

    // blockchain.smartContract.methods
    //   .mintVIBCommon()
    //   .send(getMintHeader(0))
    //   .once("error", (err) => {
    //     endMintWithError(err);
    //   })
    //   .then((receipt) => {
    //     endMinting(receipt);
    //   });
  };

  // ******************************************************
  // DAPP
  // ******************************************************
  const getData = () => {
    if (
      blockchain.account !== "" &&
      blockchain.account !== undefined &&
      blockchain.smartContract !== null
    ) {
      getMintStatus();
      // retriveWhitelistCount();
    }
  };

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  // ******************************************************
  // Connect Wallet
  // ******************************************************
  const connectWallet = () => {
    dispatch(connect());
    getData();
  };

  const dismissResult = () => {
    setPackIDS([]);
  };

  return (
    <div id="dapp">
      {packIDS.length ? (
        <div id="mint-result">
          <div className="wrapper">
            <h4>🎉 These are your NFTs 🎉</h4>
            <div id="cards">
              {packIDS.map((i, index) => (
                <div className="card" key={index}>
                  <img
                    src={
                      "https://www.ditothepug.com/wp-content/boo-cup/600/" +
                      i +
                      ".png"
                    }
                  />
                </div>
              ))}
            </div>
            <button onClick={dismissResult}>Dismiss</button>
          </div>
        </div>
      ) : null}

      <div>
        <div className="mint-wrapper">
          <h2>Get Yours</h2>
          <img src="/images/nft-placeholder.png" />
          <div className="mint-price">50 Matic</div>
          <div className="tools">
            <div className="selector">
              <button>-</button>
              <input defaultValue="1" />
              <button>+</button>
            </div>
            <MintButton
              onClick={mintNFT}
              account={blockchain.account}
              minting={claimingNft}
              onConnect={connectWallet}
              mintStatus={mintLive}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
