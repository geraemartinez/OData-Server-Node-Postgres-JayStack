import { Edm, odata } from "odata-v4-server";
import { Product } from "./Product"

export class Category {
    @Edm.Key
    @Edm.Computed
    @Edm.Int32
    @Edm.Annotate({
      term: "UI.DisplayName",
      string: "Category identifier"
    },
    {
    term: "UI.ControlHint",
    string: "ReadOnly"
    })
    Id: number

    @Edm.String
    @Edm.Annotate({
      term: "UI.DisplayName",
      string: "Category name"
    },
    {
    term: "UI.ControlHint",
    string: "ShortText"
    })
    Name: string
  
    @Edm.String
    Description: string

    @Edm.Date
    CreatedDate:Date;
    
    @Edm.Date
    LastModifiedDate:Date;
  
    @Edm.Collection(Edm.EntityType(Product))
    @Edm.Partner("Category")
    Products: Product[]
  }