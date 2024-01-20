import {create} from 'zustand';

const useUidStore=create((set)=>({
    uid: null,
    setUid: (id)=>set({uid: id})
}));

export default useUidStore;