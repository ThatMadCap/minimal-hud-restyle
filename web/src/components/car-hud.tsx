import React, { useCallback, useMemo } from "react";
import { useNuiEvent } from "@/hooks/useNuiEvent";
import { usePlayerState } from "@/states/player";
import { useVehicleStateStore, type VehicleStateInterface } from "@/states/vehicle";
import { debug } from "@/utils/debug";
import Speedometer from "./ui/speedometer";
import { TextProgressBar } from "./ui/text-progress-bar";
import { FaGasPump, FaFireAlt } from 'react-icons/fa';
import { PiSeatbeltFill, PiEngineFill, PiHeadlightsFill } from "react-icons/pi";
import { useSkewedStyle, useSkewAmount } from "@/states/skewed-style";

const CarHud = React.memo(function CarHud() {
  const [vehicleState, setVehicleState] = useVehicleStateStore();
  const playerState = usePlayerState();
  const skewedStyle = useSkewedStyle();
  const skewedAmount = useSkewAmount();

  const handleVehicleStateUpdate = useCallback(
    (newState: VehicleStateInterface) => {
      setVehicleState((prevState) => {
        if (JSON.stringify(prevState) !== JSON.stringify(newState)) {
          return newState;
        }
        return prevState;
      });
    },
    [setVehicleState],
  );

  useNuiEvent<VehicleStateInterface>("state::vehicle::set", handleVehicleStateUpdate);

  const renderProgressBars = () => {
    return (
      <>
        <TextProgressBar icon={<FaGasPump />} value={vehicleState.fuel} iconSize="1.1vw" />
        <TextProgressBar icon={<FaFireAlt />} value={vehicleState.nos} />
        <TextProgressBar icon={<PiEngineFill />} value={vehicleState.engineHealth} />
        <TextProgressBar icon={<PiHeadlightsFill />} value={vehicleState.headlights} />
        <TextProgressBar icon={<PiSeatbeltFill />} value={playerState.isSeatbeltOn ? 100 : 0} iconSize="1.25vw" />
      </>
    );
  };

  const content = useMemo(() => {
    if (!playerState.isInVehicle) {
      debug("(CarHud) Returning with no children since the player is not in a vehicle.");
      return null;
    }

    return (
      <div
        className={"absolute bottom-8 right-16 w-fit h-fit mb-4 flex-col items-center flex justify-center gap-2"}
        style={skewedStyle ? {
          transform: `perspective(1000px) rotateY(-${skewedAmount}deg)`,
          backfaceVisibility: "hidden",
          transformStyle: "preserve-3d",
          willChange: "transform",
        } : undefined}
      >
        <Speedometer
          speed={vehicleState.speed}
          maxRpm={100}
          rpm={vehicleState.rpm}
          gears={vehicleState.gears}
          currentGear={vehicleState.currentGear}
          engineHealth={vehicleState.engineHealth}
          speedUnit={vehicleState.speedUnit}
        />
        <div className={"flex gap-2 items-center 4k:-mt-14 mt-2.5 ml-2"}>
          {renderProgressBars()}
        </div>
      </div>
    );
  }, [playerState.isInVehicle, vehicleState, playerState.isSeatbeltOn, skewedStyle]);

  return content;
});

export default CarHud;
