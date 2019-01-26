import moment from 'moment';

var currentYear = moment().year();

const presets = {
	label : "Calendar Year Quarters",
	data : [
		{
			text: 'Q1',
			start: moment({ year :currentYear, month :0, day :1 }),
			end: moment({ year :currentYear, month :2, day :1 }).endOf('month')
		},
		{
			text: 'Q2',
			start: moment({ year :currentYear, month :3, day :1 }),
			end: moment({ year :currentYear, month :5, day :1 }).endOf('month')
		},
		{
			text: 'Q3',
			start: moment({ year :currentYear, month :6, day :1 }),
			end: moment({ year :currentYear, month :8, day :1 }).endOf('month')
		},
		{
			text: 'Q4',
			start: moment({ year :currentYear, month :9, day :1 }),
			end: moment({ year :currentYear, month :11, day :1 }).endOf('month')
		}
	]
};

export default presets;