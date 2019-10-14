import { Edm, odata } from "odata-v4-server";

@Edm.Annotate({
    term: "UI.DisplayName",
    string: "Users"
})
export class User {
    
    @Edm.Key
    @Edm.Computed
    @Edm.Int32
    @Edm.Annotate({
        term: "UI.DisplayName",
        string: "Product identifier"
    }, {
        term: "UI.ControlHint",
        string: "ReadOnly"
    })
    Id: number;

    @Edm.String
    @Edm.Annotate({
        term: "UI.DisplayName",
        string: "Product title"
    }, {
        term: "UI.ControlHint",
        string: "ShortText"
    })
    Name:string;

    @Edm.Date
    CreatedDate:Date;

    @Edm.Int32
    CreatedById: number;

    @Edm.Date
    LastModifiedDate:Date;

    @Edm.Date
    LastModifiedById:number;

    @Edm.String
    FirstName:string;

    @Edm.String
    MiddleName:string;

    @Edm.String
    LastName:string;

    @Edm.String
    Email:string;

    @Edm.String
    Phone:string;

    @Edm.String
    MailingStreet:string;

    @Edm.String
    MailingColony:string;

    @Edm.String
    MailingCity:string;

    @Edm.String
    MailingState:string;
    
    @Edm.String
    MailingCountry:string;

    @Edm.String
    Username:string;

    @Edm.String
    Password:string;

    @Edm.Boolean
    IsActive:boolean;

    @Edm.String
    ExternalKey:string;

}