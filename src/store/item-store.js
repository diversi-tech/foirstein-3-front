//קוד קודם*****************************************************************************


// // import { action, makeObservable, observable } from "mobx";
// // class MediaStore {
// //     url = "http://localhost:8787";//צריך לשנות ךפי הניתו של השרת
// //     mediaList = [];
// //     tempMediaList = [];
// //     isUpload = false;//בודק אם הצליח להעלות קובץ או לא
// //     isClick = true;
// //     constructor() {
// //         makeObservable(this, {
// //             mediaList: observable,
// //             tempMediaList: observable,
// //             isClick: observable,
// //             getList: action,
// //             sendDataToServer: action,
// //             addMediaData: action,
// //             deleteMediaFromServer: action,
// //             updateMediaInServer: action
// //         })
// //         // this.sendDataToServer();
// //     }

// //     async sendDataToServer() {
// //         this.mediaList = await this.getList();
// //         for (const media of this.tempMediaList) {
// //             const { title, description, tagת, file} = media;
// //             if (!(this.mediaList.find((media) => media.title === title))) {//בדיקה אם אין שני קבצים עם אותה כותרת
// //                 await fetch(this.url + "/media", {
// //                     method: "POST",
// //                     headers: { "Content-Type": "application/json", },
// //                     body: JSON.stringify({ title, description, tag })
// //                 });
// //             }
// //         }
// //         this.tempMediaList = await this.getList();
// //     }

// //     async addMediaData( title, description, tag, file) {
// //         const res = await fetch(this.url + "/media", {
// //             method: "POST",
// //             headers: { "Content-Type": "application/json", },
// //             body: JSON.stringify({ title, description, tag, file })
// //         });
// //         if (res.status === 200) {
// //             this.isUpload = true;
// //         }
// //         else {
// //             this.isUpload = false;
// //         }
// //         this.tempMediaList = await this.getList();
// //     }

// //     async deleteMediaFromServer(title) {
// //         fetch(`http://localhost:8787/media/${title}`, {
// //             method: 'DELETE'
// //         })
// //             .then(response => response.json())
// //             .then(() => {
// //                 console.log('Media deleted successfully');
// //                 // כאן תוכלי לעדכן את המצב של הרשימה או לבצע פעולה אחרת לאחר המחיקה
// //             })
// //             .catch(error => console.error('Error:', error));
// //     }

// //     async updateMediaInServer(title, updateMedia) {
// //         fetch(`http://localhost:8787/media?title=${encodeURIComponent(title)}`, {
// //             method: 'PUT',
// //             headers: {
// //                 'Content-Type': 'application/json',
// //             },
// //             body: JSON.stringify(updateMedia)
// //         })
// //             .then(response => response.json())
// //             .then(() => {
// //                 console.log('Media updated successfully');
// //                 // עדכון המצב של הרשימה או פעולה אחרת
// //             })
// //             .catch(error => console.error('Error:', error));
// //     }


// //     getList = async () => {
// //         const files = await fetch(this.url + "/media");
// //         const data = await files.json();
// //         return data;
// //     }
// // }
// // export default new MediaStore();

// // src/store/MediaStore.js
// import { makeAutoObservable, observable } from 'mobx';

// class MediaStore {
//     mediaList = [];
//     isDelete = false;
//     isUpdate = false;
//     isAdd = false

//     constructor() {
//         makeAutoObservable(this, {
//             isDelete: observable,
//             isAdd: observable,
//             isUpdate: observable

//         });
//     }

//     async fetchMedia() {//getList
//         try {
//             const res = await fetch('/api/media');
//             this.mediaList = await response.json();
//         } catch (error) {
//             console.error('Failed to fetch media:', error);
//         }

//     }

//     async uploadMedia(mediaType, mediaData) {
//         try {//  mediaData מכיל את כל נתוני הטופס שב FORMDATA
//             const formData = new FormData();
//             for (const key in mediaData) {
//                 formData.append(key, mediaData[key]);
//             }
//             await fetch('/api/upload', {
//                 method: 'POST',
//                 body: formData
//             });
//             this.fetchMedia();
//         } catch (error) {
//             console.error('Failed to upload media:', error);
//         }
//         if (res.status == 200) { this.isAdd = true }
//     }

//     async deleteMedia(mediaId) {
//         try {
//             await fetch(`/api/media/${mediaId}`, {
//                 method: 'DELETE'
//             });
//             this.fetchMedia();
//         } catch (error) {
//             console.error('Failed to delete media:', error);
//         }
//         if (res.status == 200) { this.isDelete = true }

