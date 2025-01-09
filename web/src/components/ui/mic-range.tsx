import {usePlayerState} from "@/states/player.ts";
import {useState} from "react";

export const MicRange = ({range,isTalking}: { range: number,isTalking:boolean }) => {
    const [playerMicRange, setPlayerMicRange] = useState<number>(1);
    
    if (range === 50) {
        setPlayerMicRange(2);
    } else if (range < 50) {
        setPlayerMicRange(1)
    } else if (range > 50) {
        setPlayerMicRange(3)
    }
    const styles = {
        playerMicRangWrapper: {
            position: 'absolute',
            bottom: '2vh',
            right: '2vw',
            width: '5vh',
            height: '0.5vh',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, auto)',
            gap: '0.5vh'
        },
        playerMicRangeBar: {
            border: '1px solid rgba(165, 165, 165, 0.582)',
            backgroundColor: 'rgba(39, 39, 39, 0.664)',
            boxShadow: '0 0 2px rgba(39, 39, 39, 0.664)',
            borderRadius: '0.1vh'
        },
        playerMicBarActive: {
            backgroundColor: '#06CE6B',
            boxShadow: '0 0 2px #06CE6B',
            borderRadius: '0.1vh'
        },
        playerMicTalking: {
            backgroundColor: '#FFFF00',
            borderRadius: '0.1vh'
        }
    };
    return (
        <div style={styles.playerMicRangWrapper}>
            {Array.from({length: 3}, (_, index) => {
                let style;

                if (isTalking) {
                    style = index < playerMicRange ? styles.playerMicTalking : styles.playerMicRangeBar;
                } else {
                    style = index < playerMicRange ? styles.playerMicBarActive : styles.playerMicRangeBar;
                }
                    return <div
                        key={index}
                        style={style}
                    ></div>
                }
            )}
        </div>
    )
}