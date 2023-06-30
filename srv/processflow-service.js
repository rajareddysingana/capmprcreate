const ImportPurchaseRequisitionHandler = require('./handler/purchaserequisition');

module.exports = (srv) => {

    srv.on('createPurchaseRequisition', async req => {
        const { RequisitionPayload } = req.data;

        console.log(RequisitionPayload);
        
        const oResults = await ImportPurchaseRequisitionHandler.doImportReqToAriba(RequisitionPayload);
        console.log(oResults);

        if (oResults.length) {
            return {
                status: oResults
            };
        }
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