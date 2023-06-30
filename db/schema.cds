namespace com.kyyte.icecream;

using {managed} from '@sap/cds/common';

entity ProcessFlows {
    key ID                : Integer;
        Lane              : Integer;
        Title             : localized String;
        TitleAbbreviation : String(3);
        State             : String;
        StateText         : String;
        Focused           : Boolean;
}
