// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { SismoConnect, SismoConnectServerConfig, AuthType, SismoConnectVerifiedResult } from '@sismo-core/sismo-connect-server';

import { devGroups } from "../../config"; // The DevGroups are in developing mode, and it overrides a group information
                                          // Needs to be changed to conect in reality with the real groups. 


const sismoConnectConfig: SismoConnectServerConfig = {
  appId: "0x9820513d88bf47db265d70a430173414",
  devMode: {
    enabled: true, 
  }
}

const sismoConnect = SismoConnect(sismoConnectConfig);

//With this SismoConnect instance, you can call the verify function which takes the claims , 
// the auths and the sismoConnectResponse sent by the frontend:

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<void>
) {
  const { response } = req.body;
  try {
    const result: SismoConnectVerifiedResult = await sismoConnect.verify(response, {
      //claims: [{groupId: "0xe9ed316946d3d98dfcd829a53ec9822e"}],
      claims: [{ groupId: devGroups[0].groupId }, { groupId: devGroups[1].groupId }, {groupId: devGroups[2].groupId }, { groupId: devGroups[3].groupId}],

      auths: [{authType: AuthType.VAULT}],
      signature: {message: "0x1234568"}
    });
    console.log("Response verified:", result.response);
    // vaultId = hash(userVaultSecret, appId). 
    // the vaultId is an app-specific, anonymous identifier of a vault
    console.log("VaultId: ", result.getUserId(AuthType.VAULT))
    res.status(200).send();
  } catch (e: any) {
    console.error(e);
    res.status(400).send();
  }
}