// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import {DookieUser} from "contracts/DookieUser.sol";

contract DeployDookieUser is Script {
    bytes16 public constant APP_ID = 0x9820513d88bf47db265d70a430173414; // My App Id
    bytes16 public constant GROUP_ID = 0x311ece950f9ec55757eb95f3182ae5e2;
    bytes16 public constant GROUP_ID_2 = 0x1cde61966decb8600dfd0749bd371f12;
    bytes16 public immutable GROUP_ID_VOTE_ENS = 0x7fa46f9ad7e19af6e039aa72077064a1;
  //bytes16 public immutable GROUP_ID_LENS = ;
    bytes16 public immutable GROUP_ID_ETHTRANSACTIONS = 0x94bf7aea2a6a362e07e787a663271348 ;

    function run() public {
        vm.startBroadcast();
        DookieUser dookieuser = new DookieUser({name: "My airdropUser contract", symbol: "AIR2", appId: APP_ID, groupId: GROUP_ID, groupId2: GROUP_ID_2, groupId_ens: GROUP_ID_VOTE_ENS, groupId_ethtransactions: GROUP_ID_ETHTRANSACTIONS});

        console.log("CookieUser Contract deployed at", address(dookieuser));
        vm.stopBroadcast();
    }
}