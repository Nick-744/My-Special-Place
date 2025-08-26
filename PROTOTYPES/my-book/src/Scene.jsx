import { Loader, CameraControls, Float } from '@react-three/drei'
import { Suspense, useState, useRef, useEffect } from 'react'
import { useTheme, useMediaQuery } from '@mui/material'
import TextOverlay from './Assets2D/TextOverlay.jsx'
import ModalImage from './Assets2D/ModalImage.jsx'
import BookTouch from './Assets3D/BookTouch.jsx'
import CameraControlsLib from 'camera-controls'
import { Canvas } from '@react-three/fiber'
import Book from './Assets3D/Book.jsx'
import UI from './Assets2D/UI'

const Scene = () => {
	// ----- Mobile View Detection ----- //
	const theme             = useTheme()
	const mobileViewContext = useMediaQuery(theme.breakpoints.down('md'))

	// ----- Modal Image Handling ----- //
	const [modalImageSrc, setModalImageSrc] = useState(null)
	const [modalOpen, setModalOpen]         = useState(false)

    // ----- Touch Capability Detection (desktop touch screens) ----- //
    const [isTouchCapable, setIsTouchCapable] = useState(false)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const touch =
                'ontouchstart' in window       ||
                navigator.maxTouchPoints   > 0 ||
                navigator.msMaxTouchPoints > 0
            setIsTouchCapable(touch)
        }
    }, [])
    const desktopTouch  = !mobileViewContext && isTouchCapable
    const BookComponent = desktopTouch ? BookTouch : Book

    // ----- Text Overlay Handling ----- //
	const [textOverlayOpen, setTextOverlayOpen]         = useState(false)
	const [currentLeftContent, setCurrentLeftContent]   = useState(null)
	const [currentRightContent, setCurrentRightContent] = useState(null)
	
	const handleCurrentPageChange = (leftContent, rightContent) => {
		setCurrentLeftContent(leftContent)
        setCurrentRightContent(rightContent)
    }

    const handleShowTextOverlay  = () => { setTextOverlayOpen(true) }
    const handleCloseTextOverlay = () => { setTextOverlayOpen(false) }

	// ----- Camera Reset Function ----- //
	const cameraControlsRef = useRef()
    const handleCameraReset = () => {
        if (cameraControlsRef.current) cameraControlsRef.current.reset(true)
    }
	
	return (
		<div id = 'canvas-container' className = 'w3-animate-opacity'>
			{/* React component element that renders a loading
				indicator within the 3D scene application. */}
			<Loader />

			{/* Makes the loading bar working, not going 0 -> 1! */}
			<Suspense fallback = {null}>
				
				{ /* --- 3D Elements --- */ }
				<Canvas
				camera = {{
					position: [0, 1.8, 2],
					fov:      mobileViewContext ? 85 : 45
				}}
				shadows
				>
					<group position-y = {0}>
						{/* Lighting and shadows */}
						<ambientLight intensity = {1} />
						<directionalLight
						position  = {[4, 5, 4]}
						intensity = {0.8}
						color     = '#ffffff'
						castShadow
						shadow-mapSize-width  = {2048}
						shadow-mapSize-height = {2048}
						/>
						<directionalLight
						position   = {[-2, 4, 3]}
						intensity  = {0.5}
						color      = '#f0f8ff'
						castShadow = {false}
						/>

						{/* Camera controls:
                            - Desktop (mouse): normal controls
                            - Desktop touch:   only 2-finger (pinch / two-finger drag)
                        */}
                        {!mobileViewContext &&
                            <CameraControls
                            ref = {cameraControlsRef}

                            /* Camera rotation limits */
                            minPolarAngle  = {0}
                            maxPolarAngle  = {Math.PI / 2}
                            minAzimuthAngle = {-Math.PI / 3}
                            maxAzimuthAngle = { Math.PI / 3}

                            /* Zoom / distance limits */
                            minDistance = {1.5}
                            maxDistance = {4.5}
                            zoomSpeed   = {0.8}

                            /* Touch behavior (only enable 2-finger on desktop touch) */
                            touches = {desktopTouch ? {
                                one:   CameraControlsLib.ACTION.NONE,
                                two:   CameraControlsLib.ACTION.TOUCH_ROTATE,
                                three: CameraControlsLib.ACTION.TOUCH_DOLLY_TRUCK
                            } : undefined}
                            />
                        }

						<Float
						rotation-x        = {-Math.PI / 4}
						floatIntensity    = {0.8}
						speed             = {2}
						rotationIntensity = {0.8}
						>
							<BookComponent
							setModalImageSrc    = {setModalImageSrc}
							setModalOpen        = {setModalOpen}
							onCurrentPageChange = {handleCurrentPageChange}
							/>
						</Float>

						{ /* Ground Plane */ }
						<mesh
						position-y = {-2.5}
						rotation-x = {-Math.PI / 2}
						receiveShadow
						>
							<planeGeometry args = {[100, 100]} />
							<shadowMaterial transparent opacity = {0.2} />
						</mesh>
					</group>
				</Canvas>

				{ /* --- 2D Elements / UI --- */ }
				<UI
				mobileView = {mobileViewContext}

				onShowTextOverlay   = {handleShowTextOverlay}
				currentLeftContent  = {currentLeftContent}
				currentRightContent = {currentRightContent}

				handleCameraReset = {handleCameraReset}
				/>

				<ModalImage
				imageSrc = {modalImageSrc}
				open     = {modalOpen}
				onClose  = {() => setModalOpen(false)}
				/>

				<TextOverlay
				leftContent  = {currentLeftContent}
				rightContent = {currentRightContent}
				open         = {textOverlayOpen}
				onClose      = {handleCloseTextOverlay}
				/>

			</Suspense>
		</div>
	);
}

export default Scene;
