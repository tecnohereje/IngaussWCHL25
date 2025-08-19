import { Actor, HttpAgent, Identity } from "@dfinity/agent";
import { idlFactory } from "../../canister-declarations/";
// ../../../../.dfx/local/canisters/ingauss-backend-wchl25/service.did.js
// Import the canister ID from canister_ids.json
import canisterIds from "../../../../.dfx/local/canister_ids.json";
const canisterId = canisterIds["ingauss-backend-wchl25"].local;

export async function createBackendActor(identity: Identity) {
  const agent = await HttpAgent.create({ identity });

  // Only fetch root key in local development
  if (process.env.DFX_NETWORK !== "ic") {
    await agent.fetchRootKey();
  }

  return Actor.createActor(idlFactory, {
    agent,
    canisterId,
  });
}