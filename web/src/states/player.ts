import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";

export interface PlayerStateInterface {
  health: number;
  armor: number;
  hunger: number;
  thirst: number;
  stress: number | string;
  streetLabel: string;
  areaLabel: string;
  heading: string;
  isSeatbeltOn: boolean;
  isInVehicle: boolean;
  mic : boolean;
  voice : number;
  weapon: PlayerWeaponInterface | null;
  ammoInInventory: number | null

}

export interface PlayerWeaponInterface {
  ammo?:string
  label:string
  metadata:{
    ammo?:number
  }
  name:string
}

const mockPlayerState: PlayerStateInterface = {
  health: 100,
  armor: 100,
  hunger: 50,
  thirst: 100,
  stress: 0,
  voice : 50,
  streetLabel: "Downtown Vinewood",
  areaLabel: "Vinewood Blvd",
  heading: "NW",
  isSeatbeltOn: false,
  isInVehicle: true,
  mic: true,
  weapon: null,
  ammoInInventory: 100
};


const playerState = atom<PlayerStateInterface>(mockPlayerState);

export const usePlayerState = () => useAtomValue(playerState);
export const useSetPlayerState = () => useSetAtom(playerState);
export const usePlayerStateStore = () => useAtom(playerState);
