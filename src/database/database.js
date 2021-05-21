import { addData, getData, getDataByField, getDataById, getDataMoreThanOrEqualTo, updateData } from "./databaseRef";

const collection = {
    users: "users",
    products: "products",
    sales: "sales",
    customer: "customer",
    rewards: "rewards",
    settings: "settings",
}

export const addUser = async(data, uid=null) =>{
    try{
        await addData(collection.users,data, uid);
        return true;
    }catch(error){
        console.log(error);
        return false;
    }
}

export const getUser = async(uid) =>{
    try{
        return await getDataById(collection.users,uid);
    }catch(error){
        console.log(error);
        return {};
    }
}

export const getEmployees = async(uid) =>{
    try{
        return await getDataByField(collection.users,"storeId",uid);
    }catch(error){
        console.log(error);
        return [];
    }
}

export const addProducts = async(data) =>{
    try{
        await addData(collection.products,data);
        return true;
    }catch(error){
        console.log(error);
        return false;
    }
}

export const updateProducts = async(data,id) =>{
    try{
        await updateData(collection.products,data,id);
        return true;
    }catch(error){
        console.log(error);
        return false;
    }
}

export const getProducts = async(id) =>{
    try{
        return await getDataByField(collection.products,"storeId",id);
    }catch(error){
        console.log(error);
        return [];
    }
}

export const addSale = async(data) =>{
    try{
        await addData(collection.sales, data);
        return true;
    }catch(error){
        console.log(error);
        return false;
    }
}

export const getSales = async(id) =>{
    try{
        return await getDataByField(collection.sales, "storeId", id);
    }catch(error){
        console.log(error);
        return [];
    }
}

export const addCustomer = async(data) =>{
    try{
        await addData(collection.customer,data);
        return true;
    }catch(error){
        console.log(error);
        return false;
    }
}

export const getCustomer = async(id) =>{
    try{
        return await getDataByField(collection.customer,"storeId",id);
    }catch(error){
        console.log(error);
        return [];
    }
}

export const getCustomerById = async(id) =>{
    try{
        return await getDataById(collection.customer, id);
    }catch(error){
        console.log(error);
        return {};
    }
}

export const updateCustomerReward = async(data,id) =>{
    try{
        try{
            await updateData(collection.rewards,data,id);
        }catch{
            await addData(collection.rewards,data,id);
        }
        return true;
    }catch(error){
        console.log(error);
        return false;
    }
}

export const getCustomerReward = async(id) =>{
    try{
        return await getDataById(collection.rewards,id);
    }catch(error){
        console.log(error);
        return {};
    }
}

export const updateSettings = async(data,id) =>{
    try{
        try{
            await updateData(collection.settings,data,id);
        }catch{
            await addData(collection.settings,data,id);
        }
        return true;
    }catch(error){
        console.log(error);
        return false;
    }
}

export const getSettings = async(id) =>{
    try{
        return await getDataById(collection.settings,id);
    }catch(error){
        console.log(error);
        return {};
    }
}

export const getEndOfDayReporByTimeStamp = async(timeStamp) =>{
    try{
        return await getDataByField(collection.sales,"date", timeStamp);
    }catch(error){
        console.log(error);
        return [];
    }
}

export const getLowStocks = async(id) =>{
    try{
        return await getDataByField(collection.products,"storeId", id);
    }catch(error){
        console.log(error);
        return [];
    }
}
