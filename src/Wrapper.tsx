import { Example, TreeNode } from './Example'

import ParentSize from '@visx/responsive/lib/components/ParentSize'

export const Wrapper = ({ data }: { data: TreeNode }) => {
	return (
		<ParentSize>
			{({ width, height }) => (
				<Example data={data} width={width} height={height} />
			)}
		</ParentSize>
	)
}
