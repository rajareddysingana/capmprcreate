"use strict";

const cds = require("@sap/cds"),
  logger = cds.log("logger");

// const cloudSDK = require("@sap-cloud-sdk/core");
const registerDestination = require("@sap-cloud-sdk/connectivity");
const { default: axios } = require("axios");

const { ProcessFlows } = cds.entities("com.kyyte.icecream");

function _getLineItemPayload(aLineItems, oHeader) {
  var sXML = "";
  aLineItems &&
    aLineItems.forEach((oLineItem) => {
      sXML = `${sXML}
        <urn:item>
        <urn:BillingAddress>
            <urn:UniqueName>${oLineItem.BillingAddress}</urn:UniqueName>
        </urn:BillingAddress>
        <urn:CommodityCode>
            <urn:UniqueName>${oLineItem.CommodityCode}</urn:UniqueName>
        </urn:CommodityCode>
        <urn:Description>
            <urn:CommonCommodityCode>
                <urn:Domain>unspsc</urn:Domain>
                <urn:UniqueName>43211507</urn:UniqueName>
            </urn:CommonCommodityCode>
            <urn:Description>${oLineItem.Description}</urn:Description>
            <urn:Price>
                <urn:Amount>${oLineItem.Price}</urn:Amount>
                <urn:Currency>
                    <urn:UniqueName>${oLineItem.Currency}</urn:UniqueName>
                </urn:Currency>
            </urn:Price>
            <urn:UnitOfMeasure>
                <urn:UniqueName>${oLineItem.UnitOfMeasure}</urn:UniqueName>
            </urn:UnitOfMeasure>
        </urn:Description>
        <urn:ImportedAccountCategoryStaging>
            <urn:UniqueName>K</urn:UniqueName>
        </urn:ImportedAccountCategoryStaging>
        <urn:ImportedAccountingsStaging>
            <urn:SplitAccountings>
                <urn:item>
                    <urn:Account>
                        <urn:UniqueName/>
                    </urn:Account>
                    <urn:Asset>
                        <urn:CompanyCode>
                            <urn:UniqueName/>
                        </urn:CompanyCode>
                        <urn:SubNumber/>
                        <urn:UniqueName/>
                    </urn:Asset>
                    <urn:CostCenter>
                        <urn:CompanyCode>
                            <urn:UniqueName>${oHeader.CompanyCode}</urn:UniqueName>
                        </urn:CompanyCode>
                        <urn:UniqueName>0000009154</urn:UniqueName>
                    </urn:CostCenter>
                    <urn:GeneralLedger>
                        <urn:CompanyCode>
                            <urn:UniqueName>${oHeader.CompanyCode}</urn:UniqueName>
                        </urn:CompanyCode>
                        <urn:UniqueName>0000400200</urn:UniqueName>
                    </urn:GeneralLedger>
                    <urn:InternalOrder>
                        <urn:UniqueName/>
                    </urn:InternalOrder>
                    <urn:NumberInCollection>${oLineItem.NumberInCollection}</urn:NumberInCollection>
                    <urn:Percentage>100</urn:Percentage>
                    <urn:ProcurementUnit>
                        <urn:UniqueName/>
                    </urn:ProcurementUnit>
                    <urn:Quantity>${oLineItem.Quantity}</urn:Quantity>
                    <urn:WBSElement>
                        <urn:UniqueName/>
                    </urn:WBSElement>
                </urn:item>
            </urn:SplitAccountings>
            <urn:Type>
                <urn:UniqueName>_Percentage</urn:UniqueName>
            </urn:Type>
        </urn:ImportedAccountingsStaging>
        <urn:ImportedDeliverToStaging>3000</urn:ImportedDeliverToStaging>
        <urn:ImportedNeedByStaging>2023-07-04T00:00:00</urn:ImportedNeedByStaging>
        <urn:ItemCategory>
            <urn:UniqueName>M</urn:UniqueName>
        </urn:ItemCategory>
        <urn:NumberInCollection>${oLineItem.NumberInCollection}</urn:NumberInCollection>
        <urn:OriginatingSystemLineNumber>00001</urn:OriginatingSystemLineNumber>
        <urn:PurchaseGroup>
            <urn:UniqueName>100</urn:UniqueName>
        </urn:PurchaseGroup>
        <urn:PurchaseOrg>
            <urn:UniqueName>3000</urn:UniqueName>
        </urn:PurchaseOrg>
        <urn:Quantity>${oLineItem.Quantity}</urn:Quantity>
        <urn:ShipTo>
            <urn:UniqueName>${oLineItem.ShipTo}</urn:UniqueName>
        </urn:ShipTo>
        <urn:Supplier>
            <urn:UniqueName>1000003550</urn:UniqueName>
        </urn:Supplier>
        </urn:item>`;
    });

  return sXML;
}

