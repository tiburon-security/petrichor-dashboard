import { library } from '@fortawesome/fontawesome-svg-core'

import { 
	faEnvelope as farEnvelope 
} from '@fortawesome/free-regular-svg-icons'

import { 
	faCog as fasCog, 
	faArrowsAlt as fasArrowsAlt, 
	faEyeSlash as fasEyeSlash, 
	faPowerOff as fasPowerOff,
	faExclamationTriangle as fasExclamationTriangle,
	faSignOutAlt as fasSignOutAlt,
	faUser as fasUser,
	faBars as fasBars,
	faWrench as fasWrench,
	faWindowClose as fasWindowClose,
	faTimes as fasTimes,
	faChevronDown as fasChevronDown,
	faChartBar as fasChartBar,
	faSearch as fasSearch,
	faHome as fasHome,
	faPaw as fasPaw
} from '@fortawesome/free-solid-svg-icons'


export function init(){
	library.add(
		farEnvelope, 

		fasCog,
		fasArrowsAlt,
		fasEyeSlash,
		fasPowerOff,
		fasExclamationTriangle,
		fasSignOutAlt,
		fasUser,
		fasBars,
		fasWrench,
		fasWindowClose,
		fasTimes,
		fasChevronDown,
		fasChartBar,
		fasSearch,
		fasHome,
		fasPaw
	)
}
