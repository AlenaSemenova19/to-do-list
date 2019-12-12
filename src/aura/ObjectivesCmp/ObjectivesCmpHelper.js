({
    getObjectives : function(component, event, helper) {
        var action = component.get("c.getAllObjectives");
        action.setCallback(this,function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.totalPages", Math.ceil(response.getReturnValue().length/component.get("v.pageSize")));
                component.set("v.allData", response.getReturnValue());
                component.set("v.currentPageNumber", 1);
                helper.buildData(component, helper);
            }
        });
        $A.enqueueAction(action);
    },

    buildData : function(component, helper) {
        var data = [];
        var pageNumber = component.get("v.currentPageNumber");
        var pageSize = component.get("v.pageSize");
        var allData = component.get("v.allData");
        var x = (pageNumber-1)*pageSize;

        for(; x<=(pageNumber)*pageSize; x++){
            if(allData[x]) {
            	data.push(allData[x]);
            }
        }

        data.forEach(function(record) {
            switch (record.Category__c) {
              case 'Today':
                record.showClass = 'redColor';
                break;
              case 'Tomorrow':
                record.showClass = 'orangeColor';
                break;
              case 'Later':
                record.showClass = 'greenColor';
                break;
            }
        });
        component.set("v.allObjectives", data);
        helper.generatePageList(component, pageNumber);
    },

    generatePageList : function(component, pageNumber){
        pageNumber = parseInt(pageNumber);
        var pageList = [];
        var totalPages = component.get("v.totalPages");
        if(totalPages > 1) {
            if(totalPages <= 10) {
                var counter = 2;
                for(; counter < (totalPages); counter++) {
                    pageList.push(counter);
                }
            } else {
                if(pageNumber < 5) {
                    pageList.push(2, 3, 4, 5, 6);
                } else {
                    if(pageNumber>(totalPages-5)) {
                        pageList.push(totalPages-5, totalPages-4, totalPages-3, totalPages-2, totalPages-1);
                    } else {
                        pageList.push(pageNumber-2, pageNumber-1, pageNumber, pageNumber+1, pageNumber+2);
                    }
                }
            }
        }
        component.set("v.pageList", pageList);
    },

    searchResultHelper: function(component, event) {
        component.find("Id_spinner").set("v.class" , 'slds-show');
        var action = component.get("c.resultObjectives");
        action.setParams({
            'searchWord': component.get("v.searchString")
        });
        action.setCallback(this, function(response) {
            component.find("Id_spinner").set("v.class" , 'slds-hide');
            var state = response.getState();
            if (state === "SUCCESS") {
                var storeResponse = response.getReturnValue();
                if (storeResponse.length == 0) {
                    component.set("v.errorMsg", "No items to display.");
                    console.log(component.get("v.errorMsg"));
                } else {
                    component.set("v.errorMsg", "");
                }
                component.set("v.allObjectives", storeResponse);
            }
        });
        $A.enqueueAction(action);
    },

    deleteRecord : function (component, event, helper) {
        var action = component.get("c.deleteObjective");
        action.setParams({
            objId : event.getParam('row').Id
        });
        action.setCallback(this, function (response) {
            component.set("v.listOfObjectives",response.getReturnValue());
        });
        $A.get('e.force:refreshView').fire();
        alert('Record '+ event.getParam('row').Title__c + ' has been deleted successfully!');
        $A.enqueueAction(action);
    },
});