const ImportPurchaseRequisitionHandler = require("./handler/purchaserequisition"),
  cds = require("@sap/cds"),
  xml2js = require("xml2js");

const { ProcessFlows } = cds.entities("com.kyyte.icecream");

module.exports = cds.service.impl((srv) => {
  // Create new Process flow
  srv.on(
    "insertProcessFlows",
    ImportPurchaseRequisitionHandler.doCreateProcessFlow
  );

  srv.on("UPDATE", "ProcessFlows", async (request) => {
    const updateObject = request.data;

    // const db = await cds.connect.to("db");

    // Approach 3
    const tx = srv.tx();

    try {
      // Testing Create Scenario
      /*  await srv.tx(async () => {
          let exists = await tx.run(
            SELECT(1).from(ProcessFlows, updateObject.ID).forUpdate()
          );
          if (!exists)
            await tx.create(ProcessFlows, {
              ID: updateObject.ID,
              ...updateObject,
            });
        });*/

      // Approach 1
      /*  await srv.tx(async () => {
          let exists = await SELECT(1)
            .from(ProcessFlows, updateObject.ID)
            .forUpdate();
          if (exists)
            await UPDATE(ProcessFlows, updateObject.ID).with(updateObject);
          else
            await INSERT.into(ProcessFlows, {
              ID: updateObject.ID,
              ...updateObject,
            });
        });*/

      // Approach 2
      /*  await cds.tx(async (tx) => {
          let exists = await tx.run(
            SELECT(1).from(ProcessFlows, updateObject.ID).forUpdate()
          );
          if (exists)
            await tx.update(ProcessFlows, updateObject.ID).with(updateObject);
          else await tx.create(ProcessFlows, { ID: updateObject.ID, ...updateObject });
        });*/

      // Approach 3
      let exists = await tx.run(
        SELECT(1).from(ProcessFlows, updateObject.ID).forUpdate()
      );

      if (exists)
        await tx.update(ProcessFlows, updateObject.ID).with(updateObject);
      else
        await tx.create(ProcessFlows, { ID: updateObject.ID, ...updateObject });
      await tx.commit();
    } catch (error) {
      console.log(error);
      await tx.rollback(error); // will rethrow error
    }
  });

  srv.on("DELETE", "ProcessFlows", async (request) => {
    const deleteObject = request.data;

    // Approach 3
    const tx = srv.tx();

    try {
      // Approach 1
      /*  await srv.tx(async () => {
          let exists = await SELECT(1)
            .from(ProcessFlows, deleteObject.ID)
            .forUpdate();
          if (exists)
            await DELETE(ProcessFlows, deleteObject.ID);
        });*/

      // Approach 2
      await cds.tx(async (tx) => {
        let exists = await tx.run(
          SELECT(1).from(ProcessFlows, deleteObject.ID).forUpdate()
        );
        // Below Query and method based both approaches works
        // if (exists) await DELETE(ProcessFlows, deleteObject.ID);

        if (exists) await tx.delete(ProcessFlows, deleteObject.ID);
      });

      // Approach 3
      /* let exists = await tx.run(
          SELECT(1).from(ProcessFlows, deleteObject.ID).forUpdate()
        );
  
        if (exists) await tx.delete(ProcessFlows, deleteObject.ID);
        await tx.commit();*/
    } catch (error) {
      console.log(error);
      await tx.rollback(error); // will rethrow error
    }
  });

  // Create PR to Ariba
  srv.on("createPurchaseRequisition", async (req) => {
    const { RequisitionPayload } = req.data;

    const oResults = await ImportPurchaseRequisitionHandler.doImportReqToAriba(
      RequisitionPayload
    );
    console.log(oResults);

    return {
      status: oResults.status,
      statusText: oResults.status === 200 ? "Success" : "Error",
      data: oResults.data,
    };
  });
});
