import {
    OrbitControls,
    Environment 
} from '@react-three/drei'
import { useControls } from 'leva'

const Scene = () => {
    // const {height, radius, scale} = useControls(
    //     {
    //         height: { value: 10, min: 0, max: 100 },
    //         radius: { value: 10, min: 0, max: 100 },
    //         scale:  { value: 10, min: 0, max: 100 }
    //     }
    // )
    const { toggle } = useControls({ toggle: true })

    return (
        <>
            <OrbitControls />

            <Environment
            files  = {'./HDRIs/rogland_clear_night_4k.hdr'}
            ground = {{
                height: 10,
                radius: 10,
                scale:  10
            }}
            />
        </>
    );
}

export default Scene;
