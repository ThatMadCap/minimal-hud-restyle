import {DefaultBullet} from "@/components/ammos/default-bullet.tsx";

export const Ammo = ({ammoName, weaponAmmo, totalAmmo}: {
    ammoName: string,
    weaponAmmo: number,
    totalAmmo: number
}) => {

    return <>
        <div style={{
            position: 'absolute',
            bottom: '4vh',
            right: '4vw',
            height: '3.5vh',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, auto)',
            gap: '0.5vh'
        }}>
            <DefaultBullet/>
        </div>
        <div style={{
            position: 'absolute',
            bottom: '3vh',
            right: '2.52vw',
        }}
             className={"flex flex-col justify-center items-center"}>
            <span className={"font-semibold text-2xl"} style={{color:"#06CE6B"}}>{weaponAmmo}</span>
            <span className={"font-semibold"}>{totalAmmo}</span>
        </div>
    </>

}
