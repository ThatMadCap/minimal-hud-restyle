import {useNuiEvent} from "@/hooks/useNuiEvent";
import {usePlayerState} from "@/states/player";
import {
    useVehicleStateStore,
    type VehicleStateInterface,
} from "@/states/vehicle";
import {debug} from "@/utils/debug";
import React, {useCallback, useMemo} from "react";
import Speedometer from "./ui/speedometer";
import {TextProgressBar} from "./ui/text-progress-bar";

const CarHud = React.memo(function CarHud() {
    const [vehicleState, setVehicleState] = useVehicleStateStore();
    const playerState = usePlayerState();

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

    useNuiEvent<VehicleStateInterface>(
        "setVehicleState",
        handleVehicleStateUpdate,
    );

    const content = useMemo(() => {
        if (!playerState.isInVehicle) {
            debug(
                "(CarHud) Returning with no children since the player is not in a vehicle.",
            );
            return null;
        }

        return (
            <>
                <div
                    className={
                        "absolute bottom-8 right-24 w-fit h-fit mb-4" +
                        " flex-col items-center flex justify-center gap-2"
                    }
                    style={{
                        transform: "perspective(1000px) rotateY(-12deg)",
                        backfaceVisibility: "hidden",
                        transformStyle: "preserve-3d",
                        willChange: "transform",
                    }}
                >
                    <Speedometer
                        rpm={vehicleState.rpm}
                        speed={vehicleState.speed}
                        gears={vehicleState.gears}
                        engineHealth={vehicleState.engineHealth}
                        maxRpm={100}
                    />
                    <div className={"flex gap-2 items-center mr-2 4k:-mt-14"}>
                        <TextProgressBar label="FUEL"
                                         value={vehicleState.fuel}/>
                        <TextProgressBar label="NOS" value={vehicleState.nos}/>
                        <TextProgressBar
                            label="ENG"
                            value={vehicleState.engineState ? 100 : 0}
                        />
                        <TextProgressBar
                            label="BELT"
                            value={playerState.isSeatbeltOn ? 100 : 0}
                        />

                    </div>

                </div>
            </>
        );
    }, [playerState.isInVehicle, vehicleState, playerState.isSeatbeltOn]);

    return content;
});

export default CarHud;
