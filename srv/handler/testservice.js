const ImportPurchaseRequisitionHandler = require("./handler/purchaserequisition"),
  cds = require("@sap/cds"),
  xml2js = require("xml2js");

module.exports = (srv) => {
  const { ProcessFlows } = cds.entities("com.kyyte.icecream");

  // Create new Process flow
  srv.on("CREATE", "ProcessFlows", async (request) => {
    const createObject = request.data;
    let tx = cds.transaction(request);

    // Approach 4
    // DB Connect approach
    // let db = await cds.connect.to("db");
    // let tx = db.tx();

    try {
      // Approach 1
      await tx.run(INSERT.into(ProcessFlows).entries(createObject));
      // await tx.run(UPSERT.into(ProcessFlows).entries(createObject));

      // Approach 2

      /*  await srv.tx(async () => {
        let exists = await tx.run(
          SELECT(1).from(ProcessFlows, createObject.ID).forUpdate()
        );
        if (!exists) await tx.create(ProcessFlows, createObject);

        // await INSERT.into(ProcessFlows, {
        //   ID: createObject.ID,
        //   ...createObject,
        // });

        // await tx.create(ProcessFlows, {
        //   ID: createObject.ID,
        //   ...createObject,
        // });
      });*/

      // Approach 3
      /* await tx.run(
        INSERT.into(ProcessFlows)
          .columns("ID",
            "Lane",
            "Title",
            "TitleAbbreviation",
            "State",
            "StateText",
            "Focused"
          )
          .values(2,1, "Wuthering Heights", "WH", "Warning", "In-Process", true)
      );*/
      await tx.commit();

      // Approach 4
      // Optionally specify a function as the last argument to have commit and rollback called automatically.
      /*  await db.tx (async tx => {
        await tx.create (ProcessFlows, createObject);
      });*/
    } catch (error) {
      console.log(error);
      await tx.rollback(error);
    }
  });

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
};
