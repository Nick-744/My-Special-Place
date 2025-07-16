import { Stats } from '@react-three/drei'
import { useState } from 'react'

// Panel key meanings:
// 0: FPS (frames per second)         - higher is better
// 1: MS (frame time in milliseconds) - lower is better
// 2: MB (memory usage in MB)         - only works in some browsers (Chrome)

const PerformanceStats = () => {
	const [panel, setPanel] = useState(0)

	return (
		<>
			<Stats showPanel = {panel} />
			
			<div style = {{
				position: 'absolute',
				top:      0,
				right:    0,
				zIndex:   1000,
				background: 'rgba(0,0,0,0.5)',
				padding:    '4px',
				color:      'white'
			}}>
				<label>
				Panel:&nbsp;
					<select
					value = {panel}
					onChange = {(e) => setPanel(Number(e.target.value))}
					>
						<option value = {0}>FPS (Performance)</option>
						<option value = {1}>MS (Frame Time)</option>
						<option value = {2}>MB (Memory)</option>
					</select>
				</label>
			</div>
		</>
	);
}

export default PerformanceStats;
