import { addData, getData, getDataByField, getDataById, getDataByDoubleField, updateData, deleteDataById } from "./databaseRef";

const collection = {
    users: "users",
    products: "products",
    sales: "sales",
    customer: "customer",
    rewards: "rewards",
    settings: "settings",
    cashDrops: "cashdrops",
    payout: "payout",
    employees: "employees"
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

export const addEmployee = async(data) =>{
    try{
        await addData(collection.employees,data);
        return true;
    }catch(error){
        console.log(error);
        return false;
    }
}

export const getEmployees = async(uid) =>{
    try{
        return await getDataByField(collection.employees,"storeId",uid);
    }catch(error){
        console.log(error);
        return [];
    }
}

export const deleteEmployeeById = async(id) =>{
    try{
        await deleteDataById(collection.employees,id);
        return true;
    }catch(error){
        console.log(error);
        return false;
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

export const getProductsById = async(id) =>{
    try{
        return await getDataById(collection.products,id);
    }catch(error){
        console.log(error);
        return {};
    }
}

export const deleteProductsById = async(id) =>{
    try{
        await deleteDataById(collection.products,id);
        return true;
    }catch(error){
        console.log(error);
        return false;
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

export const updateSales = async(data, id) =>{
    try{
        await updateData(collection.sales, data, id);
        return true;
    }catch(error){
        console.log(error);
        return false;
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

export const getEndOfDayReporByTimeStamp = async(timeStamp, id) =>{
    try{
        return await getDataByDoubleField(collection.sales,"date", timeStamp,"storeId",id);
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

export const addCashDrops = async(data) =>{
    try{
        await addData(collection.cashDrops,data);
        return true;
    }catch(error){
        console.log(error);
        return false;
    }
}

export const getCashDrops = async(date, id) =>{
    try{
        return await getDataByDoubleField(collection.cashDrops,"storeId",id,"date",date);
    }catch(error){
        console.log(error);
        return [];
    }
}

export const addPayout = async(data) =>{
    try{
        await addData(collection.payout,data);
        return true;
    }catch(error){
        console.log(error);
        return false;
    }
}

export const getPayout = async(date, id) =>{
    try{
        return await getDataByDoubleField(collection.payout,"storeId",id,"date",date);
    }catch(error){
        console.log(error);
        return [];
    }
}