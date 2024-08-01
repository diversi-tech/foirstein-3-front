import { makeAutoObservable, observable, action, computed } from 'mobx';
import { toJS } from 'mobx';

const baseURL='https://libererisas-backend.onrender.com/api/Item';
// const baseURL = 'https://localhost:7297/api/Item';
// const url = 'https://localhost:7297/api/PhysicalItem';

class ItemStore {
    pendingItemsList = []
    mediaList = [];
    mediaList2 = [];
    add = false;
    isUpdate;
    isDeleteItem;
    isDeleteTag;
    isError;
    isApprov = false;

    constructor() {
        makeAutoObservable(this, {
            isDeleteItem: observable,
            isDeleteTag: observable,
            mediaList: observable,
            isAdd: observable,
            isUpdate: observable,
            isDelete: observable,
            isError: observable,
            setAdd: action,
            add: observable,
            fetchMedia: action,
            updateMedia: action,
            isApprov: observable,
            pendingItemsList: observable,
            fetchPendingItems: action,
            approvalItem: action,
            deniedItem: action,
            deleteMedia: action,
            isAddItemTag:observable,
            addItemTag:action
        });
        this.fetchPendingItems();
        this.fetchMedia();
    }

    async deleteTag(itemId, tagId) {
        console.log("hiiDeleteTag");
        try {
            const res = await fetch(`${baseURL}/${itemId}/${tagId}`, {
                method: 'DELETE'
            });
            console.log("delete tag:");
            if (res.status === 200) {
                this.isDeleteTag = true;
            }
            else {
                this.isDeleteTag = false;
            }
            this.fetchMedia();
        } catch (error) {
            console.error('Failed to delete media:', error);
        }
    }

    get getPendingList() {
        return this.pendingItemsList;
    }
    async fetchPendingItems() {

        try {
            const res = await fetch(`${baseURL}/Pending`);
            const obj = await res.json();
            let list = toJS(obj);
            this.pendingItemsList = list;
            console.log(list);
            console.log(toJS(obj));
        }
        catch (error) {
            console.error('Failed to fetch media:', error);
        }
    }
    async approvalItem(itemId) {
        console.log(itemId)
        // this.isApprov = false;
        try {
            const res = await fetch(`${baseURL}/approvItem/${itemId}`, { method: 'PUT' });
            console.log("status:" + res.status);
            if (res.status === 200) {
                this.isApprov = true;
                // this.message = " הפריט אושר";
                await itemStore.fetchPendingItems();
            }
            else {
                // this.message = "אישור פריט לא הצליח"
            }
            this.fetchPendingItems();
        } catch (error) {
            console.error('Failed to approv the item:', error);
        }
    }
    async deniedItem(itemId) {
        console.log(itemId)
        this.isDeind = false;
        try {
            const res = await fetch(`${baseURL}/deny/${itemId}`, {
                method: 'PUT'
            });
            if (res.status === 200) {
                this.isDeind = true;
                // this.message = " הפריט נדחה ✅";
            }
            else {
                this.isUpdate = false;
                // this.message = "!אישור פריט לא הצליח"
            }
            this.fetchPendingItems();
        } catch (error) {
            console.error('Failed to approv the item:', error);
        }
    }

    async fetchMedia() {
        try {
            const res = await fetch('https://localhost:7297/api/Item');
            const obj = await res.json();
            // ככה לעשות
            // this.mediaList = obj.data["items"];
            // this.mediaList2 = obj.data["physicalItems"];

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

    // async uploadMediaObject(mediaData) {
    //     try {
    //         const res = await fetch(`${baseURL}`, {
    //             method: 'POST',
    //             body: mediaData,
    //         });
    //         if (res.status === 200) {
    //             this.isErrorObject = false;
    //         } else {
    //             this.isErrorObject = false;
    //         }
    //         this.fetchMedia();
    //     } catch (error) {
    //         console.error('Failed to upload media:', error);
    //         this.isError = true;
    //     }
    // }


    // async deleteObject(mediaId) {
    //     console.log("hiiDeleteMedia!!!!!!!!");
    //     try {
    //         const res = await fetch(`${baseURL}/${mediaId}`, {
    //             method: 'DELETE'
    //         });
    //         if (res.status === 200) {
    //             this.isDeleteObject = true;
    //         }
    //         else {
    //             this.isDeleteObject = false;
    //         }
    //         this.fetchMedia();
    //     } catch (error) {
    //         console.error('Failed to delete media:', error);
    //     }
    // }

    async deleteMedia(mediaId) {
        console.log("hiiDeleteMedia!!!!!!!!");
        try {
            const res = await fetch(`${baseURL}/${mediaId}`, {
                method: 'DELETE'
            });
            if (res.status === 200) {
                this.isDeleteItem = true;
            }
            else {
                this.isDeleteItem = false;
            }
            this.fetchMedia();
        } catch (error) {
            console.error('Failed to delete media:', error);
        }
    }

    // async updateMediaObject(mediaId, mediaData) {
    //     try {
    //         console.log("formData: ", mediaData, "beforeFetch");
    //         const res = await fetch(`${url}/${mediaId}`, {
    //             method: 'PUT',
    //             body: mediaData
    //         });
    //         console.log("formData: ", mediaData, "afterFetch");
    //         this.fetchMedia();

    //         if (res.status === 200) {
    //             this.isUpdateObject = true;
    //         }
    //         else {
    //             this.isUpdateObject = false;
    //         }
    //     } catch (error) {
    //         console.error('Failed to update media:', error);
    //     }
    // }

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

    async updateMediaFile(mediaId, mediaData) {
        try {

            console.log("formData: ", mediaData, "beforeFetch");
            const res = await fetch(`${baseURL}/file/${mediaId}`, {
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
    async addItemTag(itemId, tagId) {
        try {
            // debugger
            const res = await fetch(`${baseURL}/${itemId}/${tagId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ itemId: itemId, tagId: tagId })
            });
            console.log("add item tag:" + res.status);
            if (res.status === 200) {
                this.isAddItemTag = true;
            }
            else {
                this.isAddItemTag = false;
            }
            this.fetchMedia();
        } catch (error) {
            console.error('Failed to add item tag:', error);
        }
    }
    updateItem(updatedItem) {
        const index = this.mediaList.findIndex(item => item.id === updatedItem.id);
        if (index > -1) {
          this.mediaList[index] = { ...this.mediaList[index], ...updatedItem };
        }
      }





        validateToken = async () => {
        const token = sessionStorage.getItem('jwt');
        if (!token) return false;
        try {
          debugger
          const response = await axios.post('https://foirstein-1-back.onrender.com/api/validate-token', { token });
          return response;
        } catch (error) {
          console.error('Error validating token:', error);
          return false;
        }
      };
  
      
}
const itemStore = new ItemStore();
export default itemStore;