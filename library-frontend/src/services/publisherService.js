import api from './api';

export const publisherService = {
    
    getAllPublishers() {
        return api.get("/library/publishers");
    },

    //admin
    createPublisher(publisherData) {
        return api.post("/library/publishers", publisherData);
    },
    
    //admin
    updatePublisher(id, publisherData) {
        return api.put(`/library/publishers/${id}`, publisherData);
    },

    //admin
    deletePublisher(id) {
        return api.delete(`/library/publishers/${id}`);
    }
};
