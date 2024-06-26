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

import { makeAutoObservable, observable } from 'mobx';

class MediaStore {
    mediaList = [
        {
            title: "bbbb",
            description: "aaaaaa",
            tag: "Tag1",
            shelf: "k1",
            type: 'book'
        },
        {
            title: "fffff",
            description: "hhhhh",
            tag: "Tag2",
            shelf: "1",
            type: 'file'
        }
    ];
   
    isError = true;

    constructor() {
        makeAutoObservable(this, {
            isDelete: observable,
            isAdd: observable,
            isUpdate: observable,
            isError: observable
        });
    }

    async fetchMedia() {
        try {
            const res = await fetch('/api/media');
            this.mediaList = await res.json();
        } catch (error) {
            console.error('Failed to fetch media:', error);
        }
    }

    async uploadMedia(mediaType, mediaData) {
        try {
            const formData = new FormData();
            for (const key in mediaData) {
                formData.append(key, mediaData[key]);
            }
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            this.fetchMedia();
        } catch (error) {
            console.error('Failed to upload media:', error);
            this.isError = true;
        }
        if (res.status === 200) {
            this.isError = false;
        }
    }

    async deleteMedia(mediaId) {
        try {
            const res = await fetch(`/api/media/${mediaId}`, {
                method: 'DELETE'
            });
            if (res.status === 200) {
                this.isDelete = true;
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
            const res = await fetch(`/api/media/${mediaId}`, {
                method: 'PUT',
                body: formData
            });
            if (res.status === 200) {
                this.isUpdate = true;
            }
            this.fetchMedia();
        } catch (error) {
            console.error('Failed to update media:', error);
        }
    }
}

const mediaStore = new MediaStore();
export default mediaStore;

