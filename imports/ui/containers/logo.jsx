import {compose} from 'react-komposer';

import LogoContainer from '../components/logo.jsx';

//Why I'm doing this... I don't actually know?
function composer(props,onData){
	onData(null,{})
}

export default compose(composer)(LogoContainer);