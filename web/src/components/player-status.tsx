import { useNuiEvent } from "@/hooks/useNuiEvent";
import { MinimapStateInterface, useMinimapStateStore } from "@/states/minimap";
import { PlayerStateInterface, usePlayerStateStore } from "@/states/player";
import React, { useCallback, useMemo } from "preact/compat";
import { GiAbdominalArmor } from "react-icons/gi";
import { FaBottleWater, FaBrain, FaMicrophone, FaPersonSwimming, FaPersonRunning } from "react-icons/fa6";
import { IoFastFood } from "react-icons/io5";
import { TiHeartFullOutline } from "react-icons/ti";
import { StatBar, StatBarSegmented } from "./ui/status-bars";

const PlayerStatus = () => {
  const [playerState, setPlayerState] = usePlayerStateStore();
  const [minimap, setMinimapState] = useMinimapStateStore();

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

  useNuiEvent<{ minimap: MinimapStateInterface; player: PlayerStateInterface }>("state::global::set", (data) => {
    handlePlayerStateUpdate(data.player);
    setMinimapState(data.minimap);
  });

  const isUsingFramework = useMemo(() => {
    return playerState.hunger !== undefined || playerState.thirst !== undefined;
  }, [playerState]);

  return (
    <>
      <div
        class="absolute items-end justify-center z-20 flex"
        style={{
          top: minimap.top + "px",
          left: minimap.left + "px",
          width: minimap.width * 2 + "px",
          height: minimap.height + "px",
        }}
      >
        <div
          className="w-full h-full relative"
          
           // Uncomment this if you reall want that skewed look.
          style={{
            transform: "perspective(1000px) rotateY(12deg)",
            backfaceVisibility: "hidden",
            transformStyle: "preserve-3d",
            willChange: "transform",
          }}
        >
          <div className={"absolute -bottom-12 w-full flex gap-3 items-center justify-start"}>
            <div className={"flex flex-col w-2/4 items-center justify-center gap-1"}>
              <StatBarSegmented Icon={GiAbdominalArmor} value={playerState.armor} color="#2B78FC" />
              <StatBar Icon={TiHeartFullOutline} value={playerState.health} color="#06CE6B" maxValue={100} />
            </div>
            {isUsingFramework && (
              <>
                <div className="w-2/4 flex gap-3">
                  {typeof playerState.mic === "boolean" && playerState.mic === true ? <StatBar Icon={FaMicrophone} value={playerState.mic ? 100 : 0} color="#FFFF00" vertical /> : typeof playerState.voice === "number" ? <StatBar Icon={FaMicrophone} value={playerState.voice} color="#ffffff" vertical /> : null}

                  <StatBar Icon={IoFastFood} value={playerState.hunger} color="#FB8607" vertical />
                  <StatBar Icon={FaBottleWater} value={playerState.thirst} color="#2B78FC" vertical /> 
                  {playerState.oxygen < 100 && ( <StatBar Icon={FaPersonSwimming} value={playerState.oxygen} color="#00d4ff" vertical /> )} 
                  {playerState.stamina < 100 && ( <StatBar Icon={FaPersonRunning} value={playerState.stamina} color="#63e6be" vertical /> )}
                  {typeof playerState.stress === "number" && playerState.stress > 0 && <StatBar Icon={FaBrain} value={playerState.stress} color="#FE2436" vertical />}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(PlayerStatus);
