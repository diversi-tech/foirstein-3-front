import { makeObservable, runInAction, observable, action } from "mobx";
import { toJS } from "mobx";
import Swal from "sweetalert2";

//const baseUrl = "https://libererisas-backend.onrender.com/api/Borrowing";
const baseServerURL = import.meta.env.BASE_SERVER_URL;
const baseUrl = `${baseServerURL}/api/Borrowing`;
class BorrowingStore {
    borrowingList = [];

    constructor() {
        makeObservable(this, {
            borrowingList: observable,
            fetchBorrowing: action,
        });
        this.fetchBorrowing();
    }

    async fetchBorrowing() {
        try {
            const response = await fetch(`${baseUrl}/withDetails`); 
            const data = await response.json();   
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
    
    get getborrowingList() {
        return this.borrowingList;
    }
}
const borrowingStore = new BorrowingStore();
export default borrowingStore;
