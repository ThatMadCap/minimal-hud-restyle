import { useNuiEvent } from "@/hooks/useNuiEvent";
import { useMinimapState } from "@/states/minimap";
import { PlayerStateInterface, usePlayerStateStore } from "@/states/player";
import React, { useCallback, useMemo } from "preact/compat";
import {MicRange} from "@/components/ui/mic-range.tsx";
import { Ammo } from "./ui/ammo";

const PlayerAdditional = () => {
  const [playerState, setPlayerState] = usePlayerStateStore();
  const minimap = useMinimapState();

  const handlePlayerStateUpdate = useCallback(
    (newState: PlayerStateInterface) => {
      setPlayerState((prevState) => {
        if (JSON.stringify(prevState) !== JSON.stringify(newState)) {
          return newState;
        }
        return prevState;
      });
    },
    [setPlayerState],
  );

  useNuiEvent<PlayerStateInterface>("setPlayerState", handlePlayerStateUpdate);

  const isUsingFramework = useMemo(() => {
    return playerState.hunger !== undefined || playerState.thirst !== undefined;
  }, [playerState]);
  let button;
  if(playerState.weapon && playerState.weapon.metadata.ammo && playerState.ammoInInventory!=null){
    button = <>
    <Ammo ammoName={playerState.weapon.label} weaponAmmo={playerState.weapon.metadata.ammo} totalAmmo={playerState.ammoInInventory} />
    
    </>
  }
  
  return <>
  {button}
  <MicRange range={playerState.voice} isTalking={playerState.mic}/>
  </>
  ;
};

export default React.memo(PlayerAdditional);
