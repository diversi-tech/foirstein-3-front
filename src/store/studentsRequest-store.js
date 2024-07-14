import {
  makeObservable,
  runInAction,
  observable,
  computed,
  action,
} from "mobx";
import Swal from "sweetalert2";
const baseUrl = "https://localhost:7297/api/";

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

  async fetchRequest() {
    try {
      const res = await fetch(baseUrl + "BorrowRequest");
      let data = await res.json();

      runInAction(() => {
        this.requestList = this.extractRawData(data);
        debugger
      });
    } catch (error) {
      console.error("Failed to fetch request:", error);
    }
  }

  get getRequest() {
    debugger
    return this.requestList;
  }
  //פונקציה שמחלצת מהפרוקסי
  extractRawData(proxyObject) {
    if (proxyObject && proxyObject.data) {
      return proxyObject.data;
    } else {
      return proxyObject;
    }
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
      console.log(res);
      if (res.status === 200) {
        Swal.fire({
          title:"! הבקשה עודכנה בהצלחה ",
          icon: "success",
        });
        runInAction(() => {
          this.fetchRequest();
        });
      } else {
        Swal.fire({
          title:  "... העדכון נכשל",
          icon: "error",
          confirmButtonText: "Cool",
        });
      }
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
      if (res.status === 200) {
        Swal.fire({
          title:"! הבקשה עודכנה בהצלחה ",
          icon: "success",
        });
        runInAction(() => {
          this.fetchRequest();
        });
      } else {
        Swal.fire({
          title:  "... העדכון נכשל",
          icon: "error",
          confirmButtonText: "Cool",
        });
      }
    } catch (error) {
      console.error("Failed to fetch request:", error);
    }
  }
  //פונקציה שמחזירה את פרטי הסטודנט
  async getDetailsOfUser(userId) {
    try {
      const res = await fetch(
        `${baseUrl}BorrowApprovalRequest/user/${userId}`,
        {
          method: "GET",
        }
      );
      if (res.status === 200) {
        Swal.fire({
          title:"! הבקשה עודכנה בהצלחה ",
          icon: "success",
        });
      } else {
        Swal.fire({
          title:  "... העדכון נכשל",
          icon: "error",
          confirmButtonText: "Cool",
        });
      }
    } catch (error) {
      console.error("Failed to fetch request:", error);
    }
  }
}

const requestStore = new StudentsRequestStore();
export default requestStore;
