import {
  makeObservable,
  runInAction,
  observable,
  computed,
  action,
} from "mobx";
import Swal from "sweetalert2";
const baseUrl = "https://libererisas-backend.onrender.com/api/";

// Utility function to extract raw data
const extractRawData = (proxyObject) => {
  if (proxyObject && proxyObject.data) {
    return proxyObject.data;
  } else {
    return proxyObject;
  }
};

class StudentsRequestStore {
  requestList = [];
  isUpdate = false;
  isError = false;
  isDelete = false;
  message = "הקובץ עודכן בהצלחה!";

  constructor() {
    makeObservable(this, {
      requestList: observable,
      getRequest: computed,
      fetchRequest: action,
      updateApproveRequest: action,
      updateDenyRequest: action,
    });
    this.fetchRequest();
  }
  async fetchRequest(){
    try {
      const res = await fetch(`${baseUrl}BorrowRequest`);
      const data = await res.json();
      this.requestList=data;
      return data;
    } catch (error) {
      console.error("Failed to fetch data:", error);
      console.log("!!!!!");
      return [];
    }
  }
  get getRequest() {
    
    console.log("request: "+this.requestList)
    return this.requestList;
  }
  //עדכון שהבקשה אושרה
  async updateApproveRequest(requestId) {
    try {
      const res = await fetch(
        `${baseUrl}BorrowApprovalRequest/approve/${requestId}`,
        {
          method: "PUT",
        }
      );
      runInAction(() => {
        this.fetchRequest();
      });
      return res;
    } catch (error) {
      console.error("Failed to fetch request:", error);
    }
  }
  //עדכון שהבקשה נדחתה
  async updateDenyRequest(requestId) {
    try {
      const res = await fetch(
        `${baseUrl}BorrowApprovalRequest/deny/${requestId}`,
        {
          method: "PUT",
        }
      );
      runInAction(() => {
        this.fetchRequest();
      });
      return res;
    } catch (error) {
      console.error("Failed to fetch request:", error);
    }
  }
  async getById(requestId) {
    try {
      const res = await fetch(`${baseUrl}BorrowApprovalRequest/details/${requestId}`);
      let data = await res.json();
      return extractRawData(data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      Swal.fire({
        icon: "Error",
        title: " אופס,שגיאה בהבאת הנתונים.. ",
        
        showConfirmButton: false,
        timer: 1500
      });
      throw error;
    }
  }
}

const requestStore = new StudentsRequestStore();
export default requestStore;
