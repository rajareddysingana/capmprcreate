namespace com.kyyte.icecream;

using {managed, Currency} from '@sap/cds/common';

entity ProcessFlows {
    key ID                : Integer;
        Lane              : Integer;
        Title             : localized String;
        TitleAbbreviation : String(3);
        State             : String;
        StateText         : String;
        Focused           : Boolean;
}


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