function _getLineItemPayloadAsync(aLineItems) {
  var sXML = "";
  aLineItems &&
    aLineItems.forEach((oLineItem) => {
      sXML = `${sXML}
        <urn:item>
        <urn:NumberInCollection>${oLineItem.NumberInCollection}</urn:NumberInCollection>
        <urn:Quantity>${oLineItem.Quantity}</urn:Quantity>
        <urn:ShipTo>
            <urn:UniqueName>${oLineItem.ShipTo}</urn:UniqueName>
        </urn:ShipTo>
        <urn:BillingAddress>
            <urn:UniqueName>${oLineItem.BillingAddress}</urn:UniqueName>
        </urn:BillingAddress>
        <urn:CommodityCode>
            <urn:UniqueName>${oLineItem.CommodityCode}</urn:UniqueName>
        </urn:CommodityCode>
        <urn:Description>
            <urn:Price>
                <urn:Currency>
                    <urn:UniqueName>${oLineItem.Currency}</urn:UniqueName>
                </urn:Currency>
                <urn:Amount>${oLineItem.Price}</urn:Amount>
            </urn:Price>
            <urn:CommonCommodityCode>
                <urn:Domain>unspsc</urn:Domain>
                <urn:UniqueName>43211507</urn:UniqueName>
            </urn:CommonCommodityCode>
            <urn:Description>${oLineItem.Description}</urn:Description>
            <urn:UnitOfMeasure>
                <urn:UniqueName>${oLineItem.UnitOfMeasure}</urn:UniqueName>
            </urn:UnitOfMeasure>
        </urn:Description>
        <urn:ImportedItemCategoryStaging>
            <urn:UniqueName>D</urn:UniqueName>
        </urn:ImportedItemCategoryStaging>
        <urn:ImportServiceDetailsStaging>
            <urn:ExpectedAmount>
                <urn:Amount>200.00</urn:Amount>
                <urn:Currency>
                    <urn:UniqueName>${oLineItem.Currency}</urn:UniqueName>
                </urn:Currency>
            </urn:ExpectedAmount>
            <urn:MaxAmount>
                <urn:Amount>200.00</urn:Amount>
                <urn:Currency>
                    <urn:UniqueName>${oLineItem.Currency}</urn:UniqueName>
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
                    <urn:Quantity>${oLineItem.Quantity}</urn:Quantity>
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
                    <urn:NumberInCollection>${oLineItem.NumberInCollection}</urn:NumberInCollection>
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

async function doImportReqToAribaAsync(req) {
  // Add Local Destination for Testing
  /* const destination = {
         name: 'PRCreate',
         url: 'https://s1.ariba.com/Buyer/soap/KYYTEDSAPP-1-T/RequisitionImportAsyncPull',
         forwardAuthToken: true
       };
 
       registerDestination(destination, options);

    let oDestination = await registerDestination.getDestination({ destinationName: "PRCreate" });

    if (!oDestination) {
        logger.error(`Destination does not exist or is incorrectly configured`);
        throw Error("Destination does not exist or is incorrectly configured");
    }

    let oRequestConfig = await registerDestination.executeHttpRequest({ destinationName: oDestination });*/

  //  oRequestConfig.method = "post";
  //  oRequestConfig.headers["Accept"] = oRequestConfig.headers["Content-Type"] = "application/xml";

  // process the price and supplier changes
  var sLineItemsXML = _getLineItemPayloadAsync(req.Items);

  console.log(sLineItemsXML);

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
                        <urn:UniqueName>${req.CompanyCode}</urn:UniqueName>
                    </urn:CompanyCode>
                    <urn:DefaultLineItem>
                        <urn:DeliverTo>${req.DeliverTo}</urn:DeliverTo>
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

  // axios.post(url[, data[, config]])
  const sUrl =
    "https://s1.ariba.com/Buyer/soap/KYYTEDSAPP-1-T/RequisitionImportAsyncPull";

  const oResponse = await axios.post(sUrl, sXmlBodyStr, {
    headers: {
      "Content-Type": "application/xml",
    },
    auth: {
      username: "Int_user1",
      password: "KyyteTest123",
    },
  });

  console.log(sXmlBodyStr);

  return oResponse;
}

async function doImportReqToAriba(req) {
  // process the price and supplier changes
  const sLineItemsXML = _getLineItemPayload(req.Items, req),
    sVariant = `vrealm_${generateRandomNumber(0, 10000)}`,
    sPartition = `prealm_${generateRandomNumber(0, 10000)}`;

  console.log(sLineItemsXML);

  const sXmlBodyStr = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:Ariba:Buyer:vrealm_2421">
    <soapenv:Header>
        <urn:Headers>
            <urn:variant>${sVariant}</urn:variant>
            <urn:partition>${sPartition}</urn:partition>
        </urn:Headers>
    </soapenv:Header>
    <soapenv:Body>
        <urn:RequisitionImportPullRequest partition="${sPartition}" variant="${sVariant}">
            <urn:Requisition_RequisitionImportPull_Item>
                <urn:item>
                    <urn:CompanyCode>
                        <urn:UniqueName>${req.CompanyCode}</urn:UniqueName>
                    </urn:CompanyCode>
                    <urn:DefaultLineItem>
                        <urn:DeliverTo>${req.DeliverTo}</urn:DeliverTo>
                        <urn:NeedBy>${new Date().toISOString()}</urn:NeedBy>
                    </urn:DefaultLineItem>
                    <urn:ImportedHeaderCommentStaging>false</urn:ImportedHeaderCommentStaging>
                    <urn:ImportedHeaderExternalCommentStaging>false</urn:ImportedHeaderExternalCommentStaging>
                    <urn:LineItems>
                       ${sLineItemsXML}
                    </urn:LineItems>
                    <urn:Name>TEST PR from Webervice</urn:Name>
                    <urn:OriginatingSystem>SOAP</urn:OriginatingSystem>
                    <urn:OriginatingSystemReferenceID>${generateRandomString(
                      7
                    )}</urn:OriginatingSystemReferenceID>
                    <urn:Preparer>
                        <urn:PasswordAdapter>PasswordAdapter1</urn:PasswordAdapter>
                        <urn:UniqueName>puser1</urn:UniqueName>
                    </urn:Preparer>
                    <urn:Requester>
                        <urn:PasswordAdapter>PasswordAdapter1</urn:PasswordAdapter>
                        <urn:UniqueName>puser1</urn:UniqueName>
                    </urn:Requester>
                    <urn:UniqueName>${generateRandomString(7)}</urn:UniqueName>
                </urn:item>
            </urn:Requisition_RequisitionImportPull_Item>
        </urn:RequisitionImportPullRequest>
    </soapenv:Body>
</soapenv:Envelope>`;

  const oResponse = await axios({
    method: "post",
    url: "https://s1.ariba.com/Buyer/soap/KYYTEDSAPP-1-T/RequisitionImportPull",
    data: sXmlBodyStr,
    headers: {
      "content-type": "application/xml",
    },
    auth: {
      username: "Int_user1",
      password: "KyyteTest123",
    },
  });

  return oResponse;
}

function generateRandomString(length) {
  let result = "";

  // declare all characters
  const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
    charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

function generateRandomNumber(minNumber, maxNumber) {
  // input from the user
  const min = parseInt(minNumber);
  const max = parseInt(maxNumber);

  // generating a random number
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function doCreateProcessFlow(request) {
  let entities = request.data.entities;
  console.log(entities);

  const tx = cds.tx();
  try {
    // Approach 1
    // await tx.run(INSERT.into(ProcessFlows).entries(entities));
    // await tx.commit();

    // Approach 2
    // let exists = await tx.run(
    //   SELECT(1).from(ProcessFlows, entities.ID).forUpdate()
    // );

    // await tx.create(ProcessFlows, { ID: entities.ID, ...entities });
    // await tx.commit();

    // Approach 3
    await INSERT.into(ProcessFlows, {
      ID: entities.ID,
      ...entities,
    });
    await tx.commit();
  } catch (error) {
    await tx.rollback();
  }
}

module.exports = {
  doImportReqToAriba,
  doImportReqToAribaAsync,
  doCreateProcessFlow,
};
