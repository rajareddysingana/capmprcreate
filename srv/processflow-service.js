const ImportPurchaseRequisitionHandler = require('./handler/purchaserequisition'),
    cds = require('@sap/cds');

module.exports = (srv) => {

    srv.on('createPurchaseRequisition', async req => {
        const { RequisitionPayload } = req.data;

        const oResults = await ImportPurchaseRequisitionHandler.doImportReqToAriba(RequisitionPayload);
        console.log(oResults);

        return {
            status:oResults.status,
            statusText:oResults.status === 200 ? "Success":"Error",
            data:oResults.data
        };
    });



    // Reply mock data for Process Flow Entity
    /* srv.on('READ', 'ProcessFlows', () => [
         {
             ID: 1,
             Lane: 0,
             Title: 'Raw material: From stock',
             TitleAbbreviation: 'RMS',
             State: 'Positive',
             StateText: 'Delivered',
             Focused: false
         },
         {
             ID: 2,
             Lane: 0,
             Title: "Raw material: Purchased",
             TitleAbbreviation: "RMP",
             State: "Positive",
             StateText: "Delivered",
             Focused: false
    
         }
     ])*/
}


// const cds = require('@sap/cds'),
//     ImportPurchaseRequisitionHandler = require('./handler/purchaserequisition');

// module.exports = cds.service.impl((srv) => {

//     // srv.on('doImportReqToAriba', ImportPurchaseRequisitionHandler.doImportReqToAriba);

// });