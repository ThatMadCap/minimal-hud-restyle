import {DefaultBullet} from "@/components/ammos/default-bullet.tsx";

export const Ammo = ({ammoName, weaponAmmo, totalAmmo}: {
    ammoName: string,
    weaponAmmo: number,
    totalAmmo: number
}) => {
    ammoName
    
    return <>
        <div className={"grid grid-cols-2 gap-1"} style={{
            position: 'absolute',
            bottom: '2rem',
            right: '2rem',
            width:'5rem'
        }}>
            <div>
                <DefaultBullet/>
            </div>
            <div className={"flex flex-col justify-end items-center"}>
                <span className={"font-semibold text-2xl leading-4"} style={{color:"#06CE6B"}}>{weaponAmmo}</span>
                <span className={"font-semibold leading-4"}>{totalAmmo}</span>
            </div>
        </div>
    </>

}
