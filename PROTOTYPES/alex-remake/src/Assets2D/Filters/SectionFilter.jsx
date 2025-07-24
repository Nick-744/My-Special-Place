import { globalVarContext } from '../../Context/GlobalContext'

const SectionFilter = () => {
	const globalContext = useContext(globalVarContext)
	const setSectionFilter = globalContext.eventRefsContext

    console.log(setSectionFilter)

	return (
		<div>
			{/* Section filter UI components go here */}
		</div>
	)
}
