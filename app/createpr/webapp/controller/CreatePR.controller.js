sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (Controller, JSONModel, MessageToast, MessageBox) {
    "use strict";

    return Controller.extend("com.kyyte.createpr.controller.CreatePR", {
        onInit: function () {
            const oViewModel = new JSONModel({
                RequisitionPayload: {
                    CompanyCode: "",
                    DeliverTo: "",
                    Items: [{
                        NumberInCollection: 1,
                        Quantity: "",
                        ShipTo: "",
                        BillingAddress: "",
                        CommodityCode: "",
                        Description: "",
                        Price: "",
                        Currency: "",
                        UnitOfMeasure: ""
                    }]
                }
            });

            this.getView().setModel(oViewModel, "CreatePR")
        },

        onSavePress: function (oEvent) {
            let oPayload = this.getView().getModel("CreatePR").getProperty("/RequisitionPayload");

            // oPayload.CompanyCode = +oPayload.CompanyCode;
            // oPayload.Items[0].ShipTo = +oPayload.Items[0].ShipTo;
            // oPayload.Items[0].Quantity = +oPayload.Items[0].Quantity;
            // oPayload.Items[0].BillingAddress = +oPayload.Items[0].BillingAddress;
            // oPayload.Items[0].CommodityCode = +oPayload.Items[0].CommodityCode;
            // oPayload.Items[0].Price = +oPayload.Items[0].Price;

            oPayload = {
                "RequisitionPayload": {
                    "CompanyCode": 3000,
                    "DeliverTo": "Raja Reddy",
                    "Items": [
                        {
                            "NumberInCollection": 1,
                            "Quantity": 30,
                            "ShipTo": 3000,
                            "BillingAddress": 3000,
                            "CommodityCode": 12,
                            "Description": "Laptop",
                            "Price": 10000,
                            "Currency": "INR",
                            "UnitOfMeasure": "EA"
                        }
                    ]
                }
            };

            this.getView().getModel().callFunction("/createPurchaseRequisition", {
                method: "POST",
                urlParameters: oPayload,
                success: (oData, response) => {
                    console.log(oData.results);
                    MessageToast.show("Success");
                },
                error: (oError) => {
                    MessageToast.show(oError);
                }
            });

            // V4 Model
        /*    const oAction = this.getView().getModel().bindContext("/createPurchaseRequisition(...)", this.byId("idPRHeaderDataSimpleForm").getBindingContext("CreatePR"));

            oAction.execute().then((oResponse) => {
                MessageToast.show("Purchase Order Created");
            }).catch((oError) => {
                MessageBox.alert(oError.message, {
                    icon: MessageBox.Icon.ERROR,
                    title: "Error"
                });
            });*/

        },

        onCancelPress: function (oEvent) {

        }


    });
});
