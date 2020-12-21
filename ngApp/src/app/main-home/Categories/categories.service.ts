import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, filter } from "rxjs/operators";
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Category } from './Category.model';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  private categories: Category[] = [];
  private categoriesUpdated = new Subject<Category[]>();
  error ;

  constructor(private http: HttpClient , private router : Router, private toaster: ToastrService) { }

  addCategory(category: Category) {
    return this.http.post<{ statusCode: number; Data: any }>('http://10.0.0.10:9999/api/Category/add', category )
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
              this.toaster.error("Duplicated Category Code !! ");
              break;
            case 4:
              this.toaster.error("Duplicated Category Name !! ");
              break;
          
            default:
              this.toaster.error("Something not Correct !! ");
              break;
          }
        }else{
        console.log(category);
        console.log(response.Data);
        this.categories.push(category);
        this.categoriesUpdated.next([...this.categories]);
        this.toaster.success(`Category Added Successfully .. `)
        console.log(this.categories);
        }
      },
      (error) => {
        console.log(error)
      }
    );
  }

  getCategories() {
  
    return this.http.get<{ statusCode: number; Data: any }>('http://10.0.0.10:9999/api/Category/list')
      .pipe(
        map(categorysData => {
          if (categorysData.statusCode == 204) {
            switch (categorysData.Data ) {
              case 0:
                this.error = "Problem in Server";
                this.toaster.error("Problem in Server !! ");
                break;
              case 1:
                this.error = "There is no Data to show"
                this.toaster.error("There is no Data to show !! ");
                break;
              case 2:
                this.error = "Wrong Data";
                this.toaster.error("Wrong Data !! ");
                break;
            
              default:
                this.toaster.error("Somthing not Correct !! ");
                break;
            }
          }else{
          return categorysData.Data.map( category => {
            return {
              CategoryCode : category.CategoryCode,
              CategoryName : category.CategoryName,
              oldCategoryCode : category.oldCategoryCode
            }
          } )
        }
        })
      )
      .subscribe(transformedCategories => {
        this.categories = transformedCategories;
        this.categoriesUpdated.next([...this.categories]);
      });
  }

  getCategoriesUpdateListener() {
    return this.categoriesUpdated.asObservable();
  }

  getCategory(){
    return this.http.get<{ statusCode: number; Data: any }>('http://10.0.0.10:9999/api/Category/list')

  }

  deleteCategory(catCode : number, catName: string){
    console.log(catCode)
    return this.http.post<{ statusCode: number; Data: any }>(`http://10.0.0.10:9999/api/Category/Delete?categoryCode=${catCode}`,{})
    .subscribe(( response ) => {
      if ( response.statusCode == 204) {
        if (response.Data == 51) {
          this.toaster.warning("Delete SubCategories that Related this Category First !! ");
        }
      } else {
      const updatedCategories = this.categories.filter( category => 
         category.CategoryCode !== catCode
        );
      this.categories = updatedCategories;
      this.categoriesUpdated.next([...this.categories]);
      this.toaster.success(`${catName} Deleted Successfully .. `)
      }
    })

  }

  updateCategory(updCategory: Category){
    return this.http.post<{ statusCode: number; Data: any }>('http://10.0.0.10:9999/api/Category/edit',updCategory )
    .subscribe((response) => {
      if (response.statusCode == 204) {
        switch (response.Data ) {
          case 0:
            this.error = "Problem in Server";
            this.toaster.error("Problem in Server !! ");
            break;
          case 1:
            this.error = "There is no Data to show"
            this.toaster.error("There is no Data to show !! ");
            break;
          case 2:
            this.error = "Wrong Data";
            this.toaster.error("Wrong Data !! ");
            break;
          case 3:
            this.error = "Duplicated Category Code";
            this.toaster.error("Duplicated Category Code !! ");
            break;
          case 4:
            this.error = "Duplicated Category Name";
            this.toaster.error("Duplicated Category Name !! ");
            break;
        
          default:
            this.error = "Somthing not Correct";
            this.toaster.error("Somthing not Correct !! ");
            break;
        }
      }else{
      const updatedCategories = this.categories;
      const oldCategoryIndex = updatedCategories.findIndex(f => f.CategoryCode === updCategory.CategoryCode);
      const category: Category = {
        CategoryCode: updCategory.CategoryCode,
        CategoryName: updCategory.CategoryName,
        oldCategoryCode: updCategory.CategoryCode
      };
      updatedCategories[oldCategoryIndex] = category;
      this.categories = updatedCategories;
      this.categoriesUpdated.next([...this.categories]);
      this.toaster.success("Category Updated Successfully .. ");
    }
    });
  }

}
