"use strict";

const logger = cds.log('logger');
// const cloudSDK = require("@sap-cloud-sdk/core");
const registerDestination = require('@sap-cloud-sdk/connectivity');
const { default: axios } = require("axios");


function _getLineItemPayload(aLineItems) {
    var sXML = '';
    aLineItems && aLineItems.forEach((oLineItem) => {
        sXML = sXML + `
        <urn:item>
        <urn:NumberInCollection>1</urn:NumberInCollection>
        <urn:Quantity>1</urn:Quantity>
        <urn:ShipTo>
            <urn:UniqueName>3000</urn:UniqueName>
        </urn:ShipTo>
        <urn:BillingAddress>
            <urn:UniqueName>3000</urn:UniqueName>
        </urn:BillingAddress>
        <urn:CommodityCode>
            <urn:UniqueName>012</urn:UniqueName>
        </urn:CommodityCode>
        <urn:Description>
            <urn:Price>
                <urn:Currency>
                    <urn:UniqueName>USD</urn:UniqueName>
                </urn:Currency>
                <urn:Amount>2000.0</urn:Amount>
            </urn:Price>
            <urn:CommonCommodityCode>
                <urn:Domain>unspsc</urn:Domain>
                <urn:UniqueName>43211507</urn:UniqueName>
            </urn:CommonCommodityCode>
            <urn:Description>Desktop</urn:Description>
            <urn:UnitOfMeasure>
                <urn:UniqueName>EA</urn:UniqueName>
            </urn:UnitOfMeasure>
        </urn:Description>
        <urn:ImportedItemCategoryStaging>
            <urn:UniqueName>D</urn:UniqueName>
        </urn:ImportedItemCategoryStaging>
        <urn:ImportServiceDetailsStaging>
            <urn:ExpectedAmount>
                <urn:Amount>200.00</urn:Amount>
                <urn:Currency>
                    <urn:UniqueName>USD</urn:UniqueName>
                </urn:Currency>
            </urn:ExpectedAmount>
            <urn:MaxAmount>
                <urn:Amount>200.00</urn:Amount>
                <urn:Currency>
                    <urn:UniqueName>USD</urn:UniqueName>
                </urn:Currency>
            </urn:MaxAmount>
            <urn:ServiceEndDate>2024-06-30T00:00:00</urn:ServiceEndDate>
            <urn:RequiresServiceEntry>true</urn:RequiresServiceEntry>
            <urn:ServiceStartDate>2023-06-30T00:00:00</urn:ServiceStartDate>
        </urn:ImportServiceDetailsStaging>
        <urn:ImportedAccountCategoryStaging>
            <urn:UniqueName>K</urn:UniqueName>
        </urn:ImportedAccountCategoryStaging>
        <urn:ImportedAccountTypeStaging>CostCenter</urn:ImportedAccountTypeStaging>
        <urn:ImportedAccountingsStaging>
            <urn:SplitAccountings>
                <urn:item>
                    <urn:Quantity>1</urn:Quantity>
                    <urn:CostCenter>
                        <urn:CompanyCode>
                            <urn:UniqueName>3000</urn:UniqueName>
                        </urn:CompanyCode>
                        <urn:UniqueName>0000009154</urn:UniqueName>
                    </urn:CostCenter>
                    <urn:GeneralLedger>
                        <urn:CompanyCode>
                            <urn:UniqueName>3000</urn:UniqueName>
                        </urn:CompanyCode>
                        <urn:UniqueName>0000400200</urn:UniqueName>
                    </urn:GeneralLedger>
                    <urn:InternalOrder>
                        <urn:UniqueName/>
                    </urn:InternalOrder>
                    <urn:Asset>
                        <urn:CompanyCode>
                            <urn:UniqueName/>
                        </urn:CompanyCode>
                        <urn:UniqueName/>
                        <urn:SubNumber/>
                    </urn:Asset>
                    <urn:NumberInCollection>1</urn:NumberInCollection>
                    <urn:Percentage>100</urn:Percentage>
                    <urn:ProcurementUnit>
                        <urn:UniqueName/>
                    </urn:ProcurementUnit>
                </urn:item>
            </urn:SplitAccountings>
            <urn:Type>
                <urn:UniqueName>_Percentage</urn:UniqueName>
            </urn:Type>
        </urn:ImportedAccountingsStaging>
        <urn:ImportedDeliverToStaging>Murali</urn:ImportedDeliverToStaging>
        <urn:ImportedLineCommentStaging>Test</urn:ImportedLineCommentStaging>
        <urn:ImportedNeedByStaging>2023-06-30T00:00:00</urn:ImportedNeedByStaging>
        <urn:ItemTypeCategory>1</urn:ItemTypeCategory>
        <urn:IsServiceChild>false</urn:IsServiceChild>
        <urn:OriginatingSystemLineNumber>1</urn:OriginatingSystemLineNumber>
        <urn:PurchaseGroup>
            <urn:UniqueName>100</urn:UniqueName>
        </urn:PurchaseGroup>
        <urn:PurchaseOrg>
            <urn:UniqueName>3000</urn:UniqueName>
        </urn:PurchaseOrg>
        <urn:Supplier>
            <urn:UniqueName>1000003550</urn:UniqueName>
        </urn:Supplier>
    </urn:item>`;
    });

    return sXML;
}

