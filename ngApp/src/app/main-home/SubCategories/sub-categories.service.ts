import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SubCategory } from './SubCategory.model';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class SubCategoriesService {

  private subCategories: SubCategory[] = [];
  private subCategoriesUpdated = new Subject<SubCategory[]>();

  constructor(private http: HttpClient , private router : Router, private toaster: ToastrService) { }

  addSubCategory(subCategory: SubCategory) {
    
    return this.http.post<{ statusCode: number; Data: any }>('http://10.0.0.10:9999/api/SubCategory/add', subCategory )
    .subscribe(
      (response) => {
        if (response.statusCode == 204) {
          switch (response.Data ) {
            case 0:
              this.toaster.error("Problem in Server !! ");
              break;
            case 1:
              this.toaster.error("There is no Data to show !! ");
              break;
            case 2:
              this.toaster.error("Wrong Data !! ");
              break;
            case 3:
              this.toaster.error("Duplicated SubCategory Code !! ");
              break;
            case 4:
              this.toaster.error("Duplicated SubCategory Name !! ");
              break;
          
            default:
              this.toaster.error("Something not Correct !! ");
              break;
          }
        }else{
          console.log(response.Data);
          const SubCategory : SubCategory = {
            CategoryCode : subCategory.CategoryCode,
            categoryName : subCategory.categoryName,
            SubCategoryCode :  response.Data,
            SubCategoryName : subCategory.SubCategoryName
          }
          this.subCategories.push(SubCategory);
          this.subCategoriesUpdated.next([...this.subCategories]);
          this.toaster.success("SubCategory Added Successfully .. ");
          console.log(this.subCategories);
        }
      },
      (error) => {
        console.log(error)
      }
    );
  }

  getSubCategories() {
    return this.http.get<{ statusCode: number; Data: any }>('http://10.0.0.10:9999/api/SubCategory/list' )
      .pipe(
        map(subcategorysData => {
          if (subcategorysData.statusCode == 204) {
            switch (subcategorysData.Data ) {
              case 0:
              this.toaster.error("Problem in Server !! ");
              break;
            case 1:
              this.toaster.error("There is no Data to show !! ");
              break;
            case 2:
              this.toaster.error("Wrong Data !! ");
              break;
          
            default:
              this.toaster.error("Something not Correct !! ");
              break;
            }
          }else{
          return subcategorysData.Data.map( subCategory => {
            return {
              CategoryCode : subCategory.CategoryCode,
              categoryName : subCategory.categoryName,
              SubCategoryCode : subCategory.SubCategoryCode,
              SubCategoryName : subCategory.SubCategoryName
            }
          } )
        }
        })
      )
      .subscribe(transformedSubCategories => {
        this.subCategories = transformedSubCategories;
        this.subCategoriesUpdated.next([...this.subCategories]);
      });
  }

  getSubCategoriesUpdateListener() {
    return this.subCategoriesUpdated.asObservable();
  }

  getSubCategory(){
    return this.http.get<{ statusCode: number; Data: any }>('http://10.0.0.10:9999/api/SubCategory/list' )

  }

  deleteSubCategory(SubCatCode: number, SubCatName: string){
    console.log(SubCatCode)
    return this.http.post<{ statusCode: number; Data: any }>(`http://10.0.0.10:9999/api/SubCategory/Delete?SubCategoryCode=${SubCatCode}`,{} )
    .subscribe(( response ) => {
      if ( response.statusCode == 204) {
        switch (response.Data ) {
          case 51:
            this.toaster.warning("Delete SubCategories First !! ");
            break;
          case 52:
            this.toaster.warning("Delete Regions First !! ");
            break;
          case 53:
            this.toaster.warning("Delete Commerical First !! ");
            break;
          case 54:
            this.toaster.warning("Delete Cities First !! ");
            break;
          case 55:
            this.toaster.warning("Delete Certificates First !! ");
            break;
          case 56:
            this.toaster.warning("Delete Commerical Register First !! ");
            break;
        
          default:
            this.toaster.warning("There is no update in this Data !! ");
            break;
        }
      } else {
      const updatedSubCategories = this.subCategories.filter
      (category => 
         category.SubCategoryCode !== SubCatCode
        );
      this.subCategories = updatedSubCategories;
      this.subCategoriesUpdated.next([...this.subCategories]);
      this.toaster.success(`${SubCatName} Deleted Successfully .. `)
      }
    })

  }

  updateSubCategory(updSubCategory: SubCategory) {
    
    return this.http.post<{ statusCode: number; Data: any }>('http://10.0.0.10:9999/api/SubCategory/edit',updSubCategory )
    .subscribe(
      (response) => {
        if (response.statusCode == 204) {
          switch (response.Data ) {
            case 0:
              this.toaster.error("Problem in Server !! ");
              break;
            case 1:
              this.toaster.error("There is no Data to show !! ");
              break;
            case 2:
              this.toaster.error("Wrong Data !! ");
              break;
            case 3:
              this.toaster.error("Duplicated SubCategory Code !! ");
              break;
            case 4:
              this.toaster.error("Duplicated SubCategory Name !! ");
              break;
          
            default:
              this.toaster.error("Something not Correct !! ");
              break;
          }
        }else{
      const updatedSubCategories = this.subCategories;
      const oldSubCategoryIndex = updatedSubCategories.findIndex(f => f.SubCategoryCode === updSubCategory.SubCategoryCode);
      const subCategory: SubCategory = {
        SubCategoryCode: updSubCategory.SubCategoryCode,
        SubCategoryName: updSubCategory.SubCategoryName,
        CategoryCode: updSubCategory.CategoryCode,
        categoryName: updSubCategory.categoryName
      };
      updatedSubCategories[oldSubCategoryIndex] = subCategory;
      this.subCategories = updatedSubCategories;
      this.subCategoriesUpdated.next([...this.subCategories]);
      this.toaster.success("SubCategory Updated Successfully .. ");
    }
    });
  }

}
