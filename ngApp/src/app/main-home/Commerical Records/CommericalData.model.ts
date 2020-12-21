import { CommericalRecord } from './CommericalRecord.model';
import { CommericalLawData } from './CommericalLawData.model';
import { CommericalActivityData } from './CommericalActivityData.model';
import { CommericalMangmentData } from './CommericalMangmentData.model';
import { CommericalAdditionalData } from './CommericalAdditionalData.model';
import { Partner } from './Partner.model';

export class CommericalData {
    CommercialRecordsDto: CommericalRecord;
    RecordLawDto: CommericalLawData;
    ActivityDto: CommericalActivityData;
    RecordManagementDto: CommericalMangmentData;
    AdditionalDataDto: CommericalAdditionalData;
    PartnerDto: [Partner];
    constructor(){
        this.CommercialRecordsDto = new CommericalRecord();
       this.RecordLawDto = new CommericalLawData();
        this.ActivityDto = new CommericalActivityData();
        this.RecordManagementDto = new CommericalMangmentData();
        this.AdditionalDataDto = new CommericalAdditionalData();
        this.PartnerDto = [new Partner()];
    }
}