import {create} from 'zustand';

const useAuthStore = create((set)=>({
    authToken: null,
    setAuthToken: (token) => set({authToken: token}), 
}));

export default useAuthStore;