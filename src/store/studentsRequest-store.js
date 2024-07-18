import {
  makeObservable,
  runInAction,
  observable,
  computed,
  action,
} from "mobx";
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
      const res = await fetch(baseUrl + `BorrowApprovalRequest`);
      const data = await res.json();
      const rows = extractRawData(data.data); 
      return rows;
    } catch (error) {
      console.error("Failed to fetch data:", error);
      return [];
    }
  }
  get getRequest() {
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
      alert('שגיאה בחיבור למסד נתונים')
      throw error;
    }
  }
}

const requestStore = new StudentsRequestStore();
export default requestStore;
