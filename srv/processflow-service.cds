using {com.kyyte.icecream as icecream} from '../db/schema';

@path: 'service/icecream'
service ProcessFlowService {
  // entity ProcessFlows @(restrict: [
  //   {
  //     grant: ['*'],
  //     to   : ['admin']
  //   }
  // ]) as projection on icecream.ProcessFlows;

  entity ProcessFlows as projection on icecream.ProcessFlows;


  action createPurchaseRequisition(RequisitionPayload : icecream.PurchaseRequisitionHeader) returns icecream.Response;
  action insertProcessFlows(entities : ProcessFlows)                                        returns String;

}
