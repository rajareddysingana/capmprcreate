using {com.kyyte.icecream as icecream} from '../db/schema';

@path: 'service/icecream'
service ProcessFlowService {
    entity ProcessFlows as projection on icecream.ProcessFlows;


    type PurchaseRequisitionHeader {
        CompanyCode :      Integer;
        DeliverTo   :      String;
        // NeedBy      :      DateTime;
        Items       : many PurchaseRequisitionItems;
    }

    type PurchaseRequisitionItems {
        NumberInCollection : Integer;
        Quantity           : Integer;
        ShipTo             : Integer;
        BillingAddress     : Integer;
        CommodityCode      : Integer;
        Description        : String;
        Price              : Integer;
        Currency           : String(3);
        UnitOfMeasure      : String(2);

    };


    type Response : {
        status     : Integer;
        statusText : String;
        data       : String;
    }

    action createPurchaseRequisition(RequisitionPayload : PurchaseRequisitionHeader) returns Response;

}
