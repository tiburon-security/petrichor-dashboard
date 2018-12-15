import moment from 'moment';

const today = moment();
const tomorrow = moment().add(1, 'day');

let presets = [
	{
		text: 'Today',
		start: today,
		end: today
	},
	{
		text: 'Yesterday',
		start: tomorrow,
		end: tomorrow
	},
	{
		text: 'Last Week',
		start: moment().subtract(1, 'week'),
		end: today
	},
	{
		text: 'Last Month',
		start: moment().subtract(1, 'month'),
		end: today
	}
];

export default presets;