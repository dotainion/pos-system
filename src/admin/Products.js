import { IonButton, IonCard, IonContent, IonIcon, IonImg, IonInput, IonItem, IonLabel, IonList, IonPage, IonThumbnail } from '@ionic/react';
import { addOutline, trashBinOutline, trashOutline } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { AddProducts } from './AddProducts';
import { MenuBarWrapper } from '../container/MenuBar';
import { useStore } from '../context/Store';
import { deleteProductsById, getProducts } from '../database/database';
import img from '../images/beach.jpg';
import { Alert } from '../components/Alert';
import { Loader } from '../components/Loader';
import { NoRecords } from '../widgets/NoRecords';
import { ButtonWithOption } from '../widgets/ButtonWithOption';
import { Button } from '../widgets/Button';



export const Products = () =>{
    const { user } = useStore();

    const [showAddProducts, setShowAddProducts] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const [showMultipleSelect, setShowMultipleSelect] = useState(false);
    const [holdMultiple, setHoldMultiple] = useState([]);

    const [selectedRecord, setSelectedRecord] = useState({});
    const [products, setProducts] = useState([]);

    const initProducts = async() =>{
        setProducts(await getProducts(user?.storeId));
    }

    const onSearchProduts = async(value) =>{
        const prods = await getProducts(user?.storeId);
        const results = prods.filter((item)=>(
            item?.info?.title.toLowerCase().includes(value.toLowerCase())
        ));
        setProducts(results);
    }

    const onDeleteRecord = async(record, multi=null) =>{
        setShowLoader(true);
        if (multi){
            for (let item of holdMultiple){
                await deleteProductsById(item?.id);
            }
            setHoldMultiple([]);
            setShowMultipleSelect(false);
        }else await deleteProductsById(record?.id);
        await initProducts();
        setShowLoader(false);
    }

    const onSelectMultiple = (checked, record) =>{
        if (checked) setHoldMultiple([...holdMultiple, record]);
        else{
            let temp = [];
            for (let item of holdMultiple){
                if (item?.id !== record?.id) temp.push(item);
            }
            setHoldMultiple(temp);
        }
    }

    const onShowAddProducts = () =>{
        setSelectedRecord({});
        setShowAddProducts(true);
    }

    const onShowEditProducts = (obj) =>{
        setSelectedRecord(obj);
        setShowAddProducts(true)
    }

    //this is a test
    useEffect(()=>{
        initProducts();
    },[]);
    return(
        <IonPage>
            <AddProducts
                isOpen={showAddProducts}
                record={selectedRecord}
                onClose={()=>setShowAddProducts(false)}
                onUpdateComplete={initProducts}
            />
            <MenuBarWrapper onAdd={onShowAddProducts} onSearch={onSearchProduts}>
                <Loader isOpen={showLoader} />
                <NoRecords hidden={products?.length} />
                <Button
                    hidden={!holdMultiple.length}
                    onClick={()=>onDeleteRecord(null, true)} 
                    text={"Delete"}
                    cssClass="btn-dark-hoverride float-top-left dark"
                    style={{zIndex:"99",top:"10px",left:"10px",}}
                />
                <IonList class="item-container relative">
                    {
                        products?.length?
                        products.map((prod, key)=>(
                            <div className="item-info-container relative" style={{color:"white"}} key={key}>
                                <div onClick={()=>onShowEditProducts(prod)} className="item-sub-info-container dark">
                                    <IonThumbnail>
                                        <IonImg class="max-size" src={prod?.info?.image || img}/>
                                    </IonThumbnail>
                                    <div style={{whiteSpace:"nowrap",width:"75%",paddingTop:"10px"}}>
                                        <div className="pad-v-mini">Title: {prod?.info?.title}</div>
                                        <div className="pad-v-mini">Cost Price: ${prod?.info?.costPrice}</div>
                                        <div className="pad-v-mini">Sale Price: ${prod?.info?.salePrice}</div>
                                        <div className="pad-v-mini">{prod?.info?.qtyType || "Quantity"}: {prod?.info?.qty}</div>
                                    </div>
                                </div>
                                <ButtonWithOption
                                    options={[{
                                        title: "Delete",
                                        command: ()=>onDeleteRecord(prod)
                                    },{
                                        title: "Delete Multiple",
                                        command: ()=>setShowMultipleSelect(true)
                                    }]}
                                    cssClass="float-bottom-right"
                                    style={{margin:"20px"}}
                                />
                                <input 
                                    hidden={!showMultipleSelect}
                                    className="float-top-left" 
                                    style={{margin:"20px"}} 
                                    type="checkbox" 
                                    onChange={(e)=>onSelectMultiple(e.target.checked, prod)}
                                />
                            </div>
                        )):null
                    }
                </IonList>
            </MenuBarWrapper>
        </IonPage>
    )
}