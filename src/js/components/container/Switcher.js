import React from 'react';
import { AppContext } from '../../context/AppContext';

const Switcher = ({
	leftLabel,
	rightLabel,
	status,
	type,
	onChange,
	subId
}) => {

	const context = React.useContext(AppContext)

	let { locale } = context
		
        return (
			<div
				className="switch-field text-capitalize"
			>
				<input
					type="radio"
					id={type.replace(/ /g, '_') + "_left" + ":" + subId}
					name="switch"
					value={1}
					onChange={onChange}
					checked={status == 1}
				/>
				<label htmlFor={type.replace(/ /g, '_') + "_left" + ":" + subId}>{locale.texts[leftLabel.toUpperCase()]}</label>

				<input
					type="radio"
					id={type.replace(/ /g, '_') + "_right" + ":" + subId}
					name="switch"
					value={0}
					onChange={onChange}
					checked={status == 0}
				/>
				<label htmlFor={type.replace(/ /g, '_') + "_right" + ":" + subId}>{locale.texts[rightLabel.toUpperCase()]}</label>
			</div>
		);
}

export default Switcher;