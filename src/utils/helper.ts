import dayjs from 'dayjs';

export const timeFormatMmHmSs = (dateStr: string) => {
    return dayjs(dateStr).format('hh:mm:ss');
};

export const convertTime12to24 = (time12h: string) => {
    let [hours, minutes, second] = time12h.split(/\W+/);

    return [Number(hours), Number(minutes), Number(second)];
};

export const transJsonl2Json = (jsonlData: string) => {
    const jsonlLines = jsonlData.split('\n');
    const jsonArray: any[] = [];
    jsonlLines.forEach((line) => {
        if (line) {
            const jsonObject = JSON.parse(line);
            jsonArray.push(jsonObject);
        }
    });
    return jsonArray;
};

export const dateFormatter = (date: Date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const changeMonth = month.toString().split('').length <= 1 ? `0${month}` : month;
    const changeDay = day.toString().split('').length <= 1 ? `0${day}` : day;
    return `${year}-${changeMonth}-${changeDay}`;
};

export const getYesterdayDate = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    return yesterday;
};

export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
