import { Tree, hierarchy } from '@visx/hierarchy'

import { Group } from '@visx/group'
import { LinearGradient } from '@visx/gradient'
import { LinkHorizontal } from '@visx/shape'
import { Zoomable } from './Zoomable'
import useForceUpdate from './useForceUpdate'
import { useState } from 'react'

export interface TreeNode {
	name: string
	isExpanded?: boolean
	children?: TreeNode[]
}

const defaultMargin = { top: 30, left: 30, right: 30, bottom: 70 }

export type LinkTypesProps = {
	data: TreeNode
	width: number
	height: number
	margin?: { top: number; right: number; bottom: number; left: number }
}

export const Example = ({
	width: totalWidth,
	height: totalHeight,
	margin = defaultMargin,
	data
}: LinkTypesProps) => {
	const [space, setSpace] = useState(1)
	const forceUpdate = useForceUpdate()

	const innerWidth = totalWidth - margin.left - margin.right
	const innerHeight = totalHeight - margin.top - margin.bottom

	const origin = { x: 0, y: 0 }
	const sizeWidth = innerHeight
	const sizeHeight = innerWidth

	return totalWidth < 10 ? null : (
		<>
			<input
				type='text'
				value={space}
				onChange={(e) => setSpace(+e.currentTarget.value)}
			/>
			<Zoomable width={totalWidth} height={totalHeight}>
				<LinearGradient id='links-gradient' from='#fd9b93' to='#fe6e9e' />
				<Group top={margin.top} left={margin.left}>
					<Tree
						root={hierarchy(data, (d) => (d.isExpanded ? null : d.children))}
						size={[sizeWidth * space, sizeHeight]}
						separation={(a, b) => (a.parent === b.parent ? 1 : 0.5) / a.depth + 0.5}
					>
						{(tree) => (
							<Group top={origin.y} left={origin.x}>
								{tree.links().map((link, i) => (
									<LinkHorizontal
										key={i}
										data={link}
										stroke='rgb(254,110,158,0.6)'
										strokeWidth='1'
										fill='none'
									/>
								))}

								{tree.descendants().map((node, key) => {
									const width = node.data.name.length * 5
									const height = 20

									const top = node.x
									const left = node.y

									return (
										<Group top={top} left={left} key={key}>
											<rect
												height={height}
												width={width}
												y={-height / 2}
												x={-width / 2}
												fill='#272b4d'
												stroke={
													node.data.children?.length ? 'rgb(254,110,158,0.6)' : 'white'
												}
												strokeWidth={1}
												strokeDasharray={node.data.children ? '0' : '2,2'}
												strokeOpacity={node.data.children ? 1 : 0.6}
												rx={node.data.children ? 0 : 10}
												onClick={() => {
													node.data.isExpanded = !node.data.isExpanded
													forceUpdate()
												}}
											/>
											<text
												dy='.33em'
												fontSize={9}
												fontFamily='Arial'
												textAnchor='middle'
												style={{ pointerEvents: 'none' }}
												fill={
													node.depth === 0 ? 'white' : node.children ? '#26deb0' : 'white'
												}
											>
												{node.data.name}
											</text>
										</Group>
									)
								})}
							</Group>
						)}
					</Tree>
				</Group>
			</Zoomable>
		</>
	)
}
