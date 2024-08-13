import { makeAutoObservable, observable, action, computed } from 'mobx';
import { toJS } from 'mobx';

//const baseUrl='https://libererisas-backend.onrender.com/api/AddNewRequest';
const baseServerURL = import.meta.env.BASE_SERVER_URL;
const baseUrl = `${baseServerURL}/api/AddNewRequest`;
// const baseUrl1 = "https://localhost:7297/api/AddNewRequest";
// const url = 'https://librerisas-bafkend.onrender.com/api/Object';

class AddNewRequestStore {

    mediaList = [];
    mediaList2 = {};
    add = false;
    isUpdate;
    isDeleteItem;
    isDeleteTag;
    isError;
    isAdd;
    isAddItemTag;
    setAdd;
    constructor() {
        makeAutoObservable(this, {

            fetchMedia: action,
            updateMedia: action,
            deleteMedia: action,
            addItemTag:action,
            getPendingList:computed
        });
        // this.fetchPendingItems();
        this.fetchMedia();
    }

    // async deleteTag(itemId, tagId) {
    //     console.log("hiiDeleteTag");
    //     try {
    //         const res = await fetch(`${baseURL}/${itemId}/${tagId}`, {
    //             method: 'DELETE'
    //         });
    //         console.log("delete tag:");
    //         if (res.status === 200) {
    //             this.isDeleteTag = true;
    //         }
    //         else {
    //             this.isDeleteTag = false;
    //         }
    //         this.fetchMedia();
    //     } catch (error) {
    //         console.error('Failed to delete media:', error);
    //     }
    // }


    async fetchMedia() {
        try {
            const res = await fetch(baseUrl);
            const obj = await res.json();
            // console.log(obj,"obj");
            // ככה לעשות
            // this.mediaList = obj.data["item"];
            // this.mediaList2 = obj.data["object"];

            //////////

            this.mediaList = obj.data;
            // console.log("list media: ", this.mediaList);
            // const res2 = await fetch(`${url}`);
            // const obj2 = await res2.data;
            // this.mediaList2 = obj2.res2;
            // this.mediaList2=[...obj, ...obj2];

        }
        catch (error) {
            console.error('Failed to fetch media:', error);
        }
    }

    async uploadMediaFile(mediaData) {
        try {
            const res = await fetch(`${baseURL}/file`, {
                method: 'POST',
                body: mediaData,
            });
            if (res.status === 200) {
                this.isError = false;
            } else {
                this.isError = true;
            }
            this.fetchMedia();
        } catch (error) {
            console.error('Failed to upload media:', error);
            this.isError = true;
        }
    }

    async uploadMediaBook(mediaData) {
        try {
            const res = await fetch(`${baseURL}/book`, {
                method: 'POST',
                body: mediaData,
            });
            if (res.status === 200) {
                this.isError = false;
            } else {
                this.isError = true;
            }
            this.fetchMedia();
        } catch (error) {
            console.error('Failed to upload media:', error);
            this.isError = true;
        }
    }

    async uploadMediaObject(mediaData) {
        try {
            const res = await fetch(`${url}/book`, {
                method: 'POST',
                body: mediaData,
            });
            if (res.status === 200) {
                this.isErrorObject = false;
            } else {
                this.isErrorObject = false;
            }
            this.fetchMedia();
        } catch (error) {
            console.error('Failed to upload media:', error);
            this.isError = true;
        }
    }

    async deleteObject(mediaId) {
        console.log("hiiDeleteMedia!!!!!!!!");
        try {
            const res = await fetch(`${baseUrl}/${mediaId}`, {
                method: 'DELETE'
            });
            if (res.status === 200) {
                this.isDeleteObject = true;
            }
            else {
                this.isDeleteObject = false;
            }
            this.fetchMedia();
        } catch (error) {
            console.error('Failed to delete media:', error);
        }
    }

    // async deleteMedia(mediaId) {
    //     console.log("hiiDeleteMedia!!!!!!!!");
    //     try {
    //         const res = await fetch(`${baseURL}/${mediaId}`, {
    //             method: 'DELETE'
    //         });
    //         if (res.status === 200) {
    //             this.isDeleteItem = true;
    //         }
    //         else {
    //             this.isDeleteItem = false;
    //         }
    //         this.fetchMedia();
    //     } catch (error) {
    //         console.error('Failed to delete media:', error);
    //     }
    // }

    async updateMediaObject(mediaId, mediaData) {
        try {
            console.log("formData: ", mediaData, "beforeFetch");
            const res = await fetch(`${url}/book/${mediaId}`, {
                method: 'PUT',
                body: mediaData
            });
            console.log("formData: ", mediaData, "afterFetch");
            this.fetchMedia();

            if (res.status === 200) {
                this.isUpdateObject = true;
            }
            else {
                this.isUpdateObject = false;
            }
        } catch (error) {
            console.error('Failed to update media:', error);
        }
    }

    async updateMediaBook(mediaId, mediaData) {
        try {

            console.log("formData: ", mediaData, "beforeFetch");
            const res = await fetch(`${baseURL}/book/${mediaId}`, {
                method: 'PUT',
                body: mediaData
            });
            console.log("formData: ", mediaData, "afterFetch");
            this.fetchMedia();

            if (res.status === 200) {
                this.isUpdate = true;
            }
            else {
                this.isUpdate = false;
            }
        } catch (error) {
            console.error('Failed to update media:', error);
        }
    }

    // async updateMediaFile(mediaId, mediaData) {
    //     try {

    //         console.log("formData: ", mediaData, "beforeFetch");
    //         const res = await fetch(`${baseURL}/file/${mediaId}`, {
    //             method: 'PUT',
    //             body: mediaData
    //         });
    //         console.log("formData: ", mediaData, "afterFetch");
    //         this.fetchMedia();

    //         if (res.status === 200) {
    //             this.isUpdate = true;
    //         }
    //         else {
    //             this.isUpdate = false;
    //         }
    //     } catch (error) {
    //         console.error('Failed to update media:', error);
    //     }
    // }
    // async addItemTag(itemId, tagId) {
    //     try {
    //         debugger
    //         const res = await fetch(`${baseURL}/${itemId}/${tagId}`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify({ itemId: itemId, tagId: tagId })
    //         });
    //         console.log("add item tag:" + res.status);
    //         if (res.status === 200) {
    //             this.isAddItemTag = true;
    //         }
    //         else {
    //             this.isAddItemTag = false;
    //         }
    //         this.fetchMedia();
    //     } catch (error) {
    //         console.error('Failed to add item tag:', error);
    //     }
    // }
    // updateItem(updatedItem) {
    //     const index = this.mediaList.findIndex(item => item.id === updatedItem.id);
    //     if (index > -1) {
    //       this.mediaList[index] = { ...this.mediaList[index], ...updatedItem };
    //     }
    //   }
}
const addNewRequestStore = new AddNewRequestStore();
export default addNewRequestStore;