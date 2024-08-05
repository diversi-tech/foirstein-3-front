import { makeObservable, runInAction, observable, action } from "mobx";
import { toJS } from "mobx";
import Swal from "sweetalert2";

const baseUrl = "https://libererisas-backend.onrender.com/api/Borrowing";

class BorrowingStore {
    borrowingList = [];
    //   isMessage = false;
    //   message = "";

    constructor() {
        makeObservable(this, {
            borrowingList: observable,
            fetchBorrowing: action,
            // updateTag: action,
            // deleteTag: action,
            // addTag: action,
        });
        this.fetchBorrowing();
    }

    // async fetchBorrowing() {
    //     try {
    //         // console.log("in fetch");
    //         debugger
    //         const borrowing = await fetch(`${baseUrl}/withDetails`);
    //         const jsonBorrowing = await borrowing.json();
    //         debugger
    //         // const jsBorrowing=toJS(jsonBorrowing)
    //         console.log("jsBorrowing: "+JSON.stringify(jsonBorrowing.data))
    //         this.borrowingList=jsBorrowing.data
    //         // runInAction(() => {
    //         //     this.borrowingList = this.extractRawData(data);
    //         //     console.log("Processed data:", this.borrowingList);
    //         // });
    //     } catch (error) {
    //         // this.failure("!!!בעיה בהבאת הנתונים");
    //         console.error("Failed to fetch tag:", error);
    //     }
    // }
    async fetchBorrowing() {
        try {
            const response = await fetch(`${baseUrl}/withDetails`); 
            const data = await response.json();
    
            console.log("Data from API:", data); 
            
            if (response.ok) { 
                runInAction(() => {
                    this.borrowingList = data.data || data; 
                    console.log("borrowing: "+this.borrowingList)
                });
            } else {
                console.error("Error fetching borrowing data:", data); 
            }
        } catch (error) {
            console.error("Failed to fetch borrowing data:", error); 
        }
    }
    

    extractRawData(proxyObject) {
        if (proxyObject != undefined && proxyObject.data != null) {
            console.log("Extracting data from proxy object:", proxyObject.data);
            return proxyObject.data;
        } else {
            console.log(
                "Returning original object as it's not a proxy:",
                proxyObject
            );
            return proxyObject;

        }
    }
    // async checkItemsUsingTag(tagId) {
    //     const response = await fetch(baseUrl + `/${tagId}/items`);
    //     const items = await response.json();
    //     return items;
    // }


    // async deleteTag(tagId) {
    //     try {
    //         console.log("in delete");
    //         const res = await fetch(baseUrl + "/" + tagId, {
    //             method: "DELETE",
    //         });
    //         if (res.status === 200) {
    //             this.success("!נמחק בהצלחה");
    //         } else {
    //             this.failure("!המחיקה נכשלה");
    //         }
    //         this.fetchTag();
    //     } catch (error) {
    //         console.error("Failed to delete tag:", error);
    //     }
    // }

    // async addTag(tagData) {
    //     try {
    //         console.log("tagData: " + JSON.stringify(tagData));
    //         const existingTag = this.tagList.find((tag) => tag.name === tagData.name);
    //         if (existingTag) {
    //             if (this.isMessage) {
    //                 this.message = "❌תג עם שם זהה כבר קיים!";
    //             } else {
    //                 this.failure("!תג עם שם זהה כבר קיים");
    //             }
    //         } else {
    //             const res = await fetch(baseUrl + "/", {
    //                 method: "POST",
    //                 headers: { "Content-Type": "application/json" },
    //                 body: JSON.stringify(tagData),
    //             });
    //             if (res.status === 200) {
    //                 if (this.isMessage) {
    //                     this.message = "✅נוסף בהצלחה!";
    //                 } else {
    //                     this.success("!נוסף בהצלחה");
    //                 }
    //             } else {
    //                 if (this.isMessage) {
    //                     this.message = "❌ההוספה נכשלה!";
    //                 } else {
    //                     this.failure("!ההוספה נכשלה");
    //                 }
    //             }
    //         }
    //         this.fetchTag();
    //     } catch (error) {
    //         console.error("Failed to update tag:", error);
    //     }
    // }

    // async updateTag(tagId, tagData) {
    //     try {
    //         console.log("tagData: " + JSON.stringify(tagData));
    //         const existingTag = this.tagList.find((tag) => tag.name === tagData.name);
    //         if (existingTag) {
    //             this.failure("!תג עם שם זהה כבר קיים");
    //         } else {
    //             const res = await fetch(baseUrl + "/" + tagId, {
    //                 method: "PUT",
    //                 headers: { "Content-Type": "application/json" },
    //                 body: JSON.stringify(tagData),
    //             });
    //             if (res.status === 200) {
    //                 this.success("!עודכן בהצלחה");
    //             } else {
    //                 this.failure("!העדכון נכשל");
    //             }
    //             this.fetchTag();
    //         }
    //     } catch (error) {
    //         console.error("Failed to update tag:", error);
    //     }
    // }
    // success(message) {
    //     Swal.fire({
    //         text: message,
    //         icon: "success",
    //         timer: 1700,
    //     });
    // }

    // failure(message) {
    //     Swal.fire({
    //         icon: "error",
    //         title: "...אופס",
    //         text: message,
    //         timer: 1700,
    //     });
    // }
    get getborrowingList() {
        return this.borrowingList;
    }
}
const borrowingStore = new BorrowingStore();
export default borrowingStore;
