export class CommericalRecord {
    RecordSerial?:number;
    RecordNumber:number;
    OwnerName: string;
    CityCode: number;
    CityName?: string;
    RegionCode: number;
    RegionName?: string;
    OrganizationType: number;
    CategoryCode?: number;
    SubCategoryCode?: number;
    StartDateFrom?: Date;
    StartDateTo?: Date;
    StartDate: Date;
    IsBankrupted?: boolean;
    IsVoided?: boolean;
    HasCard?: boolean;
    IsDoublicated?: boolean;
    IsBandar?: boolean;
    PaidYear1?: number;
    PaidYear2?: number
    LastUser?:string;
    Capital1: number;
    Capital2: number;
    Phone: number;
    Address?:string;
    Unpaid?:number;
    Notes?:string;
    Amount?:number;
    Amount2?:number;
    CategoriedList:Array<string>;
    IsRealStartDate?:boolean
}