//     }

//     async updateMedia(mediaId, mediaData) {
//         try {
//             const formData = new FormData();
//             for (const key in mediaData) {
//                 formData.append(key, mediaData[key]);
//             }
//             await fetch(`/api/media/${mediaId}`, {
//                 method: 'PUT',
//                 body: formData
//             });
//             this.fetchMedia();
//         } catch (error) {
//             console.error('Failed to update media:', error);
//         }
//         if (res.status == 200) { this.isUpdate = true }
//     }
// }

// const mediaStore = new MediaStore();
// export default mediaStore;

//חדש********************************************************************************************

import { makeAutoObservable, observable, action } from 'mobx';

class ItemStore {
    mediaList = [];
    add = false;
    isUpdate = false;
    isError = true;
    isDelete = false;
    message = "";

    constructor() {
        makeAutoObservable(this, {
            isDelete: observable,
            mediaList: observable,
            isAdd: observable,
            isUpdate: observable,
            isError: observable,
            // setAdd: action,
            add: observable,
            fetchMedia: action,
            updateMedia: action
        });
        this.fetchMedia();
    }
    // setAdd(value) {
    //     this.add = value;
    // }

    async fetchMedia() {
        try {
            const res = await fetch('https://localhost:7297/api/Item');
            const obj = await res.json();
            this.mediaList = obj.data;
            console.log("list media: ",this.mediaList);
        } 
        catch (error) {
            console.error('Failed to fetch media:', error);
        }
    }

    async uploadMedia(mediaType, mediaData) {
        try {
            const formData = new FormData();
            for (const key in mediaData) {
                formData.append(key, mediaData[key]);
            }
            const res = await fetch('https://localhost:7297/api/Item', {
                method: 'POST',
                body: formData
            });
            if (res.status === 200) {
                this.isError = true;
                this.message = " הועלה בהצלחה! ✅"
            }
            else{
                this.isError = false;
                this.message = "העלאה נכשלה"
            }
            this.fetchMedia();
        } 
        catch (error) {
            console.error('Failed to upload media:', error);
            this.isError = true;
        }
    }      

    async deleteMedia(mediaId) {
        try {
            const res = await fetch(`https://localhost:7297/api/Item/${mediaId}`, {
                method: 'DELETE'
            });
            if (res.status === 200) {
                this.isDelete = true;
                this.message = " נמחק בהצלחה! ✅"

            }
            else{
                this.isDelete = false;
                this.message = "מחיקה נכשלה"
            }
            this.fetchMedia();
        } catch (error) {
            console.error('Failed to delete media:', error);
        }
    }

    async updateMedia(mediaId, mediaData) {
        try {
            const formData = new FormData();
            for (const key in mediaData) {
                formData.append(key, mediaData[key]);
            }
            console.log("formData: ", formData, "beforeFetch");
            const res = await fetch(`https://localhost:7297/api/Item/${mediaId}`, {
                method: 'PUT',
                body: formData
            });
            console.log("formData: ", formData, "afterFetch");

            if (res.status === 200) {
                this.isUpdate = true;
                this.message = "  הקובץ  עודכן בהצלחה! ✅";
            }
            else{
                this.isUpdate = false;
                this.message = "!עדכון הקובץ לא הצליח"
            }
            this.fetchMedia();
        } catch (error) {
            console.error('Failed to update media:', error);
        }
    }
 

    // async updateMedia(id, updatedItem) {
    //     console.log("Updating media with ID:", id);
    //     console.log("Updated item:", updatedItem);
    
    //     if (!id) {
    //       throw new Error("ID is not defined");
    //     }
    
    //     try {
    //       const response = await fetch(`https://localhost:7297/api/Item/${id}`, {
    //         method: 'PUT',
    //         body: updatedItem
    //       });
    
    //       console.log("Fetch response:", response);
    //       const responseBody = await response.text();
    //       console.log("Response body:", responseBody);
    
    //       if (!response.ok) {
    //         throw new Error(`Error: ${response.statusText}`);
    //       }
    
    //       const index = this.mediaList.findIndex(item => item.id === id);
    //       if (index !== -1) {
    //         this.mediaList[index] = updatedItem;
    //       } else {
    //         this.mediaList.push(updatedItem);
    //       }
    
    //       return response;
    //     } catch (error) {
    //       console.error('Fetch error:', error);
    //       throw error;
    //     }
    //   }
}
const itemStore = new ItemStore();
export default itemStore;