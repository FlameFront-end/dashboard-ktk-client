import styled from 'styled-components'
import { Table } from 'antd'

export const StyledLessonTable = styled(Table)`
	overflow: auto;

	@media (hover: none) and (pointer: coarse) {
		-ms-overflow-style: none;
		scrollbar-width: none;

		&::-webkit-scrollbar {
			width: 0;
			height: 0;
		}
	}
`
