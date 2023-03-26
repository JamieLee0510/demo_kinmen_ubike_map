export type YoubikeHistoryItem = {
    StationUID: string;
    StationID: string;
    ServiceAvailable: number;
    AvailableRentBikes: number;
    AvailableReturnBikes: number;
    SrcUpdateTime: string;
    UpdateTime: string;
};

export type LineChartSeries = {
    name: string;
    type: string;
    stack: string;
    data: Array<null | number>;
};
