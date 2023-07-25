sap.ui.define(
  [
    "com/kyyte/createpr/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
  ],
  function (BaseController, JSONModel, MessageToast, MessageBox) {
    "use strict";

    return BaseController.extend("com.kyyte.createpr.controller.ProcessFlow", {
      onInit: function () {},

      onSelect: function (oEvent) {},

      openPersoDialog: function (oEvent) {},

      onOpenAddDialog: function () {
        const oModel = new JSONModel({
          ID: 0,
          Lane: 0,
          Title: "",
          TitleAbbreviation: "",
          State: "None",
          StateText: "",
          Focused: false,
        });

        // this.byId("OpenDialog").setBindingContext(oModel.getContext("/"),"CreateProcessFlow");
        this.getView().byId("OpenDialog").setModel(oModel, "CreateProcessFlow");
        this.getView().byId("OpenDialog").open();
      },

      onDelete: function () {
        const oSelectedItem = this.byId("idProcessFlowTable").getSelectedItem();

        if (oSelectedItem)
          oSelectedItem
            .getBindingContext()
            .delete("$auto")
            .then(
              function () {
                // ProcessFlow successfully deleted
                MessageToast.show("ProcessFlow successfully Deleted!");
              },
              function (oError) {
                // do error handling
                MessageBox.error(JSON.parse(oError));
              }
            );
        else MessageToast.show("Please Select a Row to Delete!");
      },

      onSavePress: function (oEvent) {
        const oView = this.getView(),
          oDialog = oEvent.getSource().getParent(),
          oContext = oDialog.getBindingContext("V2ProcessFlow"),
          sPath = oContext.getPath(),
          sObject = oContext.getObject();

        sObject.Lane = +sObject.Lane;

        function resetBusy() {
          oView.setBusy(false);
        }

        // lock UI until submitBatch is resolved, to prevent errors caused by updates while submitBatch is pending
        oView.setBusy(true);

        // V4 Update Concept, need to analyse
        // oView
        //   .getModel()
        //   .submitBatch(oView.getModel().getUpdateGroupId())
        //   .then(resetBusy, resetBusy);

        this.getModel("V2ProcessFlow").update(sPath, sObject, {
          success: (oData, response) => {
            resetBusy();
            oDialog.close();
            this.getModel().refresh();

            MessageToast.show("Process Flow Updated Successfully!");
          },
          error: (oError) => {
            resetBusy();

            MessageBox.error(JSON.parse(oError));
          },
        });
      },

      onDetailPress: function (oEvent) {
        const oContext = oEvent.getSource().getBindingContext(),
          sPath = oEvent.getSource().getBindingContextPath(),
          oV2Context = this.getModel("V2ProcessFlow").getContext(sPath);

        this.byId("OpenEditDialog").bindElement({
          path: oV2Context.getPath(),
          model: "V2ProcessFlow",
        });
        this.byId("OpenEditDialog").open();
      },

      onCreate: function (oEvent) {
        const oDialog = oEvent.getSource().getParent(),
          sObject = oDialog.getModel("CreateProcessFlow").getProperty("/");

        sObject.ID = +sObject.ID;
        sObject.Lane = +sObject.Lane;

        const oProcessFlowPayload = {
          entities: sObject,
        };

        /* this.getModel("V2ProcessFlow").callFunction("/insertProcessFlows", {
          method: "POST",
          urlParameters: oProcessFlowPayload,
          success: (oData) => {
            // Process Flow successfully created
            oDialog.close();
            this.getModel().refresh();
            MessageToast.show("Process Flow successfully Created");
          },
          error: (oError) => {
            // handle rejection of entity creation; if oError.canceled === true then the transient entity has been deleted
            oDialog.close();
            MessageBox.error("Request failed: " + JSON.parse(oError));
            // MessageToast.show("Request failed: " + oError);
          },
        });*/

        // ${this.getOwnerComponent().oCORS}
        const sPRCreateAPI = `${
          this.getModel().sServiceUrl
        }/insertProcessFlows`;

        this.handleCUDOperations(sPRCreateAPI, oProcessFlowPayload, "POST")
          .then((oData) => {
            // Process Flow successfully created
            oDialog.close();
            this.getModel().refresh();
            MessageToast.show("Process Flow successfully Created");
          })
          .catch((oError) => {
            // handle rejection of entity creation; if oError.canceled === true then the transient entity has been deleted
            oDialog.close();
            // MessageBox.error(JSON.parse(oError));
            MessageToast.show("Request failed: " + oError);
          });

        /*  let oContext = this.getView()
          .byId("idProcessFlowTable")
          .getBinding("items")
          .create(sObject);

        // Note: This promise fails only if the transient entity is deleted
        oContext
          .created()
          .then(
            function () {
              // Process Flow successfully created
              oDialog.close();
              MessageToast.show("Process Flow successfully Created");
            },
            function (oError) {
              // handle rejection of entity creation; if oError.canceled === true then the transient entity has been deleted
              oDialog.close();
              MessageBox.error(JSON.parse(oError));
            }
          )
          .catch((oError) => {
            oDialog.close();
            MessageBox.error(JSON.parse(oError));
          });*/

        // oDialog.close();
      },

      onCancelPress: function (oEvent) {
        const oDialog = oEvent.getSource().getParent(),
          oContext = oDialog.getBindingContext("V2ProcessFlow");
        oDialog.close();

        if (oDialog.getModel("V2ProcessFlow").hasPendingChanges())
          oDialog
            .getModel("V2ProcessFlow")
            .resetChanges([oContext.getPath()], true);
      },
    });
  }
);
