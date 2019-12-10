public class ObjectivesClass {

    @AuraEnabled
    public static List<Objective__c> getAllObjectives () {
        return [SELECT Id, Title__c, Description__c, Date_of_creation__c, Category__c, Priority__c, Is_Done__c, Image__c FROM Objective__c];
    }
    @AuraEnabled
    public static List<Objective__c> resultObjectives (String searchWord) {
        String searchKey = '%' + searchWord + '%';
        List<Objective__c> returnList = new List<Objective__c>();
        List<Objective__c> listOfObjectives = [
                SELECT Id,
                        Title__c,
                        Description__c,
                        Date_of_creation__c,
                        Category__c,
                        Priority__c,
                        Is_Done__c,
                        Image__c
                FROM Objective__c
                WHERE Title__c LIKE: searchKey];

        for (Objective__c obj: listOfObjectives) {
            returnList.add(obj);
        }
        return returnList;
    }

    @AuraEnabled
    public static List<Objective__c> deleteObjective (String objId) {
        delete [SELECT Id FROM Objective__c WHERE Id =: objId];
        return [SELECT Id, Title__c, Description__c, Date_of_creation__c, Category__c, Priority__c, Is_Done__c, Image__c FROM Objective__c];
    }
}