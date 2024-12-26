import { PropsWithChildren } from 'react'
import { Zoom } from '@visx/zoom'

interface Props extends PropsWithChildren {
	width: number
	height: number
}

export const Zoomable = ({ width, height, children }: Props) => {
	const initialTransform = {
		scaleX: 1,
		scaleY: 1,
		translateX: 0,
		translateY: 0,
		skewX: 0,
		skewY: 0
	}

	return (
		<Zoom
			width={width}
			height={height}
			scaleXMin={0}
			scaleXMax={4}
			scaleYMin={0}
			scaleYMax={4}
			initialTransformMatrix={initialTransform}
		>
			{(zoom) => (
				<div>
					<svg
						width={width}
						height={height}
						style={{ cursor: zoom.isDragging ? 'grab' : 'auto' }}
					>
						<rect
							width={width}
							height={height}
							fill='#262d37'
							onWheel={zoom.handleWheel}
							onMouseDown={zoom.dragStart}
							onMouseMove={zoom.dragMove}
							onMouseUp={zoom.dragEnd}
							onMouseLeave={zoom.dragEnd}
						/>
						<g transform={zoom.toString()}>{children}</g>
					</svg>
				</div>
			)}
		</Zoom>
	)
}
