import { Edm, odata } from "odata-v4-server";
import { Category } from "./Category";
import 'reflect-metadata'

@Edm.Annotate({
  term: "UI.DisplayName",
  string: "Products"
})
export class Product {
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

  @Edm.String
  Description:string;

  @Edm.Date
  CreatedDate:Date;
  
  @Edm.Date
  LastModifiedDate:Date;

  @Edm.String
  Sku:string;

  @Edm.String
  Url: string;

  @Edm.Boolean
  IsActive:boolean;

  @Edm.String
  ProductCode:string;

  @Edm.String
  ProductExternalKey:string;

  @Edm.Int32
  CreatedById: number;

  @Edm.Int32
  LastModifiedById:number;
  
  @Edm.Int32
  UnitMesureId:number;

  @Edm.Int32
  DepartmentId:number;

  @Edm.Int32
  CategoryId:number;
  
  @Edm.EntityType(Category)
  @Edm.Partner("Products")
  Category: Category
}