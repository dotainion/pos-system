import { addData, getData, getDataById, updateData } from "./databaseRef";

const collection = {
    users: "users",
    products: "products",
    sales: "sales",
    customer: "customer"
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

export const getProducts = async() =>{
    try{
        return await getData(collection.products);
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

export const getSales = async() =>{
    try{
        return await getData(collection.sales);
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

export const getCustomer = async() =>{
    try{
        return await getData(collection.customer);
    }catch(error){
        console.log(error);
        return [];
    }
}