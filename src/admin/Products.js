import { IonButton, IonCard, IonContent, IonIcon, IonImg, IonInput, IonItem, IonLabel, IonList, IonPage, IonThumbnail } from '@ionic/react';
import { addOutline } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { AddProducts } from '../components/AddProducts';
import { MenuBarWrapper } from '../components/MenuBar';
import { useStore } from '../context/Store';
import { getProducts } from '../database/database';
import img from '../images/beach.jpg';



export const Products = () =>{
    const { user } = useStore();
    const [showAddProducts, setShowAddProducts] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState({});

    const [products, setProducts] = useState([]);

    const onGetProduts = async() =>{
        setProducts(await getProducts(user?.storeId));
    }

    const onSearchProduts = async(value) =>{
        const prods = await getProducts(user?.storeId);
        const results = prods.filter((item)=>(
            item?.info?.title.toLowerCase().includes(value.toLowerCase())
        ));
        setProducts(results);
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
        onGetProduts();
    },[]);
    return(
        <IonPage>
            <AddProducts
                isOpen={showAddProducts}
                record={selectedRecord}
                onClose={()=>setShowAddProducts(false)}
                onUpdateComplete={onGetProduts}
            />
            <MenuBarWrapper onAdd={onShowAddProducts} onSearch={onSearchProduts}>
                <IonList class="item-container">
                    {
                        products?.length?
                        products.map((prod, key)=>(
                            <div onClick={()=>onShowEditProducts(prod)} className="item-info-container" key={key}>
                                <div className="item-sub-info-container dark">
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
                            </div>
                        )):
                        <div>No Products</div>
                    }
                </IonList>
            </MenuBarWrapper>
        </IonPage>
    )
}