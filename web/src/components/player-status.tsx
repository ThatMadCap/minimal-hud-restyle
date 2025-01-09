import { useNuiEvent } from "@/hooks/useNuiEvent";
import { useMinimapState } from "@/states/minimap";
import { PlayerStateInterface, usePlayerStateStore } from "@/states/player";
import React, { useCallback, useMemo } from "preact/compat";
import { BiSolidShieldAlt2 } from "react-icons/bi";
import { FaBottleWater, FaBrain , FaMicrophone } from "react-icons/fa6";
import { IoFastFood } from "react-icons/io5";
import { TiHeartFullOutline } from "react-icons/ti";
import { StatBar, StatBarSegmented } from "./ui/status-bars";
import {MicRange} from "@/components/ui/mic-range.tsx";

const PlayerStatus = () => {
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


  return (
    <>
        <div
            class="absolute items-end justify-center border-red-500 z-20 flex"
            style={{
                transform: "perspective(1000px) rotateY(12deg)",
                backfaceVisibility: "hidden",
                transformStyle: "preserve-3d",
                willChange: "transform",
                top: minimap.top + "%",
                left: minimap.left + "%",
                minWidth: minimap.width + "px",
                height: minimap.height + 50 + "px",
            }}
        >
            <div
                className={"w-full flex relative gap-3 items-center justify-center"}
            >
                <div
                    className={"flex flex-col w-full items-center justify-center gap-1"}
                >
                    <StatBarSegmented
                        Icon={BiSolidShieldAlt2}
                        value={playerState.armor}
                        color="#2B78FC"
                    />
                    <StatBar
                        Icon={TiHeartFullOutline}
                        value={playerState.health}
                        color="#06CE6B"
                        maxValue={100}
                    />
                </div>
                {isUsingFramework && (
                    <>
                        {/* {typeof playerState.mic === "boolean" && playerState.mic === true ? (
                            <StatBar
                                Icon={FaMicrophone}
                                value={playerState.mic ? 100 : 0}
                                color="#FFFF00"
                                vertical
                            />
                        ) : typeof playerState.voice === "number" ? (
                            <StatBar
                                Icon={FaMicrophone}
                                value={playerState.voice}
                                color="#ffffff"
                                vertical
                            />
                        ) : null} */}

                        <StatBar Icon={IoFastFood}
                                 value={playerState.hunger}
                                 color="#FB8607"
                                 vertical/>
                        <StatBar
                            Icon={FaBottleWater}
                            value={playerState.thirst}
                            color="#2B78FC"
                            vertical/>
                        {typeof playerState.stress === "number" &&
                            playerState.stress > 0 && (
                                <StatBar
                                    Icon={FaBrain}
                                    value={playerState.stress}
                                    color="#FE2436"
                                    vertical
                                />
                            )}

                    </>
                )}
            </div>
        </div>
    </>
  );
};

export default React.memo(PlayerStatus);
