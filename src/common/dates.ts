import dayjs from 'dayjs';
dayjs().format();

export function getEndDate(startDate = new Date()) {
	const endDate = dayjs(startDate).add(21, 'day').endOf('day');
	return endDate;
}
