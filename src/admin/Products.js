import { IonButton, IonCard, IonContent, IonIcon, IonImg, IonInput, IonItem, IonLabel, IonList, IonPage, IonThumbnail } from '@ionic/react';
import { addOutline } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { AddProducts } from '../components/AddProducts';
import { MenuBarWrapper } from '../components/MenuBar';
import { getProducts } from '../database/database';
import img from '../images/beach.jpg';



export const Products = () =>{
    const [showAddProducts, setShowAddProducts] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState({});

    //this is a test
    const [products, setProducts] = useState([]);

    //this is a test
    const onGetProduts = async() =>{
        setProducts(await getProducts());
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
            />
            <MenuBarWrapper onAdd={onShowAddProducts} onSearch>
                <IonList class="item-container">
                    {
                        products?.length?
                        products.map((prod, key)=>(
                            <div onClick={()=>onShowEditProducts(prod)} className="item-info-container" key={key}>
                                <div className="flex item-sub-info-container">
                                    <IonThumbnail style={{width:"25%"}}>
                                        <IonImg class="max-size" src={prod?.info?.image || img}/>
                                    </IonThumbnail>
                                    <div style={{whiteSpace:"nowrap",width:"75%"}}>
                                        <div>Title: {prod?.info?.title}</div>
                                        <div>Cost Price: ${prod?.info?.costPrice}</div>
                                        <div>Sale Price: ${prod?.info?.salePrice}</div>
                                        <div>Quantity: {prod?.info?.qty}</div>
                                    </div>
                                </div>
                            </div>
                        )):
                        <IonList>
                            <IonLabel>No Empolyee</IonLabel>
                        </IonList>
                    }
                </IonList>
            </MenuBarWrapper>
        </IonPage>
    )
}