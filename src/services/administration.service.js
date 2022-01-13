import axios from "axios";
import {getDefaultHeader} from '../constants/RESTApiData.js';
import axiosInstance from "../helpers/axios";
export const getAllUsers = (token) => {
    const allUsers = [];

    allUsers.push(getAllAdmin(token));
    allUsers.push(getAllAcademy_Leader(token));
    allUsers.push(getAllPhysical_Trainer(token));
    allUsers.push(getAllCoach(token));
    allUsers.push(getAllPsychologist(token));

    return Promise.all(allUsers);
}

export const getAllAdmin = (token) => {
    return axiosInstance.get('/admin/getAll', {
        headers: getDefaultHeader(token)
    }).then(res => {
        return res.data;
    }).catch((e) => {
        console.log(e);
    });
}

export const getAllAcademy_Leader = (token) => {
    return axiosInstance.get('/academy_leader/getAll', {
        headers: getDefaultHeader(token)
    }).then(res => {
        return res.data;
    }).catch((e) => {
        console.log(e);
    });
}

export const getAllPhysical_Trainer = (token) => {
    return axiosInstance.get('/physical_trainer/getAll', {
        headers: getDefaultHeader(token)
    }).then(res => {
        return res.data;
    }).catch((e) => {
        console.log(e);
    });
}

export const getAllCoach = (token) => {
    return axiosInstance.get('/coach/getAll', {
        headers: getDefaultHeader(token)
    }).then(res => {
        return res.data;
    }).catch((e) => {
        console.log(e);
    });
}

export const getAllPsychologist = (token) => {
    return axiosInstance.get('/psychologist/getAll', {
        headers: getDefaultHeader(token)
    }).then(res => {
        return res.data;
    }).catch((e) => {
        console.log(e);
    });
}

/*
 * By deleting from users table,
 * you will also delete from person and role table,
 * since it is on delete cascade
 */
export const deleteUser = (token, user_id) => {
    return axiosInstance.delete('/users/delete/' + user_id, {
        headers: getDefaultHeader(token)
    }).then(res => {
        return res.data;
    }).catch((e) => {
        console.log(e);
    });
}

export const updateUserActiveId = (token, user_id, active_id) => {
    return axiosInstance.get('/users/changestatus/' + user_id + '/' + active_id, {
        headers: getDefaultHeader(token)
    }).then(res => {
        return res.data;
    }).catch((e) => {
        console.log(e);
    });
}

export const updateAdmin = (token, obj) => {
    return axiosInstance.put('/admin/update', obj, {
        headers: getDefaultHeader(token)
    });
}

export const updateAcademy_Leader = (token, obj) => {
    return axiosInstance.put('/academy_leader/update', obj, {
        headers: getDefaultHeader(token)
    });
}

export const updatePhysical_Trainer = (token, obj) => {
    return axiosInstance.put('/physical_trainer/update', obj, {
        headers: getDefaultHeader(token)
    });
}
export const updateCoach = (token, obj) => {
    return axiosInstance.put('/coach/update', obj, {
        headers: getDefaultHeader(token)
    });
}

export const updatePsychologist = (token, obj) => {
    return axiosInstance.put('/psychologist/update', obj, {
        headers: getDefaultHeader(token)
    });
}

export const getAllRoles = (token) => {
    return axiosInstance.get('/t_role/getAll', {
        headers: getDefaultHeader(token)
    }).then(res => {
        return res.data;
    }).catch((e) => {
        console.log(e);
    });
};

export const getAllActiveStatus = (token) => {
    return axiosInstance.get('/t_active/getAll', {
        headers: getDefaultHeader(token)
    }).then(res => {
        return res.data;
    }).catch((e) => {
        console.log(e);
    });
};

export const createAdmin = (token, obj) => {
    return axiosInstance.post('/admin/create', obj, {
        headers: getDefaultHeader(token)
    });
}

export const createAcademy_Leader = (token, obj) => {
    return axiosInstance.post('/academy_leader/create', obj, {
        headers: getDefaultHeader(token)
    });
}

export const createPhysical_Trainer = (token, obj) => {
    return axiosInstance.post('/physical_trainer/create', obj, {
        headers: getDefaultHeader(token)
    });
}

export const createCoach = (token, obj) => {
    return axiosInstance.post('/coach/create', obj, {
        headers: getDefaultHeader(token)
    });
}

export const createPsychologist = (token, obj) => {
    return axiosInstance.post('/psychologist/create', obj, {
        headers: getDefaultHeader(token)
    });
}

export const getFullUserDataByUserId = (token, user_id) => {
    return axiosInstance.get('/users/getFullDataUserByUserId/' + user_id, {
        headers: getDefaultHeader(token)
    }).then(res => {
        return res.data;
    }).catch((e) => {
        console.log(e);
    });
}

export const createUserTeamMap = (token, obj) => {
    return axiosInstance.post('/usermap/create', obj, {
        headers: getDefaultHeader(token)
    });
}

export const getAllUserTeamMapOfUserId = (token, user_id) => {
    return axiosInstance.get('/usermap/getAllOf/' + user_id, {
        headers: getDefaultHeader(token)
    }).then(res => {
        return res.data;
    }).catch((e) => {
        console.log(e);
    });
}

export const deleteAllOfUser = (token, user_id) => {
    return axiosInstance.delete('/usermap/deleteAllOfUser/' + user_id, {
        headers: getDefaultHeader(token)
    }).then(res => {
        return res.data;
    }).catch((e) => {
        console.log(e);
    });
}

export const changeUserPassword = (token, userObj) => {
    return axiosInstance.post('/users/change-password', userObj, {
        headers: getDefaultHeader(token)
    });
}