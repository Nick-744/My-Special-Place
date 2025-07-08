import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GUI } from 'dat.gui'

/* Galaxy info */
const parameters = {}

parameters.count    = 100000
parameters.size     = 0.01
parameters.radius   = 5
parameters.branches = 3
parameters.spin     = 1

parameters.randomness      = 0.8
parameters.randomnessPower = 3 // Συμπίεση σημείων στο κέντρο

parameters.insideColor  = '#ff6030'
parameters.outsideColor = '#1b3984'

const generateColoredGeometry = () => {
    const colorInside  = new THREE.Color(parameters.insideColor)
    const ColorOutside = new THREE.Color(parameters.outsideColor)

    const positions = new Float32Array(parameters.count * 3)
    const colors    = new Float32Array(parameters.count * 3)
    for (let i = 0; i < parameters.count; i++)
    {
        const i3 = i * 3

        /* --- Position --- */
        const radius      = Math.pow(
            Math.random(), 1.5 // Με 1.5 φαίνεται κομπλέ...
        ) * parameters.radius
        // const radius      = Math.random() * parameters.radius
        // Αλλάζοντας το με το παραπάνω, υπάρχει μεγαλύτερη
        // συγκέντρωση τώρα στο κέντρο του γαλαξία [φαίνεται πιο φυσικό]!
        const spinAngle   = radius * parameters.spin
        const branchAngle = ((
            i % parameters.branches
        ) / parameters.branches) * Math.PI * 2

        const randomX = Math.pow(
            Math.random(), parameters.randomnessPower
        ) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness
        const randomY = Math.pow(
            Math.random(), parameters.randomnessPower
        ) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness
        const randomZ = Math.pow(
            Math.random(), parameters.randomnessPower
        ) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness

        positions[i3    ] = Math.cos(
            branchAngle + spinAngle
        ) * radius + randomX
        positions[i3 + 1] = randomY
        positions[i3 + 2] = Math.sin(
            branchAngle + spinAngle
        ) * radius + randomZ

        /* --- Χρώμμα --- */
        const mixedColor = colorInside.clone()
        // Επειδή το lerp μεταβάλλει την αρχική μεταβλητή!
        mixedColor.lerp(ColorOutside, radius / parameters.radius)

        colors[i3    ] = mixedColor.r
        colors[i3 + 1] = mixedColor.g
        colors[i3 + 2] = mixedColor.b
    }

    return [positions, colors];
}

/* ========== MAIN ========== */
const GenerateGalaxy = () => {
    const pointsRef = useRef()

    const setGalaxyAttribute = () => {
        if (!pointsRef.current) return;

        const [newPositions, newColors] = generateColoredGeometry()
        pointsRef.current.geometry.setAttribute(
            'position',
            new THREE.BufferAttribute(newPositions, 3)
        )
        pointsRef.current.geometry.setAttribute(
            'color',
            new THREE.BufferAttribute(newColors, 3)
        )

        return;
    }

    useEffect(() => {
        const gui = new GUI()

        /* --- Διαχείριση της μορφολογίας του γαλαξία --- */
        gui.add(parameters, 'count').min(100).max(1000000).step(100).onFinishChange(() => {
            setGalaxyAttribute()
        })
        gui.add(pointsRef.current.material, 'size', 0, 0.1)
        gui.add(parameters, 'radius').min(0.01).max(20).step(0.01).onFinishChange(() => {
            setGalaxyAttribute()
        })
        gui.add(parameters, 'branches').min(2).max(20).step(1).onFinishChange(() => {
            setGalaxyAttribute()
        })
        gui.add(parameters, 'spin').min(- 5).max(5).step(0.001).onFinishChange(() => {
            setGalaxyAttribute()
        })

        /* --- Random --- */
        gui.add(parameters, 'randomness').min(0).max(2).step(0.001).onFinishChange(() => {
            setGalaxyAttribute()
        })
        gui.add(parameters, 'randomnessPower').min(1).max(10).step(0.001).onFinishChange(() => {
            setGalaxyAttribute()
        })

        /* --- Διαχείριση χρωμμάτων --- */
        gui.addColor(parameters, 'insideColor').onFinishChange(() => {setGalaxyAttribute()})
        gui.addColor(parameters, 'outsideColor').onFinishChange(() => {setGalaxyAttribute()})

        return () => { gui.destroy() }
    }, [])

    const [positions, colors] = generateColoredGeometry()
    return (
        <>
            { /* --- Geometry --- */}
            <points ref = {pointsRef}>
                <bufferGeometry>
                    <bufferAttribute
                    attach   = 'attributes-position'
                    array    = {positions}
                    count    = {parameters.count}
                    itemSize = {3}
                    />
                    <bufferAttribute
                    attach   = 'attributes-color'
                    array    = {colors}
                    count    = {parameters.count}
                    itemSize = {3}
                    />
                </bufferGeometry>

                <pointsMaterial
                size            = {parameters.size}
                sizeAttenuation = {true}
                depthWrite      = {false}
                blending        = {THREE.AdditiveBlending}
                vertexColors    = {true}
                />
            </points>
        </>
    );
}

export default GenerateGalaxy;
