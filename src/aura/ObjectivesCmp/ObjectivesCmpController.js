({
	doInit : function(component, event, helper) {
	    const actions = [
            { label: 'Edit', name: 'edit'},
            { label: 'Delete', name: 'delete'}
        ];
        component.set('v.columns', [
            {label: 'Title', fieldName: 'Title__c', type: 'text'},
            {label: 'Description', fieldName: 'Description__c', type: 'text'},
            {label: 'Date Of Creation', fieldName: 'Date_of_creation__c', type: 'date'},
            {label: 'Category', fieldName: 'Category__c', type: 'text'},
            {label: 'Priority', fieldName: 'Priority__c', type: 'text'},
            {label: 'Is Done', fieldName: 'Is_Done__c', type: 'boolean'},
            {
                type: 'action',
                typeAttributes: {
                    rowActions: actions,
                    menuAlignment: 'right'

            }},
        ]);
        helper.getObjectives(component, event, helper);
    },

    onNext : function(component, event, helper) {
        var pageNumber = component.get("v.currentPageNumber");
        component.set("v.currentPageNumber", pageNumber+1);
        helper.buildData(component, helper);
    },

    onPrev : function(component, event, helper) {
        var pageNumber = component.get("v.currentPageNumber");
        component.set("v.currentPageNumber", pageNumber-1);
        helper.buildData(component, helper);
    },

    pageProcessing : function(component, event, helper) {
        component.set("v.currentPageNumber", parseInt(event.target.name));
        helper.buildData(component, helper);
    },

    onFirst : function(component, event, helper) {
        component.set("v.currentPageNumber", 1);
        helper.buildData(component, helper);
    },

    onLast : function(component, event, helper) {
        component.set("v.currentPageNumber", component.get("v.totalPages"));
        helper.buildData(component, helper);
    },

    openModalWindow : function (component) {
        component.set("v.newObjectiveBool", true);
    },

    saveNewRecord : function (component, event) {
        component.set("v.newObjectiveBool", false);
        $A.get('e.force:refreshView').fire();
    },

    closeModalWindow : function (component) {
        component.set("v.newObjectiveBool", false);
    },

    windowEditOrDeleteRecord : function (component, event, helper) {
        var actionName = event.getParam('action').name;
        if(actionName === 'edit') {
            component.set("v.recordId", event.getParam('row').Id);
            component.set("v.editObjectiveBool", true);
        } else if(actionName === 'delete') {
            if(confirm('Are you sure?')) {
                helper.deleteRecord (component, event, helper);
            }
        }
    },

    closeWindowForEditRecord : function (component) {
        component.set("v.editObjectiveBool", false);
    },

    saveEditRecord : function (component, event) {
        component.set("v.editObjectiveBool", false);
        $A.get('e.force:refreshView').fire();
    },

    searchObjectives: function(component, event, helper) {
        var searchField = component.find('searchField');
        var isValueMissing = searchField.get('v.validity').valueMissing;
        if(isValueMissing) {
            searchField.showHelpMessageIfInvalid();
            searchField.focus();
        } else {
            helper.searchResultHelper(component, event);
        }
    },

    clearSearchInput: function (component, event, helper) {
        component.find("searchField").set("v.value", "");
        component.set("v.errorMsg", "");
        helper.getObjectives(component, event, helper);
    }
//Так же для редактирования можно использовать не кастомную форму, а стандартную, которая есть в сале.
//Но я запустила компонент в Lightning application, и это не работало. либо я что-то не добавила в аттрибуты, либо оно само по себе не работает
//Поэтому я остановилась на своём кастомном редактировании
//    editRecord : function (component, event, helper) {
//        var recId = event.getParam('row').Id;
//        var actionName = event.getParam('action').name;
//        if (actionName == 'Edit' ) {
//            var editRecordEvent = $A.get("e.force:editRecord");
//            editRecordEvent.setParams({
//                "recordId": recId
//            });
//            editRecordEvent.fire();
//        }
//    }
})