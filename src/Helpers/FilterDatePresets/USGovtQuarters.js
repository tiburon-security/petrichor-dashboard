import moment from 'moment';

var currentYear = moment().year();
var currentMonth = moment().month();

var fiscalYear = null;

// Determine what fiscal we're in relative to the month
// US Govt Fiscal Years start in October
if(currentMonth < 9){
	fiscalYear = currentYear - 1;
// Otherwise the calendar year is the fiscal year
} else {
	fiscalYear = currentYear;
}

// Based on the fiscal year, calculate the start date for Q1
// We base the remaining quarters based on this
let q1StartDate = moment({ year: fiscalYear, month :9, day :1 });

const presets = {
	label : "US Govt FY Quarters",
	data : [
		{
			text: 'Q1',
			start: q1StartDate,
			end: moment(q1StartDate).add(2, 'months').endOf('month')
		},
		{
			text: 'Q2',
			start: moment(q1StartDate).add(3, 'months'),
			end: moment(q1StartDate).add(5, 'months').endOf('month')
		},
		{
			text: 'Q3',
			start: moment(q1StartDate).add(6, 'months'),
			end: moment(q1StartDate).add(8, 'months').endOf('month')
		},
		{
			text: 'Q4',
			start: moment(q1StartDate).add(9, 'months'),
			end: moment(q1StartDate).add(11, 'months').endOf('month')
		}
	]
};

export default presets;