sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	"sap/ui/core/routing/History",
	"sap/m/MessageToast",
	"sap/ui/Device",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (Controller, UIComponent, History, MessageToast, Device, Filter, FilterOperator) {
	"use strict";

	return Controller.extend("com.kyyte.createpr.controller.BaseController", {
		/**
		 * Convenience method for accessing the router.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter: function () {
			return UIComponent.getRouterFor(this);
		},

		/**
		 * Convenience method for getting the view model by name.
		 * @public
		 * @param {string} [sName] the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel: function (sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel: function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Getter for the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		onNavBack: function () {
			const sPreviousHash = History.getInstance().getPreviousHash();

			if (sPreviousHash !== undefined) {
				// eslint-disable-next-line sap-no-history-manipulation
				history.go(-1);
			} else {
				this.getRouter().navTo("", {}, true);
			}
		},

		handleCUDOperations: function (sURL, oParameters, sType, mHeaders) {
			return new Promise(function (resolve, reject) {
				jQuery.ajax({
					url: sURL,
					type: sType,
					data: JSON.stringify(oParameters),
					contentType: "application/json;charset=utf-8",
					dataType: "json",
					beforeSend: function (xhr) {
						if (mHeaders && mHeaders !== null) {
							/*Adding Custom headers to request*/
							Object.entries(mHeaders).forEach(function (oHeader) {
								xhr.setRequestHeader(oHeader[0], oHeader[1]);
							});
						}
					}
				}).done(function (data) {
					return resolve(data);
				}).fail(function (jqXHR, textStatus) {
					MessageToast.show("Request failed: " + textStatus);
					return reject(textStatus);
				});
			});
		},

		createViewSettingsDialog: function (sDialogFragmentName, mViewSettingsDialogs) {
			let oDialog = mViewSettingsDialogs[sDialogFragmentName];

			if (!oDialog) {
				oDialog = sap.ui.xmlfragment(sDialogFragmentName, this);
				mViewSettingsDialogs[sDialogFragmentName] = oDialog;

				if (Device.system.desktop) {
					oDialog.addStyleClass("sapUiSizeCompact");
				}
			}
			return oDialog;
		},

		handleRoleConfigurations: function (sRole) {
			switch (sRole) {
			case 0:
				return "Authorised";
			case 1:
				return "notAuthorised";
			case 3:
				return "Supplier";
			case 4:
				return "Customer";
			default:
				return "Owner";
			}
		},

		loadTabsData: function (oView, oRole) {
			const oHeaders = {
					address: this.getOwnerComponent().oMyStorage.get("data").user.address,
					password: this.getOwnerComponent().oMyStorage.get("password")
				},
				that = this,
				oBillingSupplierURI =
				`${this.getOwnerComponent().oCORS}${this.getOwnerComponent().sOpsChainSettlement}receivablesAndPayables?location=${this.getOwnerComponent().oMyStorage.get("data").user.location}`;

			this.getModel("PayableReceivableModel").loadData(oBillingSupplierURI,
				null, true, "GET", null, false, oHeaders).then(() => {
				that.sOwner = oView.getModel("PayableReceivableModel").getProperty("/data/res/0/name");
				oView.bindElement("/data/res/0");
			}).catch((oError) => {
				MessageToast.show(JSON.parse(oError.responseText) ? JSON.parse(oError.responseText).status.message : oError.message);
				that.getOwnerComponent()._dialog.close();
			});
		},

		getTokenHolders: function () {
			const oTokenHolderWithAddressURI = this.getOwnerComponent().sOpsChainAsset + "tokenHolderWithAddress";

			if (this.getOwnerComponent().oMyStorage.get("data")) {
				this.getModel("TokenHoldersModel").loadData(oTokenHolderWithAddressURI,
					null, true, "GET", null,
					false, {
						Authorization: this.getOwnerComponent().oMyStorage.get("data").user.token
					}).catch((oError) => {
					MessageToast.show(oError.responseText ? JSON.parse(oError.responseText).status.message : oError.message);
					this.getOwnerComponent()._dialog.close();
				});
			}
		},

		_updateListItemCount: function (iTotalItems, oTable, oTitle, sModel) {
			let sTitle;

			// only update the counter if the length is final
			if (oTable.getBinding("items").isLengthFinal()) {
				sTitle = this.getResourceBundle().getText(oTitle, [iTotalItems]);
				sModel.setProperty("/" + oTitle, sTitle);
			}
			this.getOwnerComponent()._dialog.close();
		},

		_updateText: function (oSelectedDates, sPath, sTable) {
			if (oSelectedDates) {
				const oSelectedDateFrom = oSelectedDates.getStartDate(),
					oSelectedDateTo = oSelectedDates.getEndDate();

				let filter, oSelectedDateFromEnd;

				// Set first date as start of day
				oSelectedDateFrom.setMilliseconds(0);
				oSelectedDateFrom.setSeconds(0);
				oSelectedDateFrom.setMinutes(0);
				oSelectedDateFrom.setHours(0);

				if (oSelectedDateFrom && !oSelectedDateTo) {
					oSelectedDateFromEnd = new Date(oSelectedDateFrom);

					// Set second date as end of day
					oSelectedDateFromEnd.setMilliseconds(0);
					oSelectedDateFromEnd.setSeconds(59);
					oSelectedDateFromEnd.setMinutes(59);
					oSelectedDateFromEnd.setHours(23);

					filter = new Filter(sPath, FilterOperator.BT, oSelectedDateFrom, oSelectedDateFromEnd);
					sTable.getBinding("items").filter(filter);
					// oSelectedDateFrom.setText(this.oFormatYyyymmdd.format(oDate));
				} else if (oSelectedDateTo && oSelectedDateFrom) {
					oSelectedDateFromEnd = new Date(oSelectedDateTo);
					// Set second date as end of day
					oSelectedDateFromEnd.setMilliseconds(0);
					oSelectedDateFromEnd.setSeconds(59);
					oSelectedDateFromEnd.setMinutes(59);
					oSelectedDateFromEnd.setHours(23);

					filter = new Filter(sPath, FilterOperator.BT, oSelectedDateFrom, oSelectedDateFromEnd);
					sTable.getBinding("items").filter(filter);
				}

			} else {
				MessageToast.show("No Date Selected");
			}
		}
	});

});