async function doImportReqToAriba(req) {
    // Add Local Destination for Testing
    /* const destination = {
         name: 'PRCreate',
         url: 'https://s1.ariba.com/Buyer/soap/KYYTEDSAPP-1-T/RequisitionImportAsyncPull',
         forwardAuthToken: true
       };
 
       registerDestination(destination, options);*/

    let oDestination = await registerDestination.getDestination({ destinationName: "PRCreate" });

    if (!oDestination) {
        logger.error(`Destination does not exist or is incorrectly configured`);
        throw Error("Destination does not exist or is incorrectly configured");
    }

    let oRequestConfig = await registerDestination.executeHttpRequest({ destinationName: oDestination });
    //  oRequestConfig.method = "post";
    //  oRequestConfig.headers["Accept"] = oRequestConfig.headers["Content-Type"] = "application/xml";

    // process the price and supplier changes
    var sLineItemsXML = _getLineItemPayload(req.Items);

    const sXmlBodyStr = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:Ariba:Buyer:vrealm_2421">
    <soapenv:Header>
        <urn:Headers>
            <urn:variant>vrealm_2421</urn:variant>
            <urn:partition>prealm_2421</urn:partition>
        </urn:Headers>
    </soapenv:Header>
    <soapenv:Body>
        <urn:RequisitionImportAsyncPullRequest partition="vrealm_2421" variant="vrealm_2421">
            <urn:Requisition_RequisitionImportPull_Item>
                <urn:item>
                    <urn:CompanyCode>
                        <urn:UniqueName>3000</urn:UniqueName>
                    </urn:CompanyCode>
                    <urn:DefaultLineItem>
                        <urn:DeliverTo>Murali</urn:DeliverTo>
                        <urn:NeedBy>2024-09-04T00:00:00</urn:NeedBy>
                    </urn:DefaultLineItem>
                    <urn:ImportedHeaderCommentStaging>false</urn:ImportedHeaderCommentStaging>
                    <urn:LineItems>
                        ${sLineItemsXML}
                    </urn:LineItems>
                    <urn:Name>TEST PR through wsdl from Postman</urn:Name>
                    <urn:OriginatingSystem>POST</urn:OriginatingSystem>
                    <urn:OriginatingSystemReferenceID>MDSERV02</urn:OriginatingSystemReferenceID>
                    <urn:UniqueName>MDSERV02</urn:UniqueName>
                    <urn:Operation>New</urn:Operation>
                    <urn:Preparer>
                        <urn:PasswordAdapter>PasswordAdapter1</urn:PasswordAdapter>
                        <urn:UniqueName>puser1</urn:UniqueName>
                    </urn:Preparer>
                    <urn:Requester>
                        <urn:PasswordAdapter>PasswordAdapter1</urn:PasswordAdapter>
                        <urn:UniqueName>puser1</urn:UniqueName>
                    </urn:Requester>
                </urn:item>
            </urn:Requisition_RequisitionImportPull_Item>
        </urn:RequisitionImportAsyncPullRequest>
    </soapenv:Body>
</soapenv:Envelope>`;

    // oRequestConfig.data = xmlBodyStr;
    // let oResponse = await axios.request(oRequestConfig);


    // axios.post(url[, data[, config]])
    // const sUrl='https://s1.ariba.com/Buyer/soap/KYYTEDSAPP-1-T/RequisitionImportAsyncPull';

    const oResponse = await axios.post(`/Buyer/soap/KYYTEDSAPP-1-T/RequisitionImportAsyncPull`, xmlBodyStr, {
        baseURL: oRequestConfig,
        headers: {
            'Content-Type': 'application/xml'
        }, auth: {
            username: 'Int_user1',
            password: 'KyyteTest123'
        }
    });

    /*const oResponse = await axios({
        method: "post",
        url: "/Buyer/soap/KYYTEDSAPP-1-T/RequisitionImportAsyncPull",
        baseUrl: "https://s1.ariba.com",
        data: xmlBodyStr,
        headers: {
            "content-type": "application/xml"
        },
        auth: {
            username: 'Int_user1',
            password: 'KyyteTest123'
        }
    })*/

    if (oResponse.length) {
        return "Success";
    }

}

module.exports = {
    doImportReqToAriba
};
