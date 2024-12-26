import { ChangeEventHandler, useState } from 'react'

import { Wrapper } from './Wrapper'

export const App = () => {
	const [data, setData] = useState('')

	const handleData: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
		setData(e.currentTarget.value)
	}

	if (!data) {
		return <textarea value={data} onChange={handleData} />
	}

	return (
		<div className='wrapper'>
			<Wrapper data={JSON.parse(data)} />
		</div>
	)
